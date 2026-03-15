const defaultApiBaseUrl =
	typeof window !== "undefined" ? `${window.location.origin}/api` : "http://localhost:5000/api";

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl;

export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, "");
