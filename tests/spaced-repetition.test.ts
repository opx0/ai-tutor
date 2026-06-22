import { describe, expect, it } from "vitest";
import { sm2 } from "../lib/spaced-repetition";

describe("sm2 (SM-2 spaced repetition)", () => {
  it("resets repetitions and uses a 1-day interval on failure (q<3)", () => {
    const out = sm2({ quality: 2, repetitions: 5, easeFactor: 2.5, interval: 30 });
    expect(out.repetitions).toBe(0);
    expect(out.interval).toBe(1);
    expect(out.easeFactor).toBe(2.5); // unchanged on failure
  });

  it("first successful review → interval 1, repetitions 1", () => {
    const out = sm2({ quality: 4, repetitions: 0, easeFactor: 2.5, interval: 0 });
    expect(out.repetitions).toBe(1);
    expect(out.interval).toBe(1);
  });

  it("second successful review → interval 6", () => {
    const out = sm2({ quality: 5, repetitions: 1, easeFactor: 2.5, interval: 1 });
    expect(out.repetitions).toBe(2);
    expect(out.interval).toBe(6);
  });

  it("third+ review scales the interval by the ease factor", () => {
    const out = sm2({ quality: 5, repetitions: 2, easeFactor: 2.5, interval: 6 });
    expect(out.repetitions).toBe(3);
    expect(out.interval).toBe(Math.round(6 * 2.5));
  });

  it("never drops the ease factor below 1.3", () => {
    let ef = 1.3;
    for (let i = 0; i < 10; i++) {
      ef = sm2({ quality: 3, repetitions: 5, easeFactor: ef, interval: 10 }).easeFactor;
    }
    expect(ef).toBeGreaterThanOrEqual(1.3);
  });

  it("caps the interval at 365 days", () => {
    const out = sm2({ quality: 5, repetitions: 10, easeFactor: 2.5, interval: 1000 });
    expect(out.interval).toBe(365);
  });

  it("schedules nextReviewAt at local midnight", () => {
    const out = sm2({ quality: 4, repetitions: 0, easeFactor: 2.5, interval: 0 });
    expect(out.nextReviewAt.getHours()).toBe(0);
    expect(out.nextReviewAt.getMinutes()).toBe(0);
  });
});
