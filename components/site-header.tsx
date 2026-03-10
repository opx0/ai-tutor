"use client";

import {
    Bookmark,
    BookOpen,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Map,
    StickyNote,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";

const navTabs = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Learn", icon: Map, href: "/courses" },
  { title: "My Courses", icon: BookOpen, href: "/courses/my" },
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

  // Find the active index: exact match first, then best prefix match
  // "/courses/my" should match "My Courses", "/courses/[slug]" should match "Learn"
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

  if (pathname?.startsWith("/auth")) return null;

  return (
    <header className="sticky top-4 z-50 w-full mb-6">
      {/*
        Container for the centered dock.
        Instead of a full-width header block, we use a max-width container
        with extreme margin auto to center the entire navigation.
      */}
      <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl relative h-16">

        {/* Logo - Absolute Left */}
        <div className="absolute left-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative overflow-hidden rounded-xl border border-border/50 shadow-sm transition-transform group-hover:scale-105">
              <Image
                src="/logo.svg"
                alt="AI Tutor"
                width={36}
                height={36}
                className="bg-background"
                priority
              />
            </div>
            <span className="font-bold text-lg hidden sm:inline-block tracking-tight text-foreground transition-colors group-hover:text-primary">
              AI Tutor
            </span>
          </Link>
        </div>

        {/* Main Navigation - Absolute Center Dock */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2">
          <ExpandableTabs
            tabs={tabs}
            activeIndex={activeIndex}
            onChange={handleTabChange}
            activeColor="text-primary"
            className="shadow-md shadow-black/5" // Extra pop for the centered dock
          />
        </nav>

        {/* Right side controls - Absolute Right */}
        <div className="absolute right-4 flex items-center gap-3">
          <ModeToggle />

          {status === "loading" ? (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse"></div>
          ) : status === "authenticated" ? (
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-xl border border-border/50 p-1 rounded-full shadow-sm">
              <Link href="/profile" className="rounded-full ring-2 ring-transparent transition-all hover:ring-primary/50">
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
                <LogOut className="h-4 w-4" />
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
      </div>
    </header>
  );
}
