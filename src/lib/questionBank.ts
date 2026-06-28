import { API_BASE_URL } from "@/lib/api";
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
};

export type QuestionSelectionScope = {
  chapterNumbers: number[];
  fullChapters: number[];
  chapterParts: string[];
};

const parseChapterNumbers = (selectedChapters: string[]): number[] => {
  const chapterNumbers = new Set<number>();

  selectedChapters.forEach((value) => {
    const engMatch = value.match(/(?:CHAP|UNIT)\s*(\d+)/i);
    if (engMatch) {
      chapterNumbers.add(Number(engMatch[1]));
      return;
    }

    const urduMatch = value.match(/نمبر\s*(\d+)/);
    if (urduMatch) {
      chapterNumbers.add(Number(urduMatch[1]));
      return;
    }

    const sectionMatch = value.match(/^(\d+)\./);
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
    if (/^(?:CHAP|UNIT)\s*\d+/i.test(value)) return;
    if (/نمبر\s*\d+/.test(value)) return;
    if (/^سورۃ/.test(value)) return;
    if (/^باب\s/.test(value)) return;
    if (/^\d+\.\d+/.test(value)) {
      subChapters.push(value);
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
  "tick correct spelling": "tick_correct_spelling",
  "tick correct spellings": "tick_correct_spellings",
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
};

const getAuthHeaders = (): HeadersInit => {
  const headers: Record<string, string> = {};
  try {
    const instituteRaw = localStorage.getItem("institute_session");
    if (instituteRaw) {
      const parsed = JSON.parse(instituteRaw) as { token?: string };
      if (parsed?.token) {
        headers.Authorization = `Bearer ${parsed.token}`;
        return headers;
      }
    }
    const teacherRaw = localStorage.getItem("teacher_session");
    if (teacherRaw) {
      const parsed = JSON.parse(teacherRaw) as { token?: string };
      if (parsed?.token) {
        headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  } catch {
    // ignore parse errors
  }
  return headers;
};

export const getChapterNumber = (_groupName: string, index: number): number => {
  return index + 1;
};

export const resolveQuestionSelectionScope = (
  selectedChapters: string[],
  allGroups: ChapterGroup[] = [],
): QuestionSelectionScope => {
  const chapterNumbersToFetch = new Set<number>();
  const fullySelectedChapters = new Set<number>();
  const explicitSubChapters = new Set<string>();

  if (allGroups.length > 0) {
    allGroups.forEach((group, index) => {
      const chNum = getChapterNumber(group.name, index);
      const isGroupSelected = selectedChapters.includes(group.name);
      const selectedSubs = group.chapters.filter((ch) => selectedChapters.includes(ch));

      if (isGroupSelected) {
        chapterNumbersToFetch.add(chNum);
        fullySelectedChapters.add(chNum);
      } else if (selectedSubs.length > 0) {
        chapterNumbersToFetch.add(chNum);
        selectedSubs.forEach((sc) => explicitSubChapters.add(sc));
      }
    });
  } else {
    const parsedNums = parseChapterNumbers(selectedChapters);
    parsedNums.forEach((num) => chapterNumbersToFetch.add(num));

    const selectedGroupHeaders = selectedChapters.filter((value) => {
      if (/^(?:CHAP|UNIT)\s*\d+/i.test(value)) return true;
      if (/نمبر\s*\d+/.test(value)) return true;
      if (/^سورۃ/.test(value)) return true;
      if (/^باب\s/.test(value)) return true;
      return false;
    });

    selectedGroupHeaders.forEach((header) => {
      const chNums = parseChapterNumbers([header]);
      chNums.forEach((num) => fullySelectedChapters.add(num));
    });

    const parsedSubs = getSelectedSubChapters(selectedChapters);
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

  const scope = resolveQuestionSelectionScope(selectedChapters, allGroups);
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

    while (hasMore && page <= 25) {
      const params = new URLSearchParams(baseParams);
      params.set("page", String(page));
      params.set("limit", "2000");

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
  return { groups, questionTypes };
};

export const fetchAvailableQuestionTypes = async (
  selectedChapters: string[],
  subject?: string | null,
  className?: string | null,
  board?: string | null,
  allGroups: ChapterGroup[] = [],
): Promise<string[]> => {
  if (selectedChapters.length === 0) {
    return [];
  }

  const scope = resolveQuestionSelectionScope(selectedChapters, allGroups);
  if (scope.chapterNumbers.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    chapters: scope.chapterNumbers.join(","),
  });
  if (subject) params.set("subject", subject);
  if (className) params.set("className", className);
  if (board) params.set("board", board);

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

export const buildPriorityOptions = (questions: PaperQuestion[], selectedChapters: string[]): PriorityOption[] => {
  const options: PriorityOption[] = [{ value: "all", label: "Select all" }];

  const availableCategories = new Set(questions.map((q) => q.priorityKey).filter(Boolean));
  if (availableCategories.has("exercise")) {
    options.push({ value: "cat:exercise", label: "Exercise" });
  }
  if (availableCategories.has("additional")) {
    options.push({ value: "cat:additional", label: "Additional" });
  }
  if (availableCategories.has("pastpapers")) {
    options.push({ value: "cat:pastpapers", label: "Past Papers" });
  }
  if (availableCategories.has("conceptuals")) {
    options.push({ value: "cat:conceptuals", label: "Conceptuals" });
  }

  return options;
};
