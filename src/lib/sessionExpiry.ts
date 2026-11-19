/**
 * Shared session-expiry helpers.
 *
 * JWTs are valid for 7 days (see the backend auth controllers). The route guards
 * only know whether a token string exists, so without these helpers an expired
 * token keeps the dashboard visible while every question-bank request returns 401.
 */

export const SESSION_EXPIRED_EVENT = "portal-session-expired";

export class SessionExpiredError extends Error {
  constructor(message = "Your session has expired. Please login again.") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

/** Reads the `exp` claim without verifying the signature (the server still verifies it). */
export const isTokenExpired = (token?: string | null): boolean => {
  if (!token) return true;
  // Trial sessions use an opaque "trial_..." marker, not a JWT.
  if (token.startsWith("trial_")) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
  } catch {
    // Malformed tokens are rejected by the API and handled there.
    return false;
  }
};

let lastNotifiedAt = 0;

/**
 * Tells the app shell that the current portal session is no longer valid.
 * Throttled because one page can fire several API calls at once.
 */
export const notifySessionExpired = (message?: string): void => {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - lastNotifiedAt < 3000) return;
  lastNotifiedAt = now;
  window.dispatchEvent(
    new CustomEvent(SESSION_EXPIRED_EVENT, { detail: { message } }),
  );
};

/** Throws a SessionExpiredError (and notifies the app) when the API answered 401. */
export const assertAuthorized = (response: Response, apiMessage?: string): void => {
  if (response.status !== 401) return;
  notifySessionExpired(apiMessage);
  throw new SessionExpiredError(apiMessage);
};
