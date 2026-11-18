import { createAuthClient } from "better-auth/react";
import { clientEnv } from "./env";

/**
 * Better Auth browser client.
 *
 * The client talks to the Express server that hosts Better Auth. It never holds
 * the Better Auth secret, the JWT secret, or a MongoDB connection string.
 * clientEnv.API_URL ends in /api, so strip that to get the backend origin.
 */
export const authBaseUrl = clientEnv.API_URL.replace(/\/+$/, "").replace(
  /\/api$/,
  "",
);

export const authClient = createAuthClient({
  baseURL: authBaseUrl,
  basePath: "/api/auth",
  fetchOptions: {
    credentials: "include",
  },
});
