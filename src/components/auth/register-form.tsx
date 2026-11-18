"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  AuthDivider,
  FieldError,
  GoogleSignInButton,
  PasswordRequirements,
} from "@/components/auth/auth-form-parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import {
  buildOAuthCallbackUrl,
  exchangeSessionForApiToken,
  fetchAuthProviders,
} from "@/lib/auth-api";
import {
  getEmailError,
  getNameError,
  getPasswordError,
  getPhotoUrlError,
  sanitizeRedirect,
} from "@/lib/auth";
import { clientEnv } from "@/lib/env";

interface FieldErrors {
  name?: string;
  email?: string;
  photoUrl?: string;
  password?: string;
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRedirect = searchParams.get("redirect");
  const safeTarget = sanitizeRedirect(requestedRedirect, "/");
  const oauthError = searchParams.get("error");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const oauthMessage =
    oauthError === "access_denied"
      ? "Google sign-in was cancelled. You can try again or create an account with email."
      : oauthError
        ? "Google sign-in could not be completed. Please try again or create an account with email."
        : null;

  useEffect(() => {
    if (oauthMessage) {
      toast.error(oauthMessage);
    }
  }, [oauthMessage]);

  const loginHref = requestedRedirect
    ? `/login?redirect=${encodeURIComponent(safeTarget)}`
    : "/login";

  function validate(): boolean {
    const next: FieldErrors = {
      name: getNameError(name) ?? undefined,
      email: getEmailError(email) ?? undefined,
      photoUrl: getPhotoUrlError(photoUrl) ?? undefined,
      password: getPasswordError(password) ?? undefined,
    };

    setErrors(next);
    return !next.name && !next.email && !next.photoUrl && !next.password;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    setErrors((prev) => ({ ...prev, email: undefined }));

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        image: photoUrl.trim() || undefined,
      });

      if (result.error) {
        const code = (result.error as { code?: string }).code;
        const message = result.error.message || "Registration failed.";

        if (
          code === "USER_ALREADY_EXISTS" ||
          /already exists/i.test(message)
        ) {
          setErrors((prev) => ({
            ...prev,
            email:
              "An account with this email already exists. Sign in instead or use another email.",
          }));
          toast.error("This email is already registered.");
          return;
        }

        if (
          code === "PASSWORD_TOO_SHORT" ||
          code === "PASSWORD_MISSING_UPPERCASE" ||
          code === "PASSWORD_MISSING_LOWERCASE" ||
          code === "INVALID_PASSWORD"
        ) {
          setErrors((prev) => ({
            ...prev,
            password:
              message ||
              "Password must be at least 6 characters and include uppercase and lowercase letters.",
          }));
          toast.error("Please choose a stronger password.");
          return;
        }

        toast.error(message);
        return;
      }

      // Registration creates the account but Better Auth email sign-up is
      // configured with autoSignIn disabled. Establish the Better Auth session,
      // exchange it for the Express JWT HTTPOnly cookie, then continue.
      const normalizedEmail = email.trim().toLowerCase();
      const signInResult = await authClient.signIn.email({
        email: normalizedEmail,
        password,
        rememberMe: true,
      });

      if (signInResult.error) {
        toast.error(
          signInResult.error.message ||
            "Account created, but we could not sign you in automatically. Please sign in to continue.",
        );
        router.push(loginHref);
        return;
      }

      try {
        await exchangeSessionForApiToken();
      } catch (tokenError) {
        toast.error(
          tokenError instanceof Error
            ? `Account created and signed in, but the API session could not be created. ${tokenError.message}`
            : "Account created and signed in, but the API session could not be created.",
        );
        router.push(loginHref);
        return;
      }

      toast.success("Account created successfully. You are signed in.");
      router.replace(safeTarget);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We could not create your account. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    if (googleLoading) return;
    setGoogleLoading(true);

    try {
      const providers = await fetchAuthProviders();

      if (!providers.google) {
        toast.error(
          "Google sign-in is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to studiospace-server/.env, then restart the API.",
        );
        return;
      }

      const callbackURL = buildOAuthCallbackUrl(
        clientEnv.APP_URL,
        requestedRedirect,
      );

      await authClient.signIn.social({
        provider: "google",
        callbackURL,
        newUserCallbackURL: callbackURL,
        errorCallbackURL: `${clientEnv.APP_URL.replace(/\/+$/, "")}/register`,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Google sign-in could not be started. Please try again.",
      );
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <>
      <div className="mb-6 space-y-1.5">
        <h2 className="type-h3 text-foreground">Create your account</h2>
        <p className="text-sm text-muted-foreground">
          Join StudioSpace to book creative spaces and manage your own listings.
        </p>
      </div>

      {oauthMessage ? (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-destructive/20 bg-destructive-soft/50 px-3 py-2 text-sm text-destructive"
        >
          {oauthMessage}
        </div>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="register-name">Name</Label>
          <Input
            id="register-name"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "register-name-error" : undefined}
            required
          />
          <FieldError id="register-name-error" message={errors.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            required
          />
          <FieldError id="register-email-error" message={errors.email} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-photo-url">
            Photo URL{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="register-photo-url"
            type="url"
            name="photoUrl"
            autoComplete="photo"
            inputMode="url"
            placeholder="https://example.com/your-photo.jpg"
            value={photoUrl}
            onChange={(event) => {
              setPhotoUrl(event.target.value);
              if (errors.photoUrl) {
                setErrors((prev) => ({ ...prev, photoUrl: undefined }));
              }
            }}
            aria-invalid={Boolean(errors.photoUrl)}
            aria-describedby={
              errors.photoUrl ? "register-photo-url-error" : undefined
            }
          />
          <FieldError id="register-photo-url-error" message={errors.photoUrl} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              className="pr-11"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password
                  ? "register-password-error register-password-rules"
                  : "register-password-rules"
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 grid w-10 place-items-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
          <FieldError id="register-password-error" message={errors.password} />
          <div id="register-password-rules">
            <PasswordRequirements password={password} />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <UserPlus aria-hidden="true" />
          )}
          {submitting ? "Creating account…" : "Register"}
        </Button>
      </form>

      <AuthDivider />

      <GoogleSignInButton onClick={() => void handleGoogle()} loading={googleLoading} />

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={loginHref}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Login
        </Link>
      </p>
    </>
  );
}
