import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { AppToaster } from "@/components/providers/app-toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { BackToTop } from "@/components/shared/back-to-top";
import { clientEnv } from "@/lib/env";
import type { AuthUserResponse, NavbarUser } from "@/types";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["600", "700", "800"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.APP_URL),
  title: {
    default: "StudioSpace | Creative Workspace & Production Studio Marketplace",
    template: "%s | StudioSpace",
  },
  description:
    "Discover, filter, and book peer-to-peer photography cyc walls, cinema sound stages, podcast lounges, music suites, and art workshops.",
  applicationName: "StudioSpace",
  authors: [{ name: "StudioSpace" }],
  keywords: [
    "creative workspace",
    "photo studio rental",
    "sound stage",
    "podcast studio",
    "music suite",
    "studio marketplace",
  ],
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0d" },
  ],
};

async function getInitialUser(): Promise<NavbarUser | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (!cookieHeader) return null;

    const response = await fetch(`${clientEnv.API_URL}/auth/me`, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
        accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = (await response.json()) as AuthUserResponse;
    const user = data?.data?.user;
    if (!user) return null;

    return {
      name: user.name || "StudioSpace user",
      email: user.email || "",
      image: user.image ?? null,
    };
  } catch {
    // In cross-origin deployments the Express JWT cookie may not be readable by
    // the Next.js server. The client-side session/guard still enforces auth.
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialUser = await getInitialUser();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${syne.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="studiospace-theme"
        >
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <SiteHeader initialUser={initialUser} />

          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>

          <SiteFooter />
          <BackToTop />
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
