import { API_BASE_URL } from "@/lib/api";
import { getPortalToken } from "@/lib/portalToken";
import { sanitizeChapterSelections } from "@/data/nineSmartSyllabusExclusions";
import type { ChapterGroup } from "@/data/subjectData";

export type QuestionContentType = "mcq" | "short" | "long";

export type PaperQuestion = {
  id: number;
  chapter: number;
  contentType: QuestionContentType;
  priorityKey: string;
  chapterPart: string | null;
  type: string;
  text: string;
  urdu: string;
  imageFile?: string | null;
  topicName?: string | null;
};

const parseNumericParts = (chapterPart: string | null): number[] => {
  if (!chapterPart) return [Infinity];
  const match = chapterPart.match(/^([\d.]+)/);
  if (!match) return [Infinity];
  return match[1].split(".").map(Number);
};

const sortByChapterAndTopic = (a: PaperQuestion, b: PaperQuestion): number => {
  if (a.chapter !== b.chapter) return a.chapter - b.chapter;

  const partsA = parseNumericParts(a.chapterPart);
  const partsB = parseNumericParts(b.chapterPart);

  const len = Math.min(partsA.length, partsB.length);
  for (let i = 0; i < len; i++) {
    if (partsA[i] !== partsB[i]) return partsA[i] - partsB[i];
  }

  return partsA.length - partsB.length;
};

export type QuestionSelectionScope = {
  chapterNumbers: number[];
  fullChapters: number[];
  chapterParts: string[];
};

const parseChapterNumbers = (selectedChapters: string[]): number[] => {
  const chapterNumbers = new Set<number>();

  selectedChapters.forEach((value) => {
    const name = value.includes("::") ? value.split("::")[1] : value;
    const engMatch = name.match(/(?:CHAP|UNIT)\s*(\d+)/i);
    if (engMatch) {
      chapterNumbers.add(Number(engMatch[1]));
      return;
    }

    const sectionMatch = name.match(/^(\d+)\./);
    if (sectionMatch) {
      chapterNumbers.add(Number(sectionMatch[1]));
    }
  });

  if (chapterNumbers.size === 0 && selectedChapters.length > 0) {
    selectedChapters.forEach((_, idx) => {
      chapterNumbers.add(idx + 1);
    });
  }

  return [...chapterNumbers].sort((a, b) => a - b);
};

export const getSelectedSubChapters = (selectedChapters: string[]): string[] | null => {
  const subChapters: string[] = [];

  selectedChapters.forEach((value) => {
    const name = value.includes("::") ? value.split("::")[1] : value;
    if (/^(?:CHAP|UNIT)\s*\d+/i.test(name)) return;
    if (/نمبر\s*\d+/.test(name)) return;
    if (/^سورۃ/.test(name)) return;
    if (/^باب\s/.test(name)) return;
    if (/^\d+\.\d+/.test(name)) {
      subChapters.push(name);
    }
  });

  return subChapters.length > 0 ? subChapters : null;
};

export type QuestionTypeOption = { value: string; label: string };

