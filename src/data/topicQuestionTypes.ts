import topicData from "./topicQuestionTypes.json";

/**
 * Map of subject name → topic/chapter key → list of available question types.
 * Built from the "topic wise types.txt" analysis report.
 *
 * Subject names match report display names (e.g. "Biology", "Chemistry", "English", etc.)
 * Topic keys are either decimal IDs (e.g. "1.1") or full topic names.
 */
const topicQuestionTypesMap: Record<string, Record<string, string[]>> =
  topicData as Record<string, Record<string, string[]>>;

/**
 * Map from report display name → app internal value used in the question-type dropdown.
 * Report names come from the generated "topic wise types.txt" file.
 */
const REPORT_TYPE_TO_APP_VALUE: Record<string, string> = {
  mcqs: "mcq",
  "short questions": "short",
  short: "short",
  "long questions": "long",
  "long question": "long",
  long: "long",
  grammar: "grammar",
  summary: "summary",
  "letter writing": "letters",
  story: "stories",
  stories: "stories",
  "dialogue writing": "dialoges",
  dialogue: "dialoges",
  comprehension: "comprehension_paragraph",
  "comprehension paragraph": "comprehension_paragraph",
  "idioms/sentences": "ilfaz_ko_jumlo_mein_istamal",
  "idioms sentences": "ilfaz_ko_jumlo_mein_istamal",
  ideoms: "ideoms",
  "fill in tha blanks": "fill_in_tha_blanks",
  poetry: "ashaar_ki_tashreeh",
  "word meanings": "words_meanings",
  "words meanings": "words_meanings",
  translation: "farsi_tarjuma",
  ayat: "ayaat",
  ayaat: "ayaat",
  hadith: "hadith",
  ahadees: "ahadees",
  shakhsiyaat: "shakhsiyat",
  shakhsiyat: "shakhsiyat",
  "application writing": "darkhaastein",
  "question and answers": "questions_answers",
  "questions and answers": "questions_answers",
  "translate into urdu paragraph": "translate_into_urdu_paragraph",
  "writing paragraphs": "writing_paragraphs",
  "tick correct spellings": "tick_correct_spellings",
  "correct meaning of underline word": "correct_meaning_of_underline_word",
  "tick correct form of verb": "tick_correct_form_of_verb",
  "tick correct according to grammer": "tick_correct_according_to_grammer",
  "active and passive voice": "active_and_passive_voice",
  "poem stanzas": "poem_stanzas",
  "direct and indirect": "direct_and_indirect",
  "pair of words": "pair_of_words",
  "punctuate the paragraph": "punctuate_the_paragraph",
  "words into sentences": "words_into_sentences",
  mukalmy: "mukalmy",
  "tafheem ibarat": "tafheem_ibarat",
  "jumlo ki darustagi": "jumlo_ki_darustagi",
  "jumlo ki takmeel": "jumlo_ki_takmeel",
  "paragraph ki tashreeh": "paragraph_ki_tashreeh",
  "ilfaz maani": "ilfaz_maani",
  "khali jaga pur karein": "khali_jaga_pur_karein",
  "wahid jama": "wahid_jama",
  "muzakir monas": "muzakir_monas",
  "ilfaz mutazad": "ilfaz_mutazad",
  "ilfaz mutaradif": "ilfaz_mutaradif",
  "araab lagaein": "araab_lagaein",
  "markazi khayal": "markazi_khayal",
  "ilfaz ko jumlo mein istamal": "ilfaz_ko_jumlo_mein_istamal",
  "ashar ki tashreeh": "ashar_ki_tashreeh",
  "ashaar ki tashreeh": "ashaar_ki_tashreeh",
};

const normalizeReportType = (reportType: string): string =>
  reportType
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const SUBJECT_ALIASES: Record<string, string> = {
  "اردو لازمی": "Urdu",
  "اردو": "Urdu",
  "Urdu": "Urdu",
  "اسلامیات لازمی": "Islamiyat Lazmi",
  "اسلامیات": "Islamiyat Lazmi",
  "Islamiyat Lazmi": "Islamiyat Lazmi",
  "ترجمہ القرآن المجید": "Tarjuma tul Quran",
  "Tarjuma tul Quran": "Tarjuma tul Quran",
  "پنجابی": "Punjabi",
  "Punjabi": "Punjabi",
  "اسلامیات اختیاری": "Islamiyat Ikhtayari",
  "Islamiyat Ikhtayari": "Islamiyat Ikhtayari",
  "ایجوکیشن": "Education",
  "Education": "Education",
  "معاشیات": "Maashiyat",
  "Maashiyat": "Maashiyat",
  "اخلاقیات": "Ikhlaqiat",
  "Ikhlaqiat": "Ikhlaqiat",
  "ہوم اکنامکس": "Home Economics",
  "Home Economics": "Home Economics",
  "فزیکل ایجوکیشن": "Physical Education",
  "Physical Education": "Physical Education",
  "مرغبانی": "Murgbani",
  "Murgbani": "Murgbani",
  "غذا اور غذائیت": "Gaza Aur Gazaiyat",
  "Gaza Aur Gazaiyat": "Gaza Aur Gazaiyat",
  "پارچہ بافی اور لباس": "Parcha Bafi Aur Labas",
  "Parcha Bafi Aur Labas": "Parcha Bafi Aur Labas",
  "علم شہریت": "علم شہریت",
  "Civics": "علم شہریت",
};

