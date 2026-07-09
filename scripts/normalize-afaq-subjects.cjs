#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'afaqSubjects.generated.json');

if (!fs.existsSync(dataPath)) {
  console.error('generated file not found:', dataPath);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const canonicalMap = [
  { name: 'English', keys: ['english', 'eng'] },
  { name: 'Mathematics', keys: ['mathematics', 'mathematics', 'math', 'maths'] },
  { name: 'Computer', keys: ['computer', 'computer science', 'computing'] },
  { name: 'General Science', keys: ['general science', 'general', 'generalscience'] },
  { name: 'Social Studies', keys: ['social studies', 'social study', 'social'] },
  { name: 'Physics', keys: ['physics'] },
  { name: 'Chemistry', keys: ['chemistry'] },
  { name: 'Biology', keys: ['biology', 'bio'] },
  { name: 'Urdu', keys: ['urdu'] },
  { name: 'Islamiyat', keys: ['islam', 'islamiyat', 'islamiat'] },
  { name: 'History', keys: ['history'] },
  { name: 'Geography', keys: ['geography'] },
  { name: 'Nazra Quran', keys: ['nazra', 'quran'] },
  { name: 'Home Economics', keys: ['home economics', 'home'] },
  { name: 'Punjabi', keys: ['punjabi'] },
  { name: 'Economics', keys: ['economics', 'economy', 'maashiyat'] },
  { name: 'Library Science', keys: ['library', 'library science'] },
];

// build a flat list of canonical keys for fuzzy matching
const flatCanonicals = [];
for (const c of canonicalMap) {
  flatCanonicals.push({ name: c.name, key: c.name.toLowerCase() });
  for (const k of c.keys) flatCanonicals.push({ name: c.name, key: k.toLowerCase() });
}

function tokens(s) {
  return s.split(/\s+/).filter(Boolean);
}

function jaccard(a, b) {
  const A = new Set(tokens(a));
  const B = new Set(tokens(b));
  const inter = [...A].filter(x => B.has(x)).length;
  const uni = new Set([...A, ...B]).size;
  if (uni === 0) return 0;
  return inter / uni;
}

function titleCase(s) {
  return s.replace(/\w[^\s]*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

function cleanRaw(str) {
  if (!str) return '';
  // keep latin letters, arabic/urdu letters, digits and spaces
  const cleaned = str.replace(/[^A-Za-z\u0600-\u06FF0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned;
}

function detectSeries(s) {
  const low = s.toLowerCase();
  if (/\b(sun)\b/.test(low)) return 'Sun Series';
  if (/\b(iqbal)\b/.test(low)) return 'Iqbal Series';
  if (/\b(scholar)\b/.test(low)) return 'Scholar Series';
  return '';
}

function mapToCanonical(rawTitle) {
  const cleaned = cleanRaw(rawTitle);
  const low = cleaned.toLowerCase();
  // remove words like 'sun series' etc before matching
  const noSeries = low.replace(/\b(sun|iqbal|scholar)\b/g, '');

  for (const item of canonicalMap) {
    for (const k of item.keys) {
      if (noSeries.includes(k)) return { title: item.name, series: detectSeries(rawTitle) };
    }
  }

  // try fuzzy matching against canonical keys
  let best = { score: 0, name: null };
  for (const cand of flatCanonicals) {
    const score = Math.max(jaccard(noSeries, cand.key), jaccard(low, cand.key));
    if (score > best.score) best = { score, name: cand.name };
  }
  if (best.score >= 0.35) {
    return { title: best.name, series: detectSeries(rawTitle) };
  }

  // fallback: if cleaned text has at least 2 alphabetic chars and few words, keep but title-case it
  if (/^[0-9\s]+$/.test(cleaned)) return null;
  const words = cleaned.split(' ').filter(Boolean);
  const alphaCount = (cleaned.match(/[A-Za-z\u0600-\u06FF]/g) || []).length;
  if (alphaCount >= 2 && words.length <= 4 && cleaned.length <= 40) {
    return { title: titleCase(cleaned), series: detectSeries(rawTitle) };
  }

  return null;
}

const out = {};

for (const [cls, arr] of Object.entries(raw)) {
  // deterministic: include only canonical subjects when matched in any OCR line
  const found = new Set();
  const lines = (arr || []).map(x => (x.title || '').toLowerCase());
  for (const cand of flatCanonicals) {
    for (const line of lines) {
      if (!line) continue;
      const cleanedLine = line.replace(/[^a-z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim();
      if (cleanedLine.includes(cand.key) || jaccard(cleanedLine, cand.key) >= 0.33) {
        found.add(cand.name);
        break;
      }
    }
  }

  // preserve a sane display order using canonicalMap order
  out[cls] = [];
  for (const c of canonicalMap) {
    if (found.has(c.name)) out[cls].push({ title: c.name, series: '' });
  }
}

fs.writeFileSync(dataPath, JSON.stringify(out, null, 2), 'utf8');
console.log('Normalized and wrote', dataPath);
