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
};

const parseChapterNumbers = (selectedChapters: string[]): number[] => {
  const chapterNumbers = new Set<number>();

  selectedChapters.forEach((value) => {
    const chapterMatch = value.match(/CHAP\s*(\d+)/i);
    if (chapterMatch) {
      chapterNumbers.add(Number(chapterMatch[1]));
      return;
    }

    const sectionMatch = value.match(/^(\d+)\./);
    if (sectionMatch) {
      chapterNumbers.add(Number(sectionMatch[1]));
    }
  });

  return [...chapterNumbers].sort((a, b) => a - b);
};

const questionBankCache = new Map<string, PaperQuestion[]>();
const chapterGroupCache = new Map<string, ChapterGroup[]>();

type QuestionBankResponse = {
  questions?: PaperQuestion[];
};

type ChapterGroupsResponse = {
  groups?: ChapterGroup[];
};

export const fetchQuestionsForSelection = async (selectedChapters: string[]): Promise<PaperQuestion[]> => {
  const chapterNumbers = parseChapterNumbers(selectedChapters);
  if (chapterNumbers.length === 0) {
    return [];
  }

  const cacheKey = chapterNumbers.join(",");
  const cached = questionBankCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetch(`${API_BASE_URL}/question-bank/questions?chapters=${encodeURIComponent(cacheKey)}`);
  const data: QuestionBankResponse = await response.json();

  if (!response.ok) {
    throw new Error("Failed to load question bank from database");
  }

  const normalized = Array.isArray(data.questions) ? data.questions : [];
  questionBankCache.set(cacheKey, normalized);
  return normalized;
};

export const fetchChapterGroupsForSelection = async (
  subject: string,
  className: string,
  board: string
): Promise<ChapterGroup[]> => {
  const cacheKey = `${subject}-${className}-${board}`;
  const cached = chapterGroupCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetch(
    `${API_BASE_URL}/question-bank/chapters?subject=${encodeURIComponent(subject)}&className=${encodeURIComponent(className)}&board=${encodeURIComponent(board)}`
  );
  const data: ChapterGroupsResponse = await response.json();

  if (!response.ok) {
    throw new Error("Failed to load chapter groups from database");
  }

  const groups = Array.isArray(data.groups) ? data.groups : [];
  chapterGroupCache.set(cacheKey, groups);
  return groups;
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
