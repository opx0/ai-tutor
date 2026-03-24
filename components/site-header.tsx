"use client";

import {
    Bookmark,
    BookOpen,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Map,
    StickyNote,
    Flame,
    Orbit,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useEffect } from "react";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";

function StreakIndicator() {
  const { data: session } = useSession();
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/user/streak")
        .then((res) => res.json())
        .then((data) => setStreak(data.streak))
        .catch(console.error);
    }
  }, [session?.user?.email]);

  if (streak === null || streak < 1) return null;

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-sm shadow-sm cursor-help transition-all hover:bg-orange-500/15" title={`${streak} day streak`}>
      <Flame className="w-4 h-4 fill-current" suppressHydrationWarning />
      <span>{streak}</span>
    </div>
  );
}

const navTabs = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Learn", icon: Map, href: "/courses" },
  { title: "DSA Studio", icon: Orbit, href: "/playground" },
  { type: "separator" as const },
  { title: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
  { title: "Notes", icon: StickyNote, href: "/notes" },
  { type: "separator" as const },
  { title: "Subscription", icon: CreditCard, href: "/subscription" },
];

export function SiteHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const tabs = useMemo(
    () =>
      navTabs.map((tab) =>
        tab.type === "separator"
          ? { type: "separator" as const }
          : { title: tab.title, icon: tab.icon }
      ),
    []
  );

  // Find the active index: exact match first, then best prefix match.
  // "/courses/[slug]" should still resolve to "Learn".
  const activeIndex = useMemo(() => {
    if (!pathname) return null;

    // Exact match first
    const exact = navTabs.findIndex(
      (tab) => "href" in tab && tab.href === pathname
    );
    if (exact !== -1) return exact;

    // Prefix match: find the longest matching href (most specific)
    let bestIndex = -1;
    let bestLen = 0;
    navTabs.forEach((tab, i) => {
      if ("href" in tab && tab.href && pathname.startsWith(tab.href)) {
        if (tab.href.length > bestLen) {
          bestLen = tab.href.length;
          bestIndex = i;
        }
      }
    });
    return bestIndex !== -1 ? bestIndex : null;
  }, [pathname]);

  const handleTabChange = useCallback(
    (index: number | null) => {
      if (index === null) return;
      const tab = navTabs[index];
      if (tab && "href" in tab && tab.href) {
        router.push(tab.href);
      }
    },
    [router]
  );

  const isCoursePage = pathname && pathname.split('/').length >= 3 && pathname.startsWith('/courses/');
  if (pathname?.startsWith("/auth") || pathname?.startsWith("/playground") || isCoursePage) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none mt-4 px-4">
      <header className="pointer-events-auto w-full max-w-7xl flex justify-between items-center relative h-14 bg-background/30 dark:bg-black/30 backdrop-blur-3xl border border-white/10 dark:border-white/5 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.02)] px-4">


        {/* Logo - Fixed Left */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative overflow-hidden rounded-xl border border-border/50 shadow-sm transition-transform group-hover:scale-105">
              <Image
                src="/logo.svg"
                alt="LearnLM"
                width={36}
                height={36}
                className="bg-background"
                priority
                suppressHydrationWarning
              />
            </div>
            <span className="font-bold text-lg hidden sm:inline-block tracking-tight text-foreground transition-colors group-hover:text-primary">
              LearnLM
            </span>
          </Link>
        </div>

        {/* Main Navigation - Absolute Center Dock */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center">
          <ExpandableTabs
            tabs={tabs}
            activeIndex={activeIndex}
            onChange={handleTabChange}
            activeColor="text-primary"
            className="bg-transparent border-none shadow-none"
          />
        </nav>

        {/* Right side controls - Fixed Right */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <ModeToggle />

          {status === "loading" ? (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse"></div>
          ) : status === "authenticated" ? (
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-xl border border-border/50 p-1 rounded-full shadow-sm">
              <StreakIndicator /> {/* Added StreakFlame component */}
              <Link href="/profile" className="rounded-full ring-2 ring-transparent transition-all hover:ring-primary/50 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                    {session?.user?.name
                      ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="h-8 w-8 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" suppressHydrationWarning />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-xl border border-border/50 p-1 rounded-2xl shadow-sm">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 rounded-xl px-3 hover:bg-muted/50 transition-colors"
                onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="h-8 rounded-xl px-4 shadow-sm"
                onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
