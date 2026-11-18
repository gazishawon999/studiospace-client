/**
 * Shared, side-effect-free authentication helpers used by both Server and
 * Client Components. No secrets and no server-only imports belong here.
 */

export const PASSWORD_RULES = [
  {
    id: "length",
    label: "At least 6 characters",
    test: (value: string) => value.length >= 6,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
] as const;

export interface PasswordCheck {
  id: string;
  label: string;
  passed: boolean;
}

export function checkPassword(password: string): PasswordCheck[] {
  return PASSWORD_RULES.map((rule) => ({
    id: rule.id,
    label: rule.label,
    passed: rule.test(password),
  }));
}

/**
 * Returns the first unmet password rule, or null when the password is valid.
 */
export function getPasswordError(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }
  return null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function getEmailError(email: string): string | null {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_PATTERN.test(email.trim())) {
    return "Enter a valid email address.";
  }
  return null;
}

export function getNameError(name: string): string | null {
  if (!name.trim()) return "Name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
  if (name.trim().length > 80) return "Name must be 80 characters or fewer.";
  return null;
}

export function getPhotoUrlError(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null; // Photo URL is optional.

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "Photo URL must start with http:// or https://.";
    }
    if (trimmed.length > 2048) return "Photo URL is too long.";
    return null;
  } catch {
    return "Enter a valid photo URL (http:// or https://).";
  }
}

/**
 * Only same-origin relative paths are accepted as post-login destinations.
 * This prevents open-redirect abuse through ?redirect=.
 */
export function sanitizeRedirect(
  value: string | null | undefined,
  fallback = "/",
): string {
  if (!value) return fallback;

  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (/[\\\r\n]/.test(trimmed)) return fallback;

  try {
    const url = new URL(trimmed, "http://studiospace.local");
    if (url.origin !== "http://studiospace.local") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
