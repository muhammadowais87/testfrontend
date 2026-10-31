const readToken = (storage: Storage, key: string): string => {
  try {
    const token = (JSON.parse(storage.getItem(key) || "null") as { token?: unknown } | null)?.token;
    return typeof token === "string" ? token.trim() : "";
  } catch {
    return "";
  }
};

// Picks the token of the portal the user is currently on. Teacher/sub-user and institute logins
// are stored under separate keys and neither login clears the other, so a stale (expired or
// other-account) session can sit in the same browser. Preferring a fixed key made the backend
// answer "token invalid" for whichever portal lost the tie.
export const getPortalToken = (): string => {
  if (typeof window === "undefined") return "";

  // A trial session (private to this tab) always wins -- it must never fall through to a real
  // teacher/institute token that happens to be saved in this browser.
  const trialToken = readToken(window.sessionStorage, "institute_session");
  if (trialToken.startsWith("trial_")) return trialToken;

  const instituteToken = readToken(window.localStorage, "institute_session");
  const teacherToken = readToken(window.localStorage, "teacher_session");

  const { pathname } = window.location;
  const onTeacherPortal = pathname.startsWith("/teacher") || pathname.startsWith("/sub-user");

  return onTeacherPortal ? teacherToken || instituteToken : instituteToken || teacherToken;
};
