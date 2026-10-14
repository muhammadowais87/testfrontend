import { create } from "zustand";

interface InstituteSession {
  name: string;
  email: string;
  city: string;
  address: string;
  token: string;
}

interface InstituteSessionStore {
  session: InstituteSession | null;
  login: (session: InstituteSession) => void;
  logout: () => void;
}

const STORAGE_KEY = "institute_session";

export const isTrialToken = (token?: string | null) => Boolean(token && token.startsWith("trial_"));

// A trial session is private to the tab that started it (sessionStorage). It must never be
// written to localStorage: that key is shared by every tab on the site, so a trial login would
// overwrite -- or be overwritten by -- a real institute login in another tab, and trial
// requests could end up sent with a real account's token (showing real data in the trial).
const readFrom = (storage: Storage): InstituteSession | null => {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as InstituteSession;
  } catch {
    storage.removeItem(STORAGE_KEY);
    return null;
  }
};

const getStoredSession = (): InstituteSession | null => {
  const trial = readFrom(sessionStorage);
  if (trial && isTrialToken(trial.token)) {
    return trial;
  }
  return readFrom(localStorage);
};

export const useInstituteSessionStore = create<InstituteSessionStore>((set) => ({
  session: getStoredSession(),
  login: (session) => {
    if (isTrialToken(session.token)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
    set({ session });
  },
  logout: () => {
    // Logging out of a trial tab only ends that trial -- it must not wipe a real
    // institute login that's saved in localStorage for other tabs.
    const wasTrial = isTrialToken(readFrom(sessionStorage)?.token);
    sessionStorage.removeItem(STORAGE_KEY);
    if (!wasTrial) {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({ session: null });
  },
}));