const normalizeQuestionTypeString = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .replace(/[_\/&]+/g, " ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const QUESTION_TYPE_VALUE_MAP: Record<string, string> = {
  mcq: "mcq",
  mcqs: "mcq",
  "multiple option": "mcq",
  "multiple options": "mcq",
  "multiple choice": "mcq",
  short: "short",
  "short questions": "short",
  long: "long",
  "long questions": "long",
  grammar: "grammar",
  summary: "summary",
  "letter writing": "letters",
  letters: "letters",
  story: "stories",
  stories: "stories",
  "dialogue writing": "dialoges",
  dialoges: "dialoges",
  dialogues: "dialoges",
  comprehension: "comprehension_paragraph",
  "comprehension paragraph": "comprehension_paragraph",
  "word meanings": "words_meanings",
  words: "words_meanings",
  meanings: "words_meanings",
  translation: "farsi_tarjuma",
  ayat: "ayaat",
  verses: "ayaat",
  hadith: "hadith",
  shakhsiyaat: "shakhsiyat",
  "application writing": "darkhaastein",
  "question and answers": "questions_answers",
  "questions and answers": "questions_answers",
  "translate into urdu paragraph": "translate_into_urdu_paragraph",
  "translate into urdu sentences": "translate_into_urdu_sentences",
  "fill in tha blanks": "fill_in_tha_blanks",
  "fill in the blanks": "fill_in_tha_blanks",
  "idioms sentences": "ilfaz_ko_jumlo_mein_istamal",
  idioms: "ilfaz_ko_jumlo_mein_istamal",
  "use words in sentences": "ilfaz_ko_jumlo_mein_istamal",
  "writing paragraphs": "writing_paragraphs",
  "paragraph ki tashreeh": "paragraph_ki_tashreeh",
  "central idea": "markazi_khayal",
  "explanation of verses": "ashaar_ki_tashreeh",
  "correct meaning of underlined word": "correct_meaning_underlined",
  "tick correct spellings": "tick_correct_spellings",
  "tick correct spelling": "tick_correct_spellings",
  "tick correct grammar": "tick_correct_grammar",
  "tick correct according to grammar": "tick_correct_grammar",
  "match columns": "match_columns",
  essays: "essays",
  "singular plural": "wahid_jama",
  "wahid jama": "wahid_jama",
  "jumlo ki darustagi": "jumlo_ki_darustagi",
  "direct and indirect": "direct_and_indirect",
  homophones: "homophones",
  "true false statements": "true_false_statements",
  "true false": "true_false_statements",
  genders: "genders",
  "poem stanzas": "poem_stanzas",
  "zarb ul imsal": "zarb_ul_imsal",
  "zarb ul misaal": "zarb_ul_misaal",
  "words into sentences": "words_into_sentences",
  "missing letters": "missing_letters",
  "sabqe lahqe": "sabqe_lahqe",
  pointing: "pointing",
  "punctuate the paragraph": "punctuate_the_paragraph",
  "ilfaz mutaradif": "ilfaz_mutaradif",
  synonyms: "ilfaz_mutaradif",
  "ilfaz mutazad": "ilfaz_mutazad",
  antonyms: "ilfaz_mutazad",
  questionandanswers: "questions_answers",
  translateintourduparagraph: "translate_into_urdu_paragraph",
  fillintheblanks: "fill_in_tha_blanks",
  idiomssentences: "ilfaz_ko_jumlo_mein_istamal",
  vitals: "vitals",
  // Raw DB chapterPart labels (English/Urdu 9th, 10th, Inter-I) that otherwise normalize
  // to nothing or to a value with no dropdown option.
  "tick correct synonyms": "tick_correct_synonyms",
  "punctuate the paragraphs": "punctuate_the_paragraph",
  applications: "darkhaastein",
  appliations: "darkhaastein",
  theme: "markazi_khayal",
  "zarb ul misaail": "zarb_ul_misaal",
  receipt: "receipt",
  newsletters: "newsletters",
  history: "history",
  "correct meaning of underlined words": "correct_meaning_of_underline_word",
  "comprehension paragraphs": "comprehension_paragraph",
  // Inter-I Farsi spellings.
  "wahid jamaa": "wahid_jama",
  "ilfaaz mutazad": "ilfaz_mutazad",
  araab: "araab_lagaein",
};

