/**
 * Public environment configuration for the Next.js client.
 *
 * Only NEXT_PUBLIC_* values are allowed here: Next.js inlines them into the
 * browser bundle, so they are not secret. Every credential (MongoDB, Better
 * Auth, Google OAuth, ImgBB) lives in studiospace-server/.env.
 *
 * Development falls back to the local URLs. Production builds fail loudly if a
 * value is missing or malformed instead of silently shipping wrong links.
 */

const FALLBACK_APP_URL = "http://localhost:3000";
const FALLBACK_API_URL = "http://localhost:5000/api";

const isProduction = process.env.NODE_ENV === "production";

function requireAbsoluteUrl(variable: string, raw: string): URL {
  let url: URL;

  try {
    url = new URL(raw);
  } catch {
    throw new Error(
      `[StudioSpace env] ${variable} must be an absolute URL (for example http://localhost:3000).`,
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(
      `[StudioSpace env] ${variable} must start with http:// or https://.`,
    );
  }

  return url;
}

function isLocalHost(url: URL): boolean {
  return (
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "[::1]"
  );
}

function readPublicUrl(
  variable: "NEXT_PUBLIC_APP_URL" | "NEXT_PUBLIC_API_URL",
  rawValue: string | undefined,
  fallback: string,
  options: { allowPath: boolean },
): string {
  const raw = rawValue?.trim();

  if (!raw) {
    if (isProduction) {
      throw new Error(
        `[StudioSpace env] ${variable} is required for production builds. ` +
          "Add it to .env.local for local builds or to your hosting provider's environment variables.",
      );
    }

    return fallback;
  }

  const url = requireAbsoluteUrl(variable, raw);

  if (
    !options.allowPath &&
    (url.pathname !== "/" || url.search || url.hash)
  ) {
    throw new Error(
      `[StudioSpace env] ${variable} must be an origin without a path, query, or hash (for example https://studiospace.app).`,
    );
  }

  if (variable === "NEXT_PUBLIC_API_URL") {
    if (url.search || url.hash) {
      throw new Error(
        `[StudioSpace env] ${variable} must not include a query string or hash.`,
      );
    }

    // apiFetch appends paths such as "/studios" or "/auth/session", so the
    // configured base must be the Express API root that ends in /api.
    if (!url.pathname.replace(/\/+$/, "").endsWith("/api")) {
      throw new Error(
        `[StudioSpace env] ${variable} must include the /api prefix (for example http://localhost:5000/api).`,
      );
    }
  }

  if (isProduction && url.protocol !== "https:" && !isLocalHost(url)) {
    console.warn(
      `[StudioSpace env] ${variable} should use https:// in production.`,
    );
  }

  return raw.replace(/\/+$/, "");
}

export const clientEnv = {
  /** Public origin of this Next.js app. Used for canonical/OG metadata URLs. */
  APP_URL: readPublicUrl(
    "NEXT_PUBLIC_APP_URL",
    process.env.NEXT_PUBLIC_APP_URL,
    FALLBACK_APP_URL,
    { allowPath: false },
  ),
  /** Base URL of the Express API, including the /api prefix. */
  API_URL: readPublicUrl(
    "NEXT_PUBLIC_API_URL",
    process.env.NEXT_PUBLIC_API_URL,
    FALLBACK_API_URL,
    { allowPath: true },
  ),
};