const normalizeSubject = (subject: string): string => normalizeText(subject).replace(/[^a-z0-9]/gi, "");

/**
 * Clean chapter name by removing leading and trailing decimal numbers, dots, hyphens, and spaces.
 */
const cleanChapterName = (chapter: string): string => {
  return chapter
    .trim()
    .replace(/^[\d\.\-\s]+/, "")
    .replace(/[\d\.\-\s]+$/, "")
    .trim();
};

/**
 * Normalize Urdu/Arabic characters for comparison.
 */
const normalizeText = (str: string): string => {
  return str
    .replace(/[\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED]/g, "") // remove Arabic diacritics
    .replace(/[أإآ]/g, "ا")
    .replace(/[يے]/g, "ی")
    .replace(/[ھ]/g, "ہ")
    .replace(/\s+/g, "")
    .toLowerCase();
};

/**
 * Given a subject name and list of selected chapters, returns the union of
 * available question-type APP VALUES (e.g. "mcq", "short", "long") for those chapters.
 *
 * Returns null if:
 * - No subject mapping found in the report
 * - No chapters selected
 * - No chapters matched the report data (fallback: show all)
 */
export const getAvailableQuestionTypesForTopics = (
  subject: string,
  selectedChapters: string[],
  className: string
): string[] | null => {
  // Topic-wise types data currently covers 9th class only.
  const normalizedClass = (className || "").toUpperCase().replace(/\s+/g, "");
  if (!normalizedClass.includes("9TH")) return null;

  const resolvedSubject = SUBJECT_ALIASES[subject] || subject;
  let subjectMap = topicQuestionTypesMap[resolvedSubject];
  if (!subjectMap) {
    const normalizedSubject = normalizeSubject(subject);
    const matchingKey = Object.keys(topicQuestionTypesMap).find((key) => normalizeSubject(key) === normalizedSubject);
    if (matchingKey) {
      subjectMap = topicQuestionTypesMap[matchingKey];
    }
  }
  if (!subjectMap) {
    const normalizedSubject = normalizeSubject(subject);
    const matchingKey = Object.keys(topicQuestionTypesMap).find((key) => {
      const normalizedKey = normalizeSubject(key);
      return normalizedKey.includes(normalizedSubject) || normalizedSubject.includes(normalizedKey);
    });
    if (matchingKey) {
      subjectMap = topicQuestionTypesMap[matchingKey];
    }
  }
  if (!subjectMap) return null;

  if (!selectedChapters || selectedChapters.length === 0) return null;

  const unionReportTypes = new Set<string>();
  let anyMatched = false;

  for (const chapter of selectedChapters) {
    const trimmed = chapter.trim();
    if (!trimmed) continue;

    // Check if the chapter represents a generic exercise/review/constructed response
    const isExercise = ["exercise", "constructed response", "review"].some((x) =>
      trimmed.toLowerCase().includes(x)
    );
    if (isExercise) continue;

    const cleaned = cleanChapterName(trimmed);
    const normalizedCleaned = normalizeText(cleaned);

    let chapterMatched = false;

    // 1. Try direct exact match on trimmed
    if (subjectMap[trimmed]) {
      subjectMap[trimmed].forEach((t) => unionReportTypes.add(t));
      chapterMatched = true;
    }
    // 2. Try match on cleaned chapter name
    else if (subjectMap[cleaned]) {
      subjectMap[cleaned].forEach((t) => unionReportTypes.add(t));
      chapterMatched = true;
    }
    // 3. Try lookup using any decimal pattern (e.g. "2.1") matched in the string
    else {
      const decimalMatches = trimmed.match(/\d+\.\d+/g) || [];
      for (const d of decimalMatches) {
        if (subjectMap[d]) {
          subjectMap[d].forEach((t) => unionReportTypes.add(t));
          chapterMatched = true;
          break;
        }
      }
    }

    // 4. Try substring and character-normalized matching
    if (!chapterMatched) {
      const reportKeys = Object.keys(subjectMap);
      for (const key of reportKeys) {
        if (key === "(Before any topic)") continue;

        const normalizedKey = normalizeText(key);
        // Match if one contains the other after normalization
        if (
          normalizedKey &&
          normalizedCleaned &&
          (normalizedCleaned.includes(normalizedKey) || normalizedKey.includes(normalizedCleaned))
        ) {
          subjectMap[key].forEach((t) => unionReportTypes.add(t));
          chapterMatched = true;
          break;
        }
      }
    }

    // 5. Fallback to "(Before any topic)" if chapter itself was not matched
    if (!chapterMatched && subjectMap["(Before any topic)"]) {
      subjectMap["(Before any topic)"].forEach((t) => unionReportTypes.add(t));
      chapterMatched = true;
    }

    if (chapterMatched) {
      anyMatched = true;
    }
  }

  // If nothing matched, return null to avoid restricting all types
  if (!anyMatched) return null;

  // Convert report display names to app internal values
  const appValues = Array.from(unionReportTypes)
    .map((reportType) => REPORT_TYPE_TO_APP_VALUE[normalizeReportType(reportType)])
    .filter(Boolean) as string[];

  return appValues.length > 0 ? appValues : null;
};

export default topicQuestionTypesMap;
