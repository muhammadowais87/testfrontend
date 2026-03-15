import chapter1 from "@/data/computerPtbClass10Chapter1Mcqs.json";
import chapter2 from "@/data/computerPtbClass10Chapter2Mcqs.json";
import chapter3 from "@/data/computerPtbClass10Chapter3Mcqs.json";
import chapter4 from "@/data/computerPtbClass10Chapter4Mcqs.json";
import chapter5 from "@/data/computerPtbClass10Chapter5Mcqs.json";

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

type RawQuestion = {
  id: number;
  category?: string;
  question_en?: string;
  question_ur?: string | null;
  options?: Record<string, string>;
  options_ur?: Record<string, string>;
};

type RawChapterData = {
  chapter: number;
  mcqs?: RawQuestion[];
  shortQuestions?: RawQuestion[];
  longQuestions?: RawQuestion[];
};

const chapterMap: Record<number, RawChapterData> = {
  1: chapter1 as RawChapterData,
  2: chapter2 as RawChapterData,
  3: chapter3 as RawChapterData,
  4: chapter4 as RawChapterData,
  5: chapter5 as RawChapterData,
};

const chapter1PartLabel = (contentType: QuestionContentType, questionId: number): string | null => {
  if (contentType !== "mcq") {
    return null;
  }

  if (questionId >= 1 && questionId <= 24) {
    return "1.1 Programming Environment";
  }
  if (questionId >= 25 && questionId <= 44) {
    return "1.2 Programming Basics";
  }
  if (questionId >= 45 && questionId <= 69) {
    return "1.3 Constant and Variables";
  }
  if (questionId >= 70) {
    return "1.01 Past Multiple choice question";
  }

  return null;
};

const toLabel = (value: string): string => {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
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

const buildMcqText = (question: RawQuestion, useUrduOptions: boolean): string => {
  const stem = (useUrduOptions ? question.question_ur : question.question_en) || "";
  const options = (useUrduOptions ? question.options_ur : question.options) || {};
  const optionLines = Object.entries(options).map(([key, value]) => `(${key}) ${value}`);
  return [stem, ...optionLines].filter(Boolean).join(" ").trim();
};

const buildQuestionId = (chapterNo: number, contentType: QuestionContentType, id: number): number => {
  const typeOffset = contentType === "mcq" ? 10000 : contentType === "short" ? 20000 : 30000;
  return chapterNo * 100000 + typeOffset + id;
};

const normalizeList = (
  chapterNo: number,
  items: RawQuestion[] | undefined,
  contentType: QuestionContentType
): PaperQuestion[] => {
  if (!items || items.length === 0) {
    return [];
  }

  return items.map((item) => {
    const category = (item.category || "").trim().toLowerCase();
    return {
      id: buildQuestionId(chapterNo, contentType, item.id),
      chapter: chapterNo,
      contentType,
      priorityKey: category,
      chapterPart: chapterNo === 1 ? chapter1PartLabel(contentType, item.id) : null,
      type: toLabel(category || "additional"),
      text: contentType === "mcq" ? buildMcqText(item, false) : (item.question_en || ""),
      urdu: contentType === "mcq" ? buildMcqText(item, true) : (item.question_ur || ""),
    };
  });
};

export const buildQuestionsForSelection = (selectedChapters: string[]): PaperQuestion[] => {
  const chapterNumbers = parseChapterNumbers(selectedChapters);
  const questions: PaperQuestion[] = [];

  chapterNumbers.forEach((chapterNo) => {
    const chapterData = chapterMap[chapterNo];
    if (!chapterData) {
      return;
    }

    questions.push(...normalizeList(chapterNo, chapterData.mcqs, "mcq"));
    questions.push(...normalizeList(chapterNo, chapterData.shortQuestions, "short"));
    questions.push(...normalizeList(chapterNo, chapterData.longQuestions, "long"));
  });

  return questions;
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

  const chapterOneSelected = selectedChapters.some((item) => /CHAP\s*1/i.test(item) || /^1\./.test(item));
  if (chapterOneSelected) {
    const chapterOnePartOrder = [
      "1.1 Programming Environment",
      "1.2 Programming Basics",
      "1.3 Constant and Variables",
      "1.01 Past Multiple choice question",
    ];

    chapterOnePartOrder.forEach((part) => {
      if (questions.some((q) => q.chapter === 1 && q.chapterPart === part)) {
        options.push({ value: `part:${part}`, label: part });
      }
    });
  }

  return options;
};
