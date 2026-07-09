import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const FILE_MAP = [
  { pattern: /3rd.*english/i, subject: 'English', class: 'B.A Part-I' },
  { pattern: /3rd.*islamiyat.*lazmi/i, subject: 'اسلامیات لازمی', class: 'B.A Part-I' },
  { pattern: /3rd.*islamiyat.*ikhtiyari/i, subject: 'اسلامیات اختیاری', class: 'B.A Part-I' },
  { pattern: /3rd.*amur.*sahafat/i, subject: 'امور صحافت', class: 'B.A Part-I' },
  { pattern: /3rd.*ilmul.*taleem/i, subject: 'علم التعلیم', class: 'B.A Part-I' },
  { pattern: /3rd.*mutayala.*pakistan/i, subject: 'مطالعہ پاکستان', class: 'B.A Part-I' },
  { pattern: /3rd.*siasiyat/i, subject: 'سیاسیات', class: 'B.A Part-I' },
  { pattern: /4th.*english/i, subject: 'English', class: 'B.A Part-II' },
  { pattern: /4th.*gulsan.*farsi/i, subject: 'گلشن فارسی', class: 'B.A Part-II' },
  { pattern: /4th.*amur.*sahafat/i, subject: 'امور صحافت', class: 'B.A Part-II' },
  { pattern: /4th.*syasiyat/i, subject: 'سیاسیات', class: 'B.A Part-II' },
];

const QTYPE_MAP = {
  'question & answers': 'Questions and Answers',
  'question & answer': 'Questions and Answers',
  'short questions': 'Short Questions',
  'long questions': 'Long Questions',
  'comprehension paragraphs': 'Comprehension Paragraphs',
  'poems stanzas': 'Poem Stanzas',
  'dialogues': 'Dialogues',
  'translate into english paragraphs': 'Translate into English Paragraphs',
  'verses': 'Verses',
  'hadith': 'Hadith',
  'letters': 'Letters',
  'jumlon ki drustagi': 'Jumlon ki Drustagi',
  'applications': 'Applications',
  'essays': 'Essays',
  'idioms': 'Idioms',
  'ashaar ki tashreeh': 'Ashaar ki Tashreeh',
  'paragraph ki tashreeh': 'Paragraph ki Tashreeh',
};

const SEPARATORS = new Set(['past papers', 'past paper', 'additional', 'exercise', 'grammar']);

function normalizeQuestionType(raw) {
  const lower = raw.trim().toLowerCase();
  return QTYPE_MAP[lower] || raw.trim();
}

function isQuestionLine(line) {
  return /^\s*\d+\s*[\.\)]?\s+/.test(line);
}

function isDottedTopicLine(line) {
  // Matches dotted decimal topic names like "1.2.1 ...", "2.1 ...", "5.1.2 ..."
  // These are NOT question numbers — they're topic/chapter references
  return /^\s*\d+\.\d+/.test(line);
}

function isNamedTopicLine(line) {
  // Matches topic lines like "نظم نمبر 1: فصل بہار", "حکایت نمبر:2"
  return /^\s*(نظم\s*نمبر|حکایت\s*نمبر)/.test(line);
}

function extractTopics(text) {
  const sections = text.split(/\n(?=->\s*)/);
  const topicsByType = {};

  for (const section of sections) {
    if (!section.trim()) continue;
    const lines = section.split('\n').filter(l => l.trim());

    const qtypeMatch = lines[0].match(/^->\s*(.+)/);
    if (!qtypeMatch) continue;
    const rawType = qtypeMatch[1].trim();
    const qtype = normalizeQuestionType(rawType);

    const contentLines = lines.slice(1).filter(l => l.trim());
    let expectingTopic = true;

    for (const line of contentLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const lower = trimmed.toLowerCase();

      if (SEPARATORS.has(lower)) {
        expectingTopic = true;
        continue;
      }

      if (isQuestionLine(trimmed)) {
        expectingTopic = false;
        continue;
      }

      // Dotted topic references (e.g. "1.2.1 ...") are always topics, not continuation text
      if (isDottedTopicLine(trimmed)) {
        if (!topicsByType[qtype]) topicsByType[qtype] = [];
        if (!topicsByType[qtype].includes(trimmed)) {
          topicsByType[qtype].push(trimmed);
        }
        expectingTopic = false;
        continue;
      }

      // Named topic lines like "نظم نمبر 2: زندگی", "حکایت نمبر:2" are also always topics
      if (isNamedTopicLine(trimmed)) {
        if (!topicsByType[qtype]) topicsByType[qtype] = [];
        if (!topicsByType[qtype].includes(trimmed)) {
          topicsByType[qtype].push(trimmed);
        }
        expectingTopic = false;
        continue;
      }

      if (expectingTopic) {
        if (!topicsByType[qtype]) topicsByType[qtype] = [];
        if (!topicsByType[qtype].includes(trimmed)) {
          topicsByType[qtype].push(trimmed);
        }
        expectingTopic = false;
        continue;
      }

      // Continuation text — skip, don't flip expectingTopic
    }
  }

  return topicsByType;
}

const dirPath = 'D:/brighttestsolution/frontend/BA 3rd & 4th/BA 3rd & 4th';
const files = readdirSync(dirPath).filter(f => f.endsWith('.txt'));

const result = {};

for (const file of files) {
  const fullPath = join(dirPath, file);
  const text = readFileSync(fullPath, 'utf8');

  let subject = null;
  let className = null;
  for (const mapping of FILE_MAP) {
    if (mapping.pattern.test(file)) {
      subject = mapping.subject;
      className = mapping.class;
      break;
    }
  }

  if (!subject) {
    console.warn(`  WARNING: No mapping for "${file}", skipping`);
    continue;
  }

  const board = 'BA';
  const key = `${subject}-${className}-${board}`;
  const topicsByType = extractTopics(text);

  const topicTypes = {};
  for (const [qtype, topics] of Object.entries(topicsByType)) {
    for (const topic of topics) {
      if (!topicTypes[topic]) topicTypes[topic] = [];
      if (!topicTypes[topic].includes(qtype)) {
        topicTypes[topic].push(qtype);
      }
    }
  }

  if (Object.keys(topicTypes).length > 0) {
    result[key] = topicTypes;
    console.log(`  ${key}: ${Object.keys(topicTypes).length} topics, ${Object.keys(topicsByType).length} question types`);
  }
}

writeFileSync('./src/data/baTopicWiseTypes.json', JSON.stringify(result, null, 2));
console.log(`\nWritten to src/data/baTopicWiseTypes.json (${Object.keys(result).length} subjects)`);
