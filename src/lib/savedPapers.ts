import { API_BASE_URL } from "@/lib/api";

export type SavedPaperQuestion = {
  id: number;
  text: string;
  urdu: string;
  contentType?: "mcq" | "short" | "long";
  chapterPart?: string | null;
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
  medium?: string;
  twoQuestionsPerLine?: boolean;
  questions: SavedPaperQuestion[];
};

type StoredSession = {
  token: string;
};

const LEGACY_SAVED_PAPERS_STORAGE_KEY = "institute_saved_papers";
const LEGACY_SAVED_PAPERS_MIGRATED_KEY = "institute_saved_papers_migrated_to_db_v1";

const getStoredSession = (key: string): StoredSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (typeof parsed?.token === "string" && parsed.token.trim()) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

const getAuthToken = () => {
  const teacherSession = getStoredSession("teacher_session");
  if (teacherSession?.token) {
    return teacherSession.token;
  }

  const instituteSession = getStoredSession("institute_session");
  return instituteSession?.token || "";
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Login required to access saved papers");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const toSavedPaperRecord = (paper: any): SavedPaperRecord => ({
  id: Number(paper?.id) || 0,
  title: typeof paper?.title === "string" ? paper.title : "Paper",
  subject: typeof paper?.subject === "string" ? paper.subject : "",
  className: typeof paper?.className === "string" ? paper.className : "",
  board: typeof paper?.board === "string" ? paper.board : "",
  teacherName: typeof paper?.teacherName === "string" ? paper.teacherName : "",
  date: typeof paper?.date === "string" ? paper.date : "",
  paperCategory: typeof paper?.paperCategory === "string" ? paper.paperCategory : "",
  timeAllowed: typeof paper?.timeAllowed === "string" ? paper.timeAllowed : "",
  totalMarks: typeof paper?.totalMarks === "string" ? paper.totalMarks : "0",
  questionType: typeof paper?.questionType === "string" ? paper.questionType : "",
  questions: Array.isArray(paper?.questions)
    ? paper.questions.map((q: any) => ({
        id: Number(q?.id) || 0,
        text: typeof q?.text === "string" ? q.text : "",
        urdu: typeof q?.urdu === "string" ? q.urdu : "",
        contentType: q?.contentType === "mcq" || q?.contentType === "short" || q?.contentType === "long" ? q.contentType : undefined,
      }))
    : [],
});

export const getSavedPapers = async (): Promise<SavedPaperRecord[]> => {
  const response = await fetch(`${API_BASE_URL}/saved-papers`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch saved papers");
  }

  return Array.isArray(data?.papers) ? data.papers.map(toSavedPaperRecord) : [];
};

const getLegacySavedPapers = (): SavedPaperRecord[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(LEGACY_SAVED_PAPERS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(toSavedPaperRecord) : [];
  } catch {
    return [];
  }
};

export const migrateLegacySavedPapersToDb = async (): Promise<number> => {
  if (typeof window === "undefined") {
    return 0;
  }

  if (window.localStorage.getItem(LEGACY_SAVED_PAPERS_MIGRATED_KEY) === "1") {
    return 0;
  }

  const legacyPapers = getLegacySavedPapers();
  if (legacyPapers.length === 0) {
    window.localStorage.setItem(LEGACY_SAVED_PAPERS_MIGRATED_KEY, "1");
    return 0;
  }

  let migratedCount = 0;
  for (const paper of legacyPapers) {
    const response = await fetch(`${API_BASE_URL}/saved-papers`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(paper),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.message || "Failed to migrate legacy saved papers");
    }

    migratedCount += 1;
  }

  window.localStorage.setItem(LEGACY_SAVED_PAPERS_MIGRATED_KEY, "1");
  window.localStorage.removeItem(LEGACY_SAVED_PAPERS_STORAGE_KEY);
  return migratedCount;
};

export const addSavedPaper = async (paper: SavedPaperRecord): Promise<SavedPaperRecord> => {
  const response = await fetch(`${API_BASE_URL}/saved-papers`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(paper),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to save paper");
  }

  return toSavedPaperRecord(data?.paper);
};

export const deleteSavedPaper = async (paperId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/saved-papers/${paperId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to delete paper");
  }
};

export const getSavedPaperById = async (paperId: number): Promise<SavedPaperRecord | null> => {
  const response = await fetch(`${API_BASE_URL}/saved-papers/${paperId}`, {
    headers: getAuthHeaders(),
  });

  if (response.status === 404) {
    return null;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch saved paper");
  }

  return data?.paper ? toSavedPaperRecord(data.paper) : null;
};