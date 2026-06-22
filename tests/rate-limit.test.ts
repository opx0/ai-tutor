import { afterEach, describe, expect, it, vi } from "vitest";
import { consumeRateLimit } from "../lib/rate-limit";

// No UPSTASH_* env in tests → exercises the in-memory backend.
describe("consumeRateLimit (in-memory backend)", () => {
  afterEach(() => vi.useRealTimers());

  it("allows up to max, then blocks with a retry hint", async () => {
    const key = `allow-${Math.random()}`;
    const opts = { max: 3, windowMs: 60_000 };
    expect((await consumeRateLimit(key, opts)).allowed).toBe(true);
    expect((await consumeRateLimit(key, opts)).allowed).toBe(true);
    expect((await consumeRateLimit(key, opts)).allowed).toBe(true);

    const blocked = await consumeRateLimit(key, opts);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
    expect(blocked.remaining).toBe(0);
  });

  it("resets after the window elapses", async () => {
    vi.useFakeTimers();
    const key = `reset-${Math.random()}`;
    const opts = { max: 1, windowMs: 1_000 };
    expect((await consumeRateLimit(key, opts)).allowed).toBe(true);
    expect((await consumeRateLimit(key, opts)).allowed).toBe(false);
    vi.advanceTimersByTime(1_500);
    expect((await consumeRateLimit(key, opts)).allowed).toBe(true);
  });

  it("tracks separate keys independently", async () => {
    const opts = { max: 1, windowMs: 60_000 };
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    expect((await consumeRateLimit(a, opts)).allowed).toBe(true);
    expect((await consumeRateLimit(b, opts)).allowed).toBe(true);
    expect((await consumeRateLimit(a, opts)).allowed).toBe(false);
  });
});
