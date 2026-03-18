const PROD_API_BASE_URL = "https://testbackend-production-8e30.up.railway.app/api";

const defaultApiBaseUrl = (() => {
	if (typeof window === "undefined") {
		return PROD_API_BASE_URL;
	}

	const { hostname, origin } = window.location;
	const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

	return isLocalhost ? `${origin}/api` : PROD_API_BASE_URL;
})();

const toSafeApiBaseUrl = (value: string | undefined) => {
	const candidate = (value || "").trim();
	if (!candidate || typeof window === "undefined") {
		return defaultApiBaseUrl;
	}

	try {
		const parsed = new URL(candidate);
		const isAppLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
		const isApiLocalhost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";

		// Prevent production deployments from accidentally using a localhost backend URL.
		if (!isAppLocalhost && isApiLocalhost) {
			return defaultApiBaseUrl;
		}

		return candidate;
	} catch {
		return defaultApiBaseUrl;
	}
};

const RAW_API_BASE_URL = toSafeApiBaseUrl(
	import.meta.env.VITE_API_BASE_URL ?? import.meta.env.NEXT_PUBLIC_API_URL,
);

export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, "");
