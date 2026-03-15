export type SavedPaperQuestion = {
  id: number;
  text: string;
  urdu: string;
  contentType?: "mcq" | "short" | "long";
};

export type SavedPaperRecord = {
  id: number;
  title: string;
  subject: string;
  className: string;
  board: string;
  teacherName: string;
  date: string;
  paperCategory: string;
  timeAllowed: string;
  totalMarks: string;
  questionType: string;
  questions: SavedPaperQuestion[];
};

export const SAVED_PAPERS_STORAGE_KEY = "institute_saved_papers";

export const getSavedPapers = (): SavedPaperRecord[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(SAVED_PAPERS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveSavedPapers = (papers: SavedPaperRecord[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SAVED_PAPERS_STORAGE_KEY, JSON.stringify(papers));
};

export const addSavedPaper = (paper: SavedPaperRecord) => {
  const existing = getSavedPapers();
  saveSavedPapers([paper, ...existing]);
};

export const deleteSavedPaper = (paperId: number) => {
  const existing = getSavedPapers();
  saveSavedPapers(existing.filter((paper) => paper.id !== paperId));
};

export const getSavedPaperById = (paperId: number) => {
  return getSavedPapers().find((paper) => paper.id === paperId) ?? null;
};