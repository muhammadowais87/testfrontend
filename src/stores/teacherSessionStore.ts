import { create } from "zustand";

interface TeacherSession {
  name: string;
  email: string;
  schoolName: string | null; // null = individual teacher
  token: string;
  portalType: "teacher" | "sub-user";
}

interface TeacherSessionStore {
  session: TeacherSession | null;
  login: (session: TeacherSession) => void;
  logout: () => void;
}

const STORAGE_KEY = "teacher_session";

const getStoredSession = (): TeacherSession | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as TeacherSession;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const useTeacherSessionStore = create<TeacherSessionStore>((set) => ({
  session: getStoredSession(),
  login: (session) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    set({ session });
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ session: null });
  },
}));
