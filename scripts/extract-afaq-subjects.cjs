#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');
const glob = require('glob');

const publicDir = path.join(__dirname, '..', 'public');
const outPath = path.join(__dirname, '..', 'src', 'data', 'afaqSubjects.generated.json');

function filenameToClass(name) {
  const n = name.toLowerCase();
  if (n.includes('one')) return 'ONE';
  if (n.includes('two')) return 'TWO';
  if (n.includes('three')) return 'THREE';
  if (n.includes('four') || n.includes('4')) return 'FOUR';
  if (n.includes('5th') || n.includes('5')) return '5TH';
  if (n.includes('6th') || n.includes('6')) return '6TH';
  if (n.includes('7th') || n.includes('7')) return '7TH';
  return name.toUpperCase();
}

async function run() {
  const worker = await createWorker();

  try {
    // tesseract.js v7+ workers are preloaded; skip explicit load/language initialization

    const all = fs.readdirSync(publicDir);
    const files = all.filter(name => {
      const lower = name.toLowerCase();
      // match afaq / afaaq variants
      return /afaa?q/i.test(lower) && /\.(png|jpe?g|webp|gif)$/i.test(name);
    }).map(n => path.join(publicDir, n));

    if (files.length === 0) {
      console.error('No AFAQ images found in public/ matching afaq/afaaq patterns');
      process.exit(1);
    }

    const result = {};
    for (const file of files) {
      const base = path.basename(file);
      const cls = filenameToClass(base);
      console.log('\nProcessing', base, 'as', cls);
      const { data: { text } } = await worker.recognize(file);
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const subjects = lines
        .map(l => l.replace(/^[0-9.\-\s]+/, '').trim())
        .filter(l => l.length >= 2 && l.length <= 60)
        .filter(l => !/^[-\u2014]+$/.test(l))
        .reduce((acc, cur) => { if (!acc.includes(cur)) acc.push(cur); return acc; }, []);

      const entries = subjects.map((title) => {
        const low = title.toLowerCase();
        let series = '';
        if (/sun|scholar|series|سن|اسکالر|سریز|سِریز|سان/i.test(low)) series = 'Sun Series';
        if (/iqbal|اقبال|scholar/i.test(low)) series = series || 'Iqbal Series';
        return { title, series };
      });

      result[cls] = entries;
      console.log(' -> found', entries.length, 'lines');
    }

    fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
    console.log('\nWrote generated subjects to', outPath);

    await worker.terminate();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
