"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  X,
} from "lucide-react";
import { cn } from "cn";
import { toast } from "sonner";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Container } from "@/components/shared/container";
import { authClient } from "@/lib/auth-client";
import { logoutUser } from "@/lib/auth-api";
import { isNavLinkActive, PUBLIC_NAV_LINKS } from "@/lib/navigation";
import type { NavbarUser } from "@/types";

const ACCOUNT_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Add New Studio", href: "/add-studio", icon: PlusCircle },
  { label: "My Studio Listings", href: "/my-listings", icon: Building2 },
  { label: "My Bookings", href: "/my-bookings", icon: CalendarDays },
] as const;

export interface SiteHeaderProps {
  /** Optional user seeded by the server to reduce client-side session flicker. */
  initialUser?: NavbarUser | null;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SS";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function UserAvatar({
  user,
  className,
}: {
  user: NavbarUser;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-soft text-[0.7rem] font-bold text-accent-foreground ring-1 ring-border",
        className,
      )}
    >
      {user.image ? (
        // Arbitrary user-provided avatar URLs cannot be statically allow-listed.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.image}
          alt=""
          width={32}
          height={32}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="size-full object-cover"
        />
      ) : (
        getInitials(user.name)
      )}
    </span>
  );
}

function AccountMenu({
  user,
  signingOut,
  onSignOut,
}: {
  user: NavbarUser;
  signingOut: boolean;
  onSignOut: () => void | Promise<void>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="h-10 gap-2 rounded-full pr-2 pl-1.5"
            aria-label={`Open account menu for ${user.name}`}
          />
        }
      >
        <UserAvatar user={user} />
        <span className="hidden max-w-28 truncate text-sm font-medium md:inline">
          {user.name}
        </span>
        <ChevronDown
          className="size-3.5 text-muted-foreground"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2">
            <span className="flex flex-col gap-0.5">
              <span className="truncate text-sm font-semibold text-foreground">
                {user.name}
              </span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          {ACCOUNT_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.label}
                render={<Link href={item.href} />}
                className="gap-2.5 py-2"
              >
                <Icon className="text-muted-foreground" aria-hidden="true" />
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={signingOut}
          onClick={() => {
            void onSignOut();
          }}
          className="gap-2.5 py-2"
        >
          <LogOut aria-hidden="true" />
          {signingOut ? "Logging out…" : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNavLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-foreground hover:bg-muted",
      )}
    >
      {label}
      {active ? (
        <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
      ) : null}
    </Link>
  );
}

function SiteHeader({ initialUser = null }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const session = authClient.useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const user: NavbarUser | null = useMemo(() => {
    const sessionUser = session.data?.user;
    if (sessionUser) {
      return {
        name: sessionUser.name || "StudioSpace user",
        email: sessionUser.email || "",
        image: sessionUser.image ?? null,
      };
    }

    if (!session.isPending) {
      return null;
    }

    return initialUser;
  }, [initialUser, session.data?.user, session.isPending]);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);

    try {
      await logoutUser();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We could not sign you out. Please try again.",
      );
      setSigningOut(false);
      return;
    }

    try {
      await authClient.signOut();
    } catch {
      // The Express logout already revoked the Better Auth session; a client-side
      // signOut failure is non-fatal.
    }

    setMobileOpen(false);
    toast.success("You have been signed out.");
    router.replace("/");
    router.refresh();
    setSigningOut(false);
  }

  return (
    <header
      className={cn(
        "no-print sticky top-0 z-40 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-border/80 bg-background/85 shadow-soft"
          : "border-transparent bg-background/65",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <div className="flex items-center gap-8">
          <BrandLogo />

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {PUBLIC_NAV_LINKS.map((link) => {
              const active = isNavLinkActive(link.href, pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent/80 text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />

          {user ? (
            <AccountMenu
              user={user}
              signingOut={signingOut}
              onSignOut={handleSignOut}
            />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <ButtonLink href="/login" variant="ghost" size="sm">
                Login
              </ButtonLink>
              <ButtonLink href="/register" size="sm">
                Register
              </ButtonLink>
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open main menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </Container>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent
          id="mobile-navigation"
          showCloseButton={false}
          className="inset-0 top-0 left-0 h-dvh w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 p-0 ring-0 sm:max-w-none lg:hidden"
        >
          <DialogTitle className="sr-only">StudioSpace navigation</DialogTitle>

          <div className="flex h-full flex-col bg-background">
            <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
              <BrandLogo onClick={closeMobile} />
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <DialogClose
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Close menu"
                    />
                  }
                >
                  <X aria-hidden="true" />
                </DialogClose>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
              <nav aria-label="Mobile primary" className="flex flex-col gap-1">
                {PUBLIC_NAV_LINKS.map((link) => (
                  <MobileNavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    active={isNavLinkActive(link.href, pathname)}
                    onNavigate={closeMobile}
                  />
                ))}
              </nav>

              {user ? (
                <div className="mt-8">
                  <p className="type-eyebrow mb-3 px-4 text-muted-foreground">
                    Your StudioSpace
                  </p>
                  <nav aria-label="Account" className="flex flex-col gap-1">
                    {ACCOUNT_LINKS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeMobile}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                            isNavLinkActive(item.href, pathname)
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground hover:bg-muted",
                          )}
                        >
                          <Icon
                            className="size-4 text-muted-foreground"
                            aria-hidden="true"
                          />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ) : null}
            </div>

            <div className="shrink-0 border-t border-border bg-surface/60 p-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-1">
                    <UserAvatar user={user} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start gap-2.5 text-destructive hover:text-destructive"
                    disabled={signingOut}
                    onClick={() => {
                      void handleSignOut();
                    }}
                  >
                    <LogOut aria-hidden="true" />
                    {signingOut ? "Logging out…" : "Logout"}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <ButtonLink
                    href="/login"
                    variant="outline"
                    onClick={closeMobile}
                  >
                    Login
                  </ButtonLink>
                  <ButtonLink href="/register" onClick={closeMobile}>
                    Register
                  </ButtonLink>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export { SiteHeader };
