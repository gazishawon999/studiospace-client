"use client";

import { Check, X, LoaderCircle } from "lucide-react";
import { GoogleBrandIcon } from "@/components/shared/social-icons";
import { Button } from "@/components/ui/button";
import { checkPassword } from "@/lib/auth";
import { cn } from "cn";

export function FieldError({
  id,
  message,
}: {
  id?: string;
  message?: string | null;
}) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className="text-xs leading-relaxed font-medium text-destructive"
    >
      {message}
    </p>
  );
}

export function PasswordRequirements({ password }: { password: string }) {
  const checks = checkPassword(password);

  return (
    <ul className="grid gap-1 pt-1" aria-label="Password requirements">
      {checks.map((check) => (
        <li
          key={check.id}
          className={cn(
            "flex items-center gap-1.5 text-xs",
            check.passed ? "text-success" : "text-muted-foreground",
          )}
        >
          {check.passed ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : (
            <X className="size-3.5" aria-hidden="true" />
          )}
          <span>{check.label}</span>
          <span className="sr-only">
            {check.passed ? "requirement met" : "requirement not met"}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function AuthDivider() {
  return (
    <div className="relative my-5 flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-border" />
      <span className="text-[0.6875rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        or
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function GoogleSignInButton({
  onClick,
  loading = false,
  disabled = false,
}: {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <LoaderCircle className="animate-spin" aria-hidden="true" />
      ) : (
        <GoogleBrandIcon />
      )}
      Continue with Google
    </Button>
  );
}
