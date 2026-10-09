// Strips a question-number prefix like "62. " or "119۔ " embedded in stored text.
// Requires an actual punctuation mark AND at least one trailing space right after the
// digits, so genuine numeric content at the start of a sentence is left alone: "186000
// seconds..." has no punctuation after the number, and a decimal like "2574.32 kg" has
// the period immediately followed by more digits, not a space.
const stripLeadingNumber = (text: string) =>
  text.replace(/^\d+[.。،۔]\s+/, "").trim();

export type ParsedQuestionOptions = {
  stem: string;
  options: Array<{ key: string; value: string }>;
};

export function parseQuestionOptions(text: string): ParsedQuestionOptions {
  const optionRegex = /\(([A-D])\)\s*((?:(?!\s*\([A-D]\)).)+?)(?=\s*\([A-D]\)|$)/g;
  const options: Array<{ key: string; value: string }> = [];
  let match: RegExpExecArray | null;

  while ((match = optionRegex.exec(text)) !== null) {
    options.push({ key: match[1], value: match[2].trim() });
  }

  if (options.length === 0) {
    return { stem: stripLeadingNumber(text.trim()), options: [] };
  }

  const firstOptionIndex = text.search(/\([A-D]\)/);
  const rawStem = firstOptionIndex > -1 ? text.slice(0, firstOptionIndex).trim() : text.trim();
  return { stem: stripLeadingNumber(rawStem), options };
}

export function getQuestionStems(text: string, urdu = "") {
  const parsedText = parseQuestionOptions(text || "");
  const parsedUrdu = parseQuestionOptions(urdu || "");

  const englishStem =
    parsedText.stem
    || (parsedText.options.length === 0 ? stripLeadingNumber(text || "") : "")
    || stripLeadingNumber(urdu || "");

  const urduStem =
    parsedUrdu.stem
    || parsedText.stem
    || (parsedUrdu.options.length === 0 ? stripLeadingNumber(urdu || "") : "")
    || englishStem;

  return { englishStem, urduStem, parsedText, parsedUrdu };
}

export function mergeMcqOptions(
  parsedA: ParsedQuestionOptions,
  parsedB: ParsedQuestionOptions,
) {
  const keys = Array.from(new Set([
    ...parsedA.options.map((o) => o.key),
    ...parsedB.options.map((o) => o.key),
  ])).sort();

  return keys.map((key) => ({
    key,
    english: parsedA.options.find((o) => o.key === key)?.value || "",
    urdu: parsedB.options.find((o) => o.key === key)?.value || "",
  }));
}

// Safety strip for options that still have leftover mixed-language content.
export function sanitizeOptionValue(val: string, lang: "english" | "urdu"): string {
  if (!val) return val;
  if (lang === "english") {
    // English: drop any trailing Urdu text that leaked onto the end of the value.
    const idx = val.search(/[\u0600-\u06FF]/);
    return idx === -1 ? val : val.slice(0, idx).trim();
  }
  // Urdu: only drop a leaked leading run of LATIN LETTERS (a real English word/phrase
  // glued to the front, e.g. "LocalPC \u0645\u0642\u0627\u0645\u06CC \u06A9\u0645\u067E\u06CC\u0648\u0679\u0631"). Never strip leading digits or
  // symbols -- those are legitimate Urdu-side content ("1/72 \u0627\u0646\u0686", "186000 \u0633\u06CC\u06A9\u0646\u0688\u0632").
  const m = val.match(/^[A-Za-z][A-Za-z\s]*/);
  if (!m) return val;
  const rest = val.slice(m[0].length).trim();
  return /[\u0600-\u06FF]/.test(rest) ? rest : val;
}

export function splitVerseText(text: string): string[] {
  if (!text || !text.includes("\t")) return [text];
  return text.split("\t").map((s) => s.trim()).filter(Boolean);
}

// True for a chapterPart/topic/question-type key that holds "Comprehension Paragraph"
// data: one prose paragraph followed by several short questions about it, stored as
// separate items in the bank but meant to be selected and shown together as one set.
// Covers both the English type ("comprehension_paragraph"/plural) and its Urdu
// equivalent ("tafheem_ibarat" -- تفہیم عبارت, "Comprehension of Passage").
export function isComprehensionType(key: string | null | undefined): boolean {
  if (!key) return false;
  const normalized = key.trim().toLowerCase().replace(/\s+/g, "_");
  return (
    normalized === "comprehension_paragraph"
    || normalized === "comprehension_paragraphs"
    || normalized === "tafheem_ibarat"
  );
}

export type ComprehensionSet<T> = { paragraph: T; questions: T[] };

// Groups a flat, originally-ordered list of comprehension-paragraph items into
// { paragraph, questions } sets. A paragraph is identified as the long-prose item (the
// bank's questions about it are always short, single-sentence); everything short that
// follows a paragraph belongs to that paragraph's set, until the next long item starts a
// new one. Falls back to treating any item as a new paragraph if a set hasn't started yet
// (e.g. the very first item, even if unexpectedly short), so no item is ever dropped.
export function groupComprehensionSets<T extends { text: string }>(items: T[]): ComprehensionSet<T>[] {
  const PARAGRAPH_MIN_LENGTH = 120;
  const sets: ComprehensionSet<T>[] = [];
  for (const item of items) {
    const isParagraph = (item.text || "").trim().length >= PARAGRAPH_MIN_LENGTH;
    if (isParagraph || sets.length === 0) {
      sets.push({ paragraph: item, questions: [] });
    } else {
      sets[sets.length - 1].questions.push(item);
    }
  }
  return sets;
}

export { stripLeadingNumber };
