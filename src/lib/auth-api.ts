import { apiFetch, ApiClientError } from "./api";
import { sanitizeRedirect } from "./auth";
import type { AuthProvidersResponse, AuthUser, AuthUserResponse } from "@/types";

/**
 * Express API authentication helpers.
 *
 * These call the JWT layer on the Express server, not Better Auth directly.
 * The JWT itself is HTTPOnly and is never accessible from this module.
 */

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await apiFetch<AuthUserResponse>("/auth/me", {
      cache: "no-store",
    });
    return response.data.user;
  } catch (error) {
    if (error instanceof ApiClientError && error.statusCode === 401) {
      return null;
    }
    throw error;
  }
}

/** Exchanges the current Better Auth session for the Express JWT cookie. */
export async function exchangeSessionForApiToken(): Promise<AuthUser> {
  const response = await apiFetch<AuthUserResponse>("/auth/token", {
    method: "POST",
  });
  return response.data.user;
}

export async function fetchAuthProviders(): Promise<{
  google: boolean;
  googleCallbackUrl: string | null;
}> {
  const response = await apiFetch<AuthProvidersResponse>("/auth/providers", {
    cache: "no-store",
  });
  return response.data;
}

/** Revokes the Better Auth session and clears both cookie families. */
export async function logoutUser(): Promise<void> {
  await apiFetch<{ success: boolean }>("/auth/logout", {
    method: "POST",
  });
}

/**
 * Builds the absolute callback URL the Express/Better Auth server redirects to
 * after Google finishes. It always points at this Next.js app, never at an
 * arbitrary origin supplied by the browser URL.
 */
export function buildOAuthCallbackUrl(
  appUrl: string,
  requestedRedirect: string | null,
): string {
  const safeRedirect = sanitizeRedirect(requestedRedirect, "/");
  const base = appUrl.replace(/\/+$/, "");
  return `${base}/auth/oauth/callback?redirect=${encodeURIComponent(
    safeRedirect,
  )}`;
}
