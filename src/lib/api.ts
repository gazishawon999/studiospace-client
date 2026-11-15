import { clientEnv } from "./env";

export class ApiClientError extends Error {
  statusCode: number;
  errors?: string[];

  constructor(message: string, statusCode: number, errors?: string[]) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

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
 * Centralized fetch wrapper for communicating with studiospace-server.
 * Always includes HTTPOnly cookies (credentials: "include").
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, ...restOptions } = options;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${getApiBaseUrl()}${cleanEndpoint}`;

  const response = await fetch(url, {
    ...restOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data: unknown = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    const errorObj = (data as { message?: string; errors?: string[] }) || {};
    throw new ApiClientError(
      errorObj.message || `Request failed with status ${response.status}`,
      response.status,
      errorObj.errors,
    );
  }

  return data as T;
}
