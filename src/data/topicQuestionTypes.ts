/**
 * Map of subject name → topic/chapter key → list of available question types.
 */

import topicQuestionTypesJson from "./topicQuestionTypes.json";
import oneToEightTypesJson from "./topicWiseTypesOneToEight.json";
import afaqTopicWiseTypesJson from "./afaqTopicWiseTypes.json";
import baTopicWiseTypesJson from "./baTopicWiseTypes.json";
import oxfordTopicWiseTypesJson from "./oxfordTopicWiseTypes.json";
import tenTopicWiseTypesJson from "./tenTopicWiseTypes.json";

const topicQuestionTypesMap: Record<string, Record<string, string[]>> | null = topicQuestionTypesJson as unknown as Record<string, Record<string, string[]>>;
const oneToEightTypesMap: Record<string, Record<string, string[]>> | null = oneToEightTypesJson as unknown as Record<string, Record<string, string[]>>;
const afaqTopicWiseTypesMap: Record<string, Record<string, string[]>> | null = afaqTopicWiseTypesJson as unknown as Record<string, Record<string, string[]>>;
const baTopicWiseTypesMap: Record<string, Record<string, string[]>> | null = baTopicWiseTypesJson as unknown as Record<string, Record<string, string[]>>;
const oxfordTopicWiseTypesMap: Record<string, Record<string, string[]>> | null = oxfordTopicWiseTypesJson as unknown as Record<string, Record<string, string[]>>;
const tenTopicWiseTypesMap: Record<string, Record<string, string[]>> | null = tenTopicWiseTypesJson as unknown as Record<string, Record<string, string[]>>;

const ONE_TO_EIGHT_CLASSES = new Set(["ONE", "TWO", "THREE", "FOUR", "5TH", "6TH", "7TH", "8TH"]);

const AFAQ_CLASSES = new Set(["ONE", "TWO", "THREE", "FOUR", "5TH", "6TH"]);

