import { API_BASE_URL } from "@/lib/api";

const ADMIN_ROUTE_KEY = "app_admin_route";

const getCached = (): string | null => {
  try {
    return localStorage.getItem(ADMIN_ROUTE_KEY);
  } catch {
    return null;
  }
};

const setCached = (route: string) => {
  try {
    localStorage.setItem(ADMIN_ROUTE_KEY, route);
  } catch {
    // ignore
  }
};

let adminRoute: string | null = getCached();
let loadPromise: Promise<string> | null = null;

const fetchAdminRoute = async (): Promise<string> => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/route`);
    const data = await res.json();
    const route = data.route || "portal-x9k7m";
    setCached(route);
    return route;
  } catch {
    return "portal-x9k7m";
  }
};

export const loadAdminRoute = (): Promise<string> => {
  if (adminRoute) return Promise.resolve(adminRoute);
  if (!loadPromise) {
    loadPromise = fetchAdminRoute().then((route) => {
      adminRoute = route;
      return route;
    });
  }
  return loadPromise;
};

export const getAdminRoute = (): string => adminRoute || "portal-x9k7m";

export const adminPath = (path: string): string => {
  const base = getAdminRoute();
  return `/${base}${path.startsWith("/") ? path : `/${path}`}`;
};
