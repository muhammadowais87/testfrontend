import { create } from "zustand";
import { isTokenExpired } from "@/lib/sessionExpiry";

interface TeacherSession {
  name: string;
  email: string;
  schoolName: string | null;
  schoolAddress: string | null;
  token: string;
  portalType: "teacher" | "sub-user";
  assignedSubjects?: string[];
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
    const session = JSON.parse(raw) as TeacherSession;
    if (isTokenExpired(session.token)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
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