export const normalizeQuestionTypeValue = (value: string): string | null => {
  if (!value || typeof value !== "string") return null;
  const normalized = normalizeQuestionTypeString(value);
  if (!normalized) return null;
  if (normalized in QUESTION_TYPE_VALUE_MAP) {
    return QUESTION_TYPE_VALUE_MAP[normalized];
  }

  const allowedValues = new Set([
    "mcq",
    "short",
    "long",
    "grammar",
    "summary",
    "letters",
    "stories",
    "dialoges",
    "comprehension_paragraph",
    "ilfaz_ko_jumlo_mein_istamal",
    "words_meanings",
    "ilfaz_maani",
    "farsi_tarjuma",
    "ayaat",
    "hadith",
    "ahadees",
    "shakhsiyat",
    "shakhsiyaat",
    "darkhaastein",
    "questions_answers",
    "translate_into_urdu_paragraph",
    "fill_in_tha_blanks",
    "writing_paragraphs",
    "markazi_khayal",
    "paragraph_ki_tashreeh",
    "ashaar_ki_tashreeh",
    "ashar_ki_tashreeh",
    "correct_meaning_underlined",
    "correct_meaning_of_underline_word",
    "tick_correct_spelling",
    "tick_correct_spellings",
    "tick_correct_grammar",
    "tick_correct_form_of_verb",
    "tick_correct_according_to_grammer",
    "active_and_passive_voice",
    "match_columns",
    "essays",
    "translate_into_urdu_sentences",
    "wahid_jama",
    "muzakir_monas",
    "jumlo_ki_darustagi",
    "jumlo_ki_takmeel",
    "direct_and_indirect",
    "homophones",
    "true_false_statements",
    "genders",
    "poem_stanzas",
    "zarb_ul_imsal",
    "zarb_ul_misaal",
    "words_into_sentences",
    "missing_letters",
    "sabqe_lahqe",
    "pointing",
    "punctuate_the_paragraph",
    "ilfaz_mutaradif",
    "ilfaz_mutazad",
    "araab_lagaein",
    "khali_jaga_pur_karein",
    "ideoms",
    "pair_of_words",
    "mukalmy",
    "tafheem_ibarat",
    "correct_meaning_of_underlined_words",
    "tick_correct_spellings",
    "comprehension_paragraphs",
    "takhlees_ibarat",
    "vitals",
  ]);
  // normalizeQuestionTypeString converts underscores to spaces, so DB slugs like
  // "ilfaz_ko_jumlo_mein_istamal" become "ilfaz ko jumlo mein istamal" — not in set.
  // Convert back to underscores before the set lookup to handle these cases.
  if (allowedValues.has(normalized)) return normalized;
  const withUnderscores = normalized.replace(/ /g, "_");
  return allowedValues.has(withUnderscores) ? withUnderscores : null;
};

const questionBankCache = new Map<string, PaperQuestion[]>();
const chapterGroupCache = new Map<string, ChapterGroup[]>();
const chapterTypeCache = new Map<string, QuestionTypeOption[]>();
// subject-class-board -> normalized topic name -> DB chapter number. Only topics found
// in exactly one chapter are kept, so generic names ("Exercise", "Review") can't mislead.
const topicChapterCache = new Map<string, Map<string, number>>();
let activeFetchController: AbortController | null = null;
let fetchSequence = 0;

type QuestionBankResponse = {
  questions?: PaperQuestion[];
  hasMore?: boolean;
  page?: number;
};

type ChapterGroupsResponse = {
  groups?: ChapterGroup[];
  questionTypes?: QuestionTypeOption[];
  topicChapters?: Array<{ t: string; c: number; n: number }>;
};

// Ignore diacritics, punctuation and spacing so spelling variants of a topic match;
// "E.x: 6.1" / "Ex: 6.1" read as "Exercise 6.1".
const normalizeTopicKey = (value: string): string =>
  value
    .replace(/^\s*e\.?\s*x\.?\s*:?\s*(?=\d)/i, "exercise ")
    .normalize("NFC")
    .replace(/[\p{M}\p{Cf}]/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, "")
    .toLowerCase();

// Same, also ignoring a leading/trailing section number ("1.1 Location of Pakistan" =
// "Location of Pakistan"). Index keys are prefixed "f:" (exact) and "l:" (loose).
const looseTopicKey = (value: string): string =>
  normalizeTopicKey(
    value
      .replace(/^\s*\d+(?:\.\d+)*\.?\s+/, "")
      .replace(/\s+\d+(?:\.\d+)+\.?\s*$/, ""),
  );

// PTB 9th/10th/1st Year: map chapter groups to DB chapters through their topics.
const usesTopicChapterMapping = (className?: string | null, board?: string | null) =>
  board === "PTB" && ["9TH", "10TH", "INTER-I", "INTER-II"].includes(className || "");

const getTopicChapterIndex = (subject?: string | null, className?: string | null, board?: string | null) =>
  usesTopicChapterMapping(className, board)
    ? topicChapterCache.get(`${subject}-${className}-${board}`)
    : undefined;