const BA_CLASSES = new Set(["B.APART-I", "B.APART-II"]);

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
  "idioms/sentences": "ideoms",
  "idioms sentences": "ideoms",
  ideoms: "ideoms",
  "use words in sentences": "words_into_sentences",
  "fill in tha blanks": "fill_in_tha_blanks",
  poetry: "ashaar_ki_tashreeh",
  "word meanings": "words_meanings",
  "words meanings": "words_meanings",
  translation: "farsi_tarjuma",
  "farsi tarjuma": "farsi_tarjuma",
  "farsi translation": "farsi_tarjuma",
  ayat: "ayaat",
  ayaat: "ayaat",
  hadith: "hadith",
  ahadees: "ahadees",
  shakhsiyaat: "shakhsiyat",
  shakhsiyat: "shakhsiyat",
  "application writing": "darkhaastein",
  "question and answers": "questions_answers",
  "questions and answers": "questions_answers",
  "antonyms": "ilfaz_mutazad",
  "antonymns": "ilfaz_mutazad",
  "synonyms": "ilfaz_mutaradif",
  "translate into urdu paragraph": "translate_into_urdu_paragraph",
  "translate into urdu paragraphs": "translate_into_urdu_paragraph",
  "writing paragraphs": "writing_paragraphs",
  "tick correct spellings": "tick_correct_spellings",
  "tick correct spelling": "tick_correct_spellings",
  "fill in the blanks": "fill_in_tha_blanks",
  "fill in th blanks": "fill_in_tha_blanks",
  "match columns": "match_columns",
  "match colums": "match_columns",
  "match comlumn": "match_columns",
  "multiple choice questions": "mcq",
  "mcqs": "mcq",
  "writing paragraph": "writing_paragraphs",
  "singular plural": "wahid_jama",
  "singular plurals": "wahid_jama",
  "paragraph explanation": "paragraph_ki_tashreeh",
  "essay writing": "essays",
  "letter writing": "letters",
  "application writing": "darkhaastein",
  "true false statements": "true_false_statements",
  "theme": "markazi_khayal",
  "pointing": "pointing",
  "homophones": "homophones",
  "genders": "genders",
  "sabqe lahqe": "sabqe_lahqe",
  "missing letters": "missing_letters",
  "translate into urdu sentences": "translate_into_urdu_sentences",
  "zarb ul imsal": "zarb_ul_imsal",
  "zarb ul misaal": "zarb_ul_misaal",
  "correct meaning of underline word": "correct_meaning_of_underline_word",
  "correct meaning of underlined word": "correct_meaning_of_underline_word",
  "tick correct form of verb": "tick_correct_form_of_verb",
  "correct forms of verb": "tick_correct_form_of_verb",
  "tick correct according to grammer": "tick_correct_according_to_grammer",
  "tick correct according to grammar": "tick_correct_according_to_grammer",
  "active and passive voice": "active_and_passive_voice",
  "poem stanzas": "poem_stanzas",
  "direct and indirect": "direct_and_indirect",
  "direct indirect": "direct_and_indirect",
  "pair of words": "pair_of_words",
  "punctuate the paragraph": "punctuate_the_paragraph",
  "punctuation": "punctuate_the_paragraph",
  "words into sentences": "words_into_sentences",
  "make sentences": "words_into_sentences",
  "make words": "words_into_sentences",
  mukalmy: "mukalmy",
  "tafheem ibarat": "tafheem_ibarat",
  "jumlo ki darustagi": "jumlo_ki_darustagi",
  "jumlo ki takmeel": "jumlo_ki_takmeel",
  "jumlon ki takmeel": "jumlo_ki_takmeel",
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
  // BA-specific types
  "translate into english paragraphs": "translate_into_english_paragraphs",
  "verses": "ayaat",
  "idioms": "ideoms",
  "essays": "essays",
  "jumlon ki drustagi": "jumlo_ki_darustagi",
  // standalone keys missing from above
  summary: "summary",
  letters: "letters",
  receipt: "receipt",
  stories: "stories",
  applications: "darkhaastein",
  "question and answers": "questions_answers",
  "ashaar ki tashreeh": "ashaar_ki_tashreeh",
  "markazi khayal": "markazi_khayal",
  "paragraph ki tashreeh": "paragraph_ki_tashreeh",
  "comprehension paragraph": "comprehension_paragraph",
  "jumlo ki darustagi": "jumlo_ki_darustagi",
  "zarb ul misaal": "zarb_ul_misaal",
  "fill in the blanks": "fill_in_tha_blanks",
  "words into sentences": "words_into_sentences",
  "words meanings": "words_meanings",
  "pair of words": "pair_of_words",
  dialogues: "dialoges",
  history: "history",
  newsletters: "newsletters",
  "takhlees ibarat": "takhlees_ibarat",
  "tick correct synonyms": "tick_correct_synonyms",
  "tick correct form of verb": "tick_correct_form_of_verb",
  "translate into urdu paragraph": "translate_into_urdu_paragraph",
  "poem stanzas": "poem_stanzas",
  // 1st year Urdu specific types
  "question answers": "questions_answers",
  "comprehension paragraphs": "comprehension_paragraph",
  "comprehenion paragraph": "comprehension_paragraph",
  "dialogues": "dialoges",
  "appliations": "darkhaastein",
  "receipt": "receipt",
  "paragraph ki tashreeh": "paragraph_ki_tashreeh",
  "takhlees ibarat": "takhlees_ibarat",
  "newsletters": "newsletters",
  "zarb ul misaail": "zarb_ul_misaal",
  "history": "history",
  // 1st year English specific types
  "tick correct synonyms": "tick_correct_synonyms",
  "words into sentences": "words_into_sentences",
  "translate into urdu para": "translate_into_urdu_paragraph",
  "poem stanzas": "poem_stanzas",
  "applications": "darkhaastein",
  "punctuate the paragraphs": "punctuate_the_paragraph",
  "tick correct form of verb": "tick_correct_form_of_verb",
  // Urdu script types for AFAQ
  "اشعار کی تشریح": "ashaar_ki_tashreeh",
  "جملوں کی تکمیل": "jumlo_ki_takmeel",
  "جملوں کی درستگی": "jumlo_ki_darustagi",
  "ضرب الامثال": "zarb_ul_imsal",
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
  const normalizedClass = (className || "").toUpperCase().replace(/\s+/g, "");

  // INTER-II has no static type maps: its question types come from the question bank (DB).
  // Without this it would fall into the INTER-I branch below and borrow the 9th/Part 1 maps.
  if (normalizedClass === "INTER-II") return null;

  let subjectMap: Record<string, string[]> | undefined;

  // AFAQ: subject is encoded as "English||Sun Series"
  const seriesSeparatorIndex = subject.indexOf("||");
  const isAfaq = seriesSeparatorIndex !== -1 && AFAQ_CLASSES.has(normalizedClass);

  if (isAfaq) {
    const actualSubject = subject.substring(0, seriesSeparatorIndex).trim();
    const series = subject.substring(seriesSeparatorIndex + 2).trim();
    const afaqKey = `${actualSubject}-${series}-${normalizedClass}-AFAQ`;
    subjectMap = afaqTopicWiseTypesMap?.[afaqKey];
  } else if (BA_CLASSES.has(normalizedClass)) {
    const key = `${subject}-${className}-BA`;
    subjectMap = baTopicWiseTypesMap?.[key];
    if (!subjectMap) {
      const resolvedSubject = SUBJECT_ALIASES[subject] || subject;
      const aliasKey = `${resolvedSubject}-${className}-BA`;
      subjectMap = baTopicWiseTypesMap?.[aliasKey];
    }
  } else if (ONE_TO_EIGHT_CLASSES.has(normalizedClass)) {
    // Try OXFORD data first (subjects have unique names)
    // Uppercase for case-insensitive match (typography like "Computer" vs "COMPUTER")
    const oxfordKey = `${subject.toUpperCase()}-${normalizedClass}-OXFORD`;
    subjectMap = oxfordTopicWiseTypesMap?.[oxfordKey];
    // PTB classes 1-8 fallback
    if (!subjectMap) {
      const directKey = `${subject}-${normalizedClass}-PTB`;
      subjectMap = oneToEightTypesMap?.[directKey];
    }
    if (!subjectMap) {
      const resolvedSubject = SUBJECT_ALIASES[subject] || subject;
      subjectMap = oneToEightTypesMap?.[`${resolvedSubject}-${normalizedClass}-PTB`];
    }
    if (!subjectMap) {
      const normalizedSubject = normalizeSubject(subject);
      const classSuffix = `-${normalizedClass}-PTB`;
      const matchingKey = Object.keys(oneToEightTypesMap ?? {}).find((k) => {
        if (!k.endsWith(classSuffix)) return false;
        const keySubj = k.slice(0, k.length - classSuffix.length);
        const normKeySubj = normalizeSubject(keySubj);
        return normKeySubj === normalizedSubject ||
               normKeySubj.includes(normalizedSubject) ||
               normalizedSubject.includes(normKeySubj);
      });
      if (matchingKey) subjectMap = oneToEightTypesMap?.[matchingKey];
    }
  } else if (normalizedClass.includes("10TH")) {
    // 10th class — use tenTopicWiseTypes.json with subject-10TH-PTB key
    const classSuffix = "-10TH-PTB";
    const resolvedSubject = SUBJECT_ALIASES[subject] || subject;
    const directKey = resolvedSubject + classSuffix;
    subjectMap = tenTopicWiseTypesMap?.[directKey];
    if (!subjectMap) {
      const normalizedSubject = normalizeSubject(subject);
      const matchingKey = Object.keys(tenTopicWiseTypesMap ?? {}).find((key) => {
        if (!key.endsWith(classSuffix)) return false;
        const keySubj = key.slice(0, key.length - classSuffix.length);
        const normKeySubj = normalizeSubject(keySubj);
        return normKeySubj === normalizedSubject ||
               normKeySubj.includes(normalizedSubject) ||
               normalizedSubject.includes(normKeySubj);
      });
      if (matchingKey) subjectMap = tenTopicWiseTypesMap?.[matchingKey];
    }
  } else if (normalizedClass.includes("9TH") || normalizedClass.includes("1ST") || normalizedClass.includes("INTER")) {
    // 9th class and 1st year — try class-specific key first to avoid chapter name conflicts
    const classSuffix = normalizedClass.includes("INTER") ? "-INTER-I" : "";
    const resolvedSubject = SUBJECT_ALIASES[subject] || subject;
    const directKey = resolvedSubject + classSuffix;
    // eslint-disable-next-line no-console
    console.debug('getAvailableQuestionTypesForTopics: directKey ->', JSON.stringify(directKey), 'classSuffix ->', classSuffix, 'subjectMap exists?', !!topicQuestionTypesMap?.[directKey], 'all keys:', Object.keys(topicQuestionTypesMap ?? {}).filter(k => k.includes(resolvedSubject)));
    subjectMap = topicQuestionTypesMap?.[directKey] || topicQuestionTypesMap?.[resolvedSubject];
    if (!subjectMap) {
      const normalizedSubject = normalizeSubject(subject);
      // Try matching any key that starts with the subject name + "-"
      const prefixedKey = Object.keys(topicQuestionTypesMap ?? {}).find(
        (key) => key.startsWith(resolvedSubject + "-") && normalizeSubject(key) === normalizedSubject
      );
      if (prefixedKey) {
        subjectMap = topicQuestionTypesMap?.[prefixedKey];
      }
    }
    if (!subjectMap) {
      const normalizedSubject = normalizeSubject(subject);
      const matchingKey = Object.keys(topicQuestionTypesMap ?? {}).find((key) => normalizeSubject(key) === normalizedSubject);
      if (matchingKey) {
        subjectMap = topicQuestionTypesMap?.[matchingKey];
      }
    }
    if (!subjectMap) {
      const normalizedSubject = normalizeSubject(subject);
      const matchingKey = Object.keys(topicQuestionTypesMap ?? {}).find((key) => {
        const normalizedKey = normalizeSubject(key);
        return normalizedKey.includes(normalizedSubject) || normalizedSubject.includes(normalizedKey);
      });
      if (matchingKey) {
        subjectMap = topicQuestionTypesMap?.[matchingKey];
      }
    }
  } else {
    return null;
  }

  if (!subjectMap) return null;

  if (!selectedChapters || selectedChapters.length === 0) return null;

  const unionReportTypes = new Set<string>();
  let anyMatched = false;

  // eslint-disable-next-line no-console
  console.debug('getAvailableQuestionTypesForTopics: subjectMap keys ->', Object.keys(subjectMap).slice(0, 5), '... total:', Object.keys(subjectMap).length);

  for (const chapter of selectedChapters) {
    const trimmed = chapter.trim();
    if (!trimmed) continue;

    // Check if the chapter represents a generic exercise/constructed response (not review)
    const isExercise = ["exercise", "constructed response"].some((x) =>
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
        // 3b. Try finding a subjectMap key that starts with the decimal number
        if (!chapterMatched) {
          const matchingFullKey = Object.keys(subjectMap).find(
            (key) => key.startsWith(d + " ") || key.startsWith(d + "\t")
          );
          if (matchingFullKey) {
            subjectMap[matchingFullKey].forEach((t) => unionReportTypes.add(t));
            chapterMatched = true;
            break;
          }
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

    if (!chapterMatched) {
      // eslint-disable-next-line no-console
      console.debug('getAvailableQuestionTypesForTopics: NO MATCH for chapter ->', JSON.stringify(trimmed));
    }

    if (chapterMatched) {
      anyMatched = true;
    }
  }

  // If nothing matched, return ALL types from the subject map so no types are lost.
  if (!anyMatched) {
    const allTypes = new Set<string>();
    Object.values(subjectMap).forEach((types) => types.forEach((t) => allTypes.add(t)));
    const appValues = Array.from(allTypes)
      .map((reportType) => {
        const direct = REPORT_TYPE_TO_APP_VALUE[reportType];
        if (direct) return direct;
        return REPORT_TYPE_TO_APP_VALUE[normalizeReportType(reportType)];
      })
      .filter(Boolean) as string[];
    return appValues.length > 0 ? appValues : null;
  }

  // Convert report display names to app internal values
  const appValues = Array.from(unionReportTypes)
    .map((reportType) => {
      const direct = REPORT_TYPE_TO_APP_VALUE[reportType];
      if (direct) return direct;
      return REPORT_TYPE_TO_APP_VALUE[normalizeReportType(reportType)];
    })
    .filter(Boolean) as string[];

  return appValues.length > 0 ? appValues : null;
};


