"use client";

import { usePathname } from "next/navigation";

interface AmbientBackgroundProps {
  /** 'full' = landing page intensity, 'subtle' = interior pages */
  variant?: "full" | "subtle";
}

/**
 * Unified ambient background with animated gradient blobs and dot grid.
 * Uses pure CSS animations — no JS runtime overhead.
 * Automatically hides on /auth/* routes.
 */
export function AmbientBackground({ variant = "subtle" }: AmbientBackgroundProps) {
  const pathname = usePathname();

  // Don't render on auth pages (they have their own CanvasRevealEffect)
  if (pathname.startsWith("/auth")) {
    return null;
  }

  const isFull = variant === "full";

  return (
    <div className="ambient-bg" aria-hidden="true">
      {/* Blob 1 — primary color, top-right */}
      <div
        className={`ambient-blob ambient-blob-1 ${isFull ? "opacity-[0.07]" : "opacity-[0.04]"}`}
      />
      {/* Blob 2 — blue accent, bottom-left */}
      <div
        className={`ambient-blob ambient-blob-2 ${isFull ? "opacity-[0.06]" : "opacity-[0.03]"}`}
      />
      {/* Blob 3 — teal accent, center (full variant only) */}
      {isFull && (
        <div className="ambient-blob ambient-blob-3 opacity-[0.05]" />
      )}
      {/* Dot grid overlay */}
      <div className="ambient-dot-grid" />
    </div>
  );
}
