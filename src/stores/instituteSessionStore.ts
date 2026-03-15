import { create } from "zustand";

interface InstituteSession {
  name: string;
  email: string;
  city: string;
  token: string;
}

interface InstituteSessionStore {
  session: InstituteSession | null;
  login: (session: InstituteSession) => void;
  logout: () => void;
}

const STORAGE_KEY = "institute_session";

const getStoredSession = (): InstituteSession | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as InstituteSession;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const useInstituteSessionStore = create<InstituteSessionStore>((set) => ({
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
