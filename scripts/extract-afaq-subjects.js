#!/usr/bin/env node
/**
 * Extract AFAQ subjects from images in `public/` using tesseract.js
 * Generates `src/data/afaqSubjects.generated.json` with structure { CLASS: [{title, series}, ...], ... }
 *
 * Usage:
 *   cd frontend
 *   npm install tesseract.js glob
 *   npm run extract:afaq
 */
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
  const worker = await createWorker({
    logger: (m) => process.stdout.write('.')
  });

  try {
    await worker.load();
    // try load english + urdu if available, fallback to eng
    try {
      await worker.loadLanguage('eng+urd');
      await worker.initialize('eng+urd');
    } catch (e) {
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
    }

    const pattern = path.join(publicDir, '*afaq*.*');
    const files = glob.sync(pattern, { nocase: true });
    if (files.length === 0) {
      console.error('No AFAQ images found in public/ matching *afaq*');
      process.exit(1);
    }

    const result = {};
    for (const file of files) {
      const base = path.basename(file);
      const cls = filenameToClass(base);
      console.log('\nProcessing', base, 'as', cls);
      const { data: { text } } = await worker.recognize(file);
      // split lines and filter
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      // Heuristic: find lines that look like subject names (non-punctuation, length 2-40)
      const subjects = lines
        .map(l => l.replace(/^[0-9.\-\s]+/, '').trim())
        .filter(l => l.length >= 2 && l.length <= 60)
        // remove very short words
        .filter(l => !/^[-\u2014]+$/.test(l))
        // dedupe
        .reduce((acc, cur) => { if (!acc.includes(cur)) acc.push(cur); return acc; }, []);

      // series detection: look for keywords
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
