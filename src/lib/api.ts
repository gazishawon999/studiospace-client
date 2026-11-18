import { clientEnv } from "./env";

export class ApiClientError extends Error {
  statusCode: number;
  errors?: string[];
  code?: string;

  constructor(
    message: string,
    statusCode: number,
    errors?: string[],
    code?: string,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

const CSRF_HEADER_NAME = "X-CSRF-Token";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

let csrfToken: string | null = null;
let csrfRequest: Promise<string> | null = null;

/**
 * Resolves the correct base API URL for both Server Components and Client Components.
 */
export function getApiBaseUrl(): string {
  // On the server (SSR), always call the Express backend URL directly
  if (typeof window === "undefined") {
    return clientEnv.API_URL;
  }
  // In the browser, use the configured API URL (or proxy path)
  return clientEnv.API_URL;
}

/**
 * Fetches a double-submit CSRF token from the Express API. The server also sets
 * a readable cookie; the token in the response body is echoed in the header.
 */
export async function getCsrfToken(force = false): Promise<string> {
  if (!force && csrfToken) return csrfToken;
  if (csrfRequest) return csrfRequest;

  csrfRequest = (async () => {
    const response = await fetch(`${getApiBaseUrl()}/auth/csrf`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as {
      data?: { csrfToken?: string };
      message?: string;
    } | null;

    if (!response.ok || !data?.data?.csrfToken) {
      throw new ApiClientError(
        data?.message ||
          "Could not prepare a secure request. Refresh the page and try again.",
        response.status || 500,
        undefined,
        "CSRF_FETCH_FAILED",
      );
    }

    csrfToken = data.data.csrfToken;
    return csrfToken;
  })().finally(() => {
    csrfRequest = null;
  });

  return csrfRequest;
}

export function clearCsrfToken(): void {
  csrfToken = null;
}

/**
 * Centralized fetch wrapper for communicating with studiospace-server.
 * Always includes HTTPOnly cookies (credentials: "include") and adds the CSRF
 * header automatically to unsafe methods. Supports JSON bodies and FormData.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, ...restOptions } = options;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${getApiBaseUrl()}${cleanEndpoint}`;
  const method = (restOptions.method ?? "GET").toUpperCase();

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const requestHeaders: Record<string, string> = {
    ...(!isFormData && body !== undefined
      ? { "Content-Type": "application/json" }
      : {}),
    ...(headers as Record<string, string> | undefined),
  };

  if (!SAFE_METHODS.has(method)) {
    requestHeaders[CSRF_HEADER_NAME] = await getCsrfToken();
  }

  const response = await fetch(url, {
    ...restOptions,
    credentials: "include",
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as BodyInit)
          : JSON.stringify(body),
  });

  let data: unknown = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    const errorObj =
      (data as { message?: string; errors?: string[]; code?: string }) || {};

    if (
      response.status === 403 &&
      (errorObj.code === "CSRF_TOKEN_INVALID" ||
        errorObj.code === "ORIGIN_NOT_ALLOWED")
    ) {
      // The cookie may have expired or been rotated. The next attempt fetches
      // a fresh token.
      clearCsrfToken();
    }

    throw new ApiClientError(
      errorObj.message || `Request failed with status ${response.status}`,
      response.status,
      errorObj.errors,
      errorObj.code,
    );
  }

  return data as T;
}
