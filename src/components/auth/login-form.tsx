"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, LogIn } from "lucide-react";
import { toast } from "sonner";
import {
  AuthDivider,
  FieldError,
  GoogleSignInButton,
} from "@/components/auth/auth-form-parts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { fetchAuthProviders, exchangeSessionForApiToken, buildOAuthCallbackUrl } from "@/lib/auth-api";
import { getEmailError, sanitizeRedirect } from "@/lib/auth";
import { clientEnv } from "@/lib/env";

interface FieldErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRedirect = searchParams.get("redirect");
  const safeTarget = sanitizeRedirect(requestedRedirect, "/");
  const oauthError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const oauthMessage =
    oauthError === "access_denied"
      ? "Google sign-in was cancelled. You can try again or use your email and password."
      : oauthError
        ? "Google sign-in could not be completed. Please try again or use your email and password."
        : null;

  useEffect(() => {
    if (oauthMessage) {
      toast.error(oauthMessage);
    }
  }, [oauthMessage]);

  const registerHref = requestedRedirect
    ? `/register?redirect=${encodeURIComponent(safeTarget)}`
    : "/register";

  function validate(): boolean {
    const next: FieldErrors = {
      email: getEmailError(email) ?? undefined,
      password: password ? undefined : "Password is required.",
    };

    setErrors(next);
    return !next.email && !next.password;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
        rememberMe: true,
      });

      if (result.error) {
        toast.error(
          result.error.message ||
            "We could not sign you in. Check your email and password and try again.",
        );
        return;
      }

      try {
        await exchangeSessionForApiToken();
      } catch (tokenError) {
        toast.error(
          tokenError instanceof Error
            ? `Signed in, but the API session could not be created. ${tokenError.message}`
            : "Signed in, but the API session could not be created.",
        );
        return;
      }

      toast.success("Welcome back. You are signed in.");
      router.replace(safeTarget);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We could not sign you in. Please try again.",
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
        errorCallbackURL: `${clientEnv.APP_URL.replace(/\/+$/, "")}/login`,
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
        <h2 className="type-h3 text-foreground">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Sign in to manage your listings, bookings, and studio profile.
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
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            required
          />
          <FieldError id="login-email-error" message={errors.email} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="login-password">Password</Label>

            <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
              <DialogTrigger
                render={
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs font-medium"
                  />
                }
              >
                Forgot password?
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Password recovery is not enabled</DialogTitle>
                  <DialogDescription>
                    This assignment build intentionally does not implement
                    forgot-password emails or email verification. If you cannot
                    access your account, register with a different email or ask
                    the project owner to reset the account in MongoDB.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button />}>Got it</DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              className="pr-11"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "login-password-error" : undefined}
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
          <FieldError id="login-password-error" message={errors.password} />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <LogIn aria-hidden="true" />
          )}
          {submitting ? "Signing in…" : "Login"}
        </Button>
      </form>

      <AuthDivider />

      <GoogleSignInButton onClick={() => void handleGoogle()} loading={googleLoading} />

      <p className="mt-5 text-center text-sm text-muted-foreground">
        New to StudioSpace?{" "}
        <Link
          href={registerHref}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
