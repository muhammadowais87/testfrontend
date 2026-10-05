const stripLeadingNumber = (text: string) =>
  text.replace(/^\d+[\s.。،]+/, "").trim();

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

// Safety strip: remove trailing Urdu text from an English-only option value
export function sanitizeOptionValue(val: string, lang: "english" | "urdu"): string {
  if (!val) return val;
  if (lang === "english") {
    const idx = val.search(/[\u0600-\u06FF]/);
    return idx === -1 ? val : val.slice(0, idx).trim();
  }
  const idx = val.search(/[\u0600-\u06FF]/);
  if (idx === -1) return val;
  return val.slice(idx).trim();
}

export function splitVerseText(text: string): string[] {
  if (!text || !text.includes("\t")) return [text];
  return text.split("\t").map((s) => s.trim()).filter(Boolean);
}

export { stripLeadingNumber };
