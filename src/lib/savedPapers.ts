import { API_BASE_URL } from "@/lib/api";
import { getPortalToken } from "@/lib/portalToken";
import { assertAuthorized } from "@/lib/sessionExpiry";

export type SavedPaperQuestion = {
  id: number;
  text: string;
  urdu: string;
  contentType?: "mcq" | "short" | "long";
  chapterPart?: string | null;
  batch?: number;
  medium?: string;
  twoPerLine?: boolean;
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
  // Optional "Ignore Questions" count per batch (one batch = one Add-to-Paper action).
  // When set for a batch, that section's heading shows "(Any N)" where
  // N = that batch's question count - the ignore count, e.g. "Answer the
  // following questions (Any 3)" for 5 selected questions with 2 ignored.
  batchIgnoreCounts?: Record<number, number>;
  // Marks per question for each batch (one batch = one Add-to-Paper action), so every
  // section prints its own "NxM=T" instead of one paper-wide figure. Older saved papers
  // don't have it and fall back to an average of the total marks.
  batchMarks?: Record<number, number>;
};

const LEGACY_SAVED_PAPERS_STORAGE_KEY = "institute_saved_papers";
const LEGACY_SAVED_PAPERS_MIGRATED_KEY = "institute_saved_papers_migrated_to_db_v1";

const getAuthToken = getPortalToken;

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

const toBatchNumberMap = (
  value: unknown,
  { allowDecimals = false }: { allowDecimals?: boolean } = {},
): Record<number, number> | undefined => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const entries = Object.entries(value as Record<string, unknown>)
    .map(([key, amount]) => [Number(key), Number(amount)] as const)
    .filter(([key, amount]) =>
      Number.isInteger(key) &&
      key >= 0 &&
      Number.isFinite(amount) &&
      amount > 0 &&
      (allowDecimals || Number.isInteger(amount)),
    );
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
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
  medium: typeof paper?.medium === "string" ? paper.medium : undefined,
  twoQuestionsPerLine: Boolean(paper?.twoQuestionsPerLine),
  batchIgnoreCounts: toBatchNumberMap(paper?.batchIgnoreCounts),
  batchMarks: toBatchNumberMap(paper?.batchMarks, { allowDecimals: true }),
  questions: Array.isArray(paper?.questions)
    ? paper.questions.map((q: any) => ({
        id: Number(q?.id) || 0,
        text: typeof q?.text === "string" ? q.text : "",
        urdu: typeof q?.urdu === "string" ? q.urdu : "",
        contentType: q?.contentType === "mcq" || q?.contentType === "short" || q?.contentType === "long" ? q.contentType : undefined,
        chapterPart: typeof q?.chapterPart === "string" ? q.chapterPart : null,
        batch: typeof q?.batch === "number" ? q.batch : 0,
        medium: typeof q?.medium === "string" ? q.medium : undefined,
        twoPerLine: typeof q?.twoPerLine === "boolean" ? q.twoPerLine : undefined,
      }))
    : [],
});

export const getSavedPapers = async (): Promise<SavedPaperRecord[]> => {
  const response = await fetch(`${API_BASE_URL}/saved-papers`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  assertAuthorized(response, data?.message);
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

  // Never migrate under a trial session: the legacy papers in this browser belong to a real
  // account, so uploading them as trial papers would expose them in the trial (and trial
  // papers are auto-deleted after 24h, so they'd be lost). Leave them for the real login.
  if (getAuthToken().startsWith("trial_")) {
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
      assertAuthorized(response, data?.message);
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
  assertAuthorized(response, data?.message);
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
  assertAuthorized(response, data?.message);
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
  assertAuthorized(response, data?.message);
  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch saved paper");
  }

  return data?.paper ? toSavedPaperRecord(data.paper) : null;
};