const getAuthHeaders = (): HeadersInit => {
  const headers: Record<string, string> = {};
  const token = getPortalToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const getChapterNumber = (groupName: string, index: number): number => {
  const match = groupName.match(/(?:CHAP|UNIT|باب)\s*(\d+)/i);
  if (match) return parseInt(match[1], 10);
  // Use sequential index for all other cases (e.g., "نثر نمبر1", "نظم نمبر 1")
  // The نمبر(\d+) pattern is unreliable because categories restart numbering
  // (e.g., "نظم نمبر 1" would return 1 but DB stores it at index 11).
  return index + 1;
};

// The DB chapter a group's questions are stored under, decided by where its topics live.
// Static chapter lists don't always share the DB's group order, so list position alone can
// point a topic at the wrong chapter (e.g. 10th Islamiat Ikhtiyari "عربی زبان کی گرامر",
// 4th in the static list, is DB chapter 2 -- chapter 4 is Hadith).
const resolveGroupChapterFromTopics = (
  group: ChapterGroup,
  topicChapterIndex?: Map<string, number>,
): number | null => {
  if (!topicChapterIndex || topicChapterIndex.size === 0) return null;
  const votes = new Map<number, number>();
  [group.name, ...group.chapters].forEach((name) => {
    const chapter = topicChapterIndex.get(`f:${normalizeTopicKey(name)}`)
      ?? topicChapterIndex.get(`l:${looseTopicKey(name)}`);
    if (chapter !== undefined) votes.set(chapter, (votes.get(chapter) || 0) + 1);
  });
  let best: number | null = null;
  let bestVotes = 0;
  for (const [chapter, count] of votes) {
    if (count > bestVotes) {
      best = chapter;
      bestVotes = count;
    }
  }
  return best;
};

export const resolveQuestionSelectionScope = (
  selectedChapters: string[],
  allGroups: ChapterGroup[] = [],
  topicChapterIndex?: Map<string, number>,
): QuestionSelectionScope => {
  const chapterNumbersToFetch = new Set<number>();
  const fullySelectedChapters = new Set<number>();
  const explicitSubChapters = new Set<string>();

  // Helper to extract chapter name from composite key (groupName::chapter)
  const extractChapterName = (key: string): string => {
    const idx = key.indexOf("::");
    return idx >= 0 ? key.slice(idx + 2) : key;
  };

  if (allGroups.length > 0) {
    const topicResolved = allGroups.map((group) => resolveGroupChapterFromTopics(group, topicChapterIndex));
    const groupChapters = allGroups.map((group, index) => topicResolved[index] ?? getChapterNumber(group.name, index));
    const groupsPerChapter = new Map<number, number>();
    groupChapters.forEach((ch) => groupsPerChapter.set(ch, (groupsPerChapter.get(ch) || 0) + 1));

    allGroups.forEach((group, index) => {
      const chNum = groupChapters[index];
      const isGroupSelected = selectedChapters.includes(group.name);
      // Match using composite key: group.name::chapter
      const selectedSubs = group.chapters.filter((ch) =>
        selectedChapters.includes(`${group.name}::${ch}`)
      );
      // Two groups whose topics are stored in the same DB chapter (e.g. "آیات کریمہ" and
      // "القرآن" both in chapter 1): selecting one whole group must not pull in the other
      // group's questions, so scope it by its own topics instead of the whole chapter.
      const sharesChapter = topicResolved[index] !== null && (groupsPerChapter.get(chNum) || 0) > 1;

      if (isGroupSelected && sharesChapter) {
        chapterNumbersToFetch.add(chNum);
        [group.name, ...group.chapters].forEach((sc) => explicitSubChapters.add(sc));
      } else if (isGroupSelected) {
        chapterNumbersToFetch.add(chNum);
        fullySelectedChapters.add(chNum);
      } else if (selectedSubs.length > 0) {
        chapterNumbersToFetch.add(chNum);
        selectedSubs.forEach((sc) => explicitSubChapters.add(sc));
      }
    });
  } else {
    const parsedNums = parseChapterNumbers(selectedChapters.map(extractChapterName));
    parsedNums.forEach((num) => chapterNumbersToFetch.add(num));

    const selectedGroupHeaders = selectedChapters.filter((value) => {
      const name = extractChapterName(value);
      if (/^(?:CHAP|UNIT)\s*\d+/i.test(name)) return true;
      if (/نمبر\s*\d+/.test(name)) return true;
      if (/^سورۃ/.test(name)) return true;
      if (/^باب\s/.test(name)) return true;
      return false;
    });

    selectedGroupHeaders.forEach((header) => {
      const chNums = parseChapterNumbers([extractChapterName(header)]);
      chNums.forEach((num) => fullySelectedChapters.add(num));
    });

    const parsedSubs = getSelectedSubChapters(selectedChapters.map(extractChapterName));
    if (parsedSubs) {
      parsedSubs.forEach((sub) => explicitSubChapters.add(sub));
    }
  }

  const chapterNumbers = [...chapterNumbersToFetch].sort((a, b) => a - b);
  const fullChapters = [...fullySelectedChapters].sort((a, b) => a - b);
  const chapterParts = [...explicitSubChapters];

  return { chapterNumbers, fullChapters, chapterParts };
};

const buildCacheKey = (
  scope: QuestionSelectionScope,
  subject?: string | null,
  className?: string | null,
  board?: string | null,
  contentType?: QuestionContentType | null,
  sectionType?: string | null,
) => [
  scope.chapterNumbers.join(","),
  scope.fullChapters.join(","),
  scope.chapterParts.join("|"),
  subject || "",
  className || "",
  board || "",
  contentType || "",
  sectionType || "",
].join("::");

export const clearQuestionBankCache = () => {
  questionBankCache.clear();
  chapterGroupCache.clear();
  chapterTypeCache.clear();
  topicChapterCache.clear();
};

export const fetchQuestionsForSelection = async (
  selectedChapters: string[],
  subject?: string | null,
  className?: string | null,
  board?: string | null,
  allGroups: ChapterGroup[] = [],
  contentType?: QuestionContentType | null,
  sectionType?: string | null,
): Promise<PaperQuestion[]> => {
  if (selectedChapters.length === 0) {
    return [];
  }

  // Never request questions for topics that are out of syllabus for this session,
  // even if an old selection or a saved paper still contains them.
  const safeSelections = sanitizeChapterSelections(
    subject ?? "",
    className ?? "",
    board ?? "",
    allGroups,
    selectedChapters,
  );
  if (safeSelections.length === 0) {
    return [];
  }

  const scope = resolveQuestionSelectionScope(safeSelections, allGroups, getTopicChapterIndex(subject, className, board));
  if (scope.chapterNumbers.length === 0) {
    return [];
  }

  const cacheKey = buildCacheKey(scope, subject, className, board, contentType, sectionType);
  const cached = questionBankCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  if (activeFetchController) {
    activeFetchController.abort();
  }

  const controller = new AbortController();
  activeFetchController = controller;
  const requestId = ++fetchSequence;

  const baseParams = new URLSearchParams({
    chapters: scope.chapterNumbers.join(","),
  });

  if (scope.fullChapters.length > 0) {
    baseParams.set("fullChapters", scope.fullChapters.join(","));
  }
  if (scope.chapterParts.length > 0) {
    baseParams.set("chapterParts", scope.chapterParts.join(","));
  }
  if (subject) baseParams.set("subject", subject);
  if (className) baseParams.set("className", className);
  if (board) baseParams.set("board", board);
  if (contentType) baseParams.set("contentType", contentType);
  if (sectionType) baseParams.set("sectionType", sectionType);

  try {
    const aggregated: PaperQuestion[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const params = new URLSearchParams(baseParams);
      params.set("page", String(page));
      params.set("limit", "500");

      const response = await fetch(`${API_BASE_URL}/question-bank/questions?${params.toString()}`, {
        signal: controller.signal,
        headers: getAuthHeaders(),
      });
      const data: QuestionBankResponse = await response.json();

      if (!response.ok) {
        throw new Error("Failed to load question bank from database");
      }

      if (requestId !== fetchSequence) {
        throw new DOMException("Aborted", "AbortError");
      }

      const batch = Array.isArray(data.questions) ? data.questions : [];
      aggregated.push(...batch);
      hasMore = Boolean(data.hasMore);
      page += 1;
      if (batch.length === 0) break;
    }

    aggregated.sort(sortByChapterAndTopic);

    questionBankCache.set(cacheKey, aggregated);
    return aggregated;
  } catch (error) {
    throw error;
  } finally {
    if (activeFetchController === controller) {
      activeFetchController = null;
    }
  }
};

export const fetchChapterGroupsForSelection = async (
  subject: string,
  className: string,
  board: string,
): Promise<{ groups: ChapterGroup[]; questionTypes: QuestionTypeOption[] }> => {
  const cacheKey = `${subject}-${className}-${board}`;
  const cached = chapterGroupCache.get(cacheKey);
  if (cached) {
    return { groups: cached, questionTypes: chapterTypeCache.get(cacheKey) || [] };
  }

  const response = await fetch(
    `${API_BASE_URL}/question-bank/chapters?subject=${encodeURIComponent(subject)}&className=${encodeURIComponent(className)}&board=${encodeURIComponent(board)}`,
    { headers: getAuthHeaders() },
  );
  const data: ChapterGroupsResponse = await response.json();

  if (!response.ok) {
    throw new Error("Failed to load chapter groups from database");
  }

  const groups = Array.isArray(data.groups) ? data.groups : [];
  const questionTypes = Array.isArray(data.questionTypes) ? data.questionTypes : [];
  chapterGroupCache.set(cacheKey, groups);
  chapterTypeCache.set(cacheKey, questionTypes);

  const chaptersByTopic = new Map<string, Set<number>>();
  (Array.isArray(data.topicChapters) ? data.topicChapters : []).forEach(({ t, c }) => {
    const name = String(t ?? "");
    if (!Number.isFinite(c)) return;
    [`f:${normalizeTopicKey(name)}`, `l:${looseTopicKey(name)}`].forEach((key) => {
      if (key.length <= 2) return;
      if (!chaptersByTopic.has(key)) chaptersByTopic.set(key, new Set());
      chaptersByTopic.get(key)!.add(c);
    });
  });
  const topicIndex = new Map<string, number>();
  chaptersByTopic.forEach((chapters, key) => {
    if (chapters.size === 1) topicIndex.set(key, [...chapters][0]);
  });
  topicChapterCache.set(cacheKey, topicIndex);

  return { groups, questionTypes };
};

export const fetchAvailableQuestionTypes = async (
  selectedChapters: string[],
  subject?: string | null,
  className?: string | null,
  board?: string | null,
  allGroups: ChapterGroup[] = [],
  scopeByTopic = false,
): Promise<string[]> => {
  if (selectedChapters.length === 0) {
    return [];
  }

  const safeSelections = sanitizeChapterSelections(
    subject ?? "",
    className ?? "",
    board ?? "",
    allGroups,
    selectedChapters,
  );
  if (safeSelections.length === 0) {
    return [];
  }

  const scope = resolveQuestionSelectionScope(safeSelections, allGroups, getTopicChapterIndex(subject, className, board));
  if (scope.chapterNumbers.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    chapters: scope.chapterNumbers.join(","),
  });
  if (subject) params.set("subject", subject);
  if (className) params.set("className", className);
  if (board) params.set("board", board);
  // Scope types to the individually selected sub-topics, not their whole chapter.
  // Sent as repeated params because topic names can contain commas.
  if (scopeByTopic && scope.chapterParts.length > 0) {
    scope.chapterParts.forEach((topic) => params.append("topics", topic));
    if (scope.fullChapters.length > 0) params.set("fullChapters", scope.fullChapters.join(","));
  }

  const response = await fetch(
    `${API_BASE_URL}/question-bank/available-types?${params.toString()}`,
    { headers: getAuthHeaders() }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to load available question types");
  }

  const rawTypes = Array.isArray(data.availableTypes) ? data.availableTypes : [];
  const normalizedTypes = rawTypes
    .map((type) => normalizeQuestionTypeValue(String(type)))
    .filter((type): type is string => Boolean(type));

  return Array.from(new Set(normalizedTypes));
};

export type PriorityOption = { value: string; label: string };

// Checkbox options for the "Question Priority" filter, built from the priorityKey values
// actually present on the already-searched questions -- so the list can only ever offer
// priorities that exist in those results, and picking one is guaranteed to match something.
export const buildPriorityOptions = (questions: PaperQuestion[]): PriorityOption[] => {
  const options: PriorityOption[] = [];
  const available = new Set(questions.map((q) => q.priorityKey).filter(Boolean));
  if (available.has("additional")) options.push({ value: "additional", label: "Additional" });
  if (available.has("exercise")) options.push({ value: "exercise", label: "Exercise" });
  if (available.has("pastpapers")) options.push({ value: "pastpapers", label: "Past Papers" });
  if (available.has("conceptuals")) options.push({ value: "conceptuals", label: "Conceptuals" });
  return options;
};
