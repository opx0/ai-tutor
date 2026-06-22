import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import { hasFullCourseAccess, hasModuleAccess, verifyPaymentSignature } from "../lib/razorpay";

// RAZORPAY_SECRET_ID is set to "test_secret" in vitest.config.ts.
describe("verifyPaymentSignature", () => {
  it("accepts a correctly computed HMAC signature", () => {
    const orderId = "order_abc";
    const paymentId = "pay_xyz";
    const sig = crypto
      .createHmac("sha256", "test_secret")
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
    expect(verifyPaymentSignature(orderId, paymentId, sig)).toBe(true);
  });

  it("rejects a tampered/invalid signature", () => {
    expect(verifyPaymentSignature("order_abc", "pay_xyz", "deadbeef")).toBe(false);
  });
});

describe("subscription access control", () => {
  it("premium users access every course and module", () => {
    expect(hasFullCourseAccess({ subscriptionStatus: "PREMIUM" }, "c1")).toBe(true);
    expect(hasModuleAccess({ subscriptionStatus: "PREMIUM" }, "c1", 99)).toBe(true);
  });

  it("free users get exactly one full course", () => {
    expect(hasFullCourseAccess({ subscriptionStatus: "FREE", freeCoursesUsed: 0 }, "c1")).toBe(
      true,
    );
    expect(hasFullCourseAccess({ subscriptionStatus: "FREE", freeCoursesUsed: 1 }, "c1")).toBe(
      false,
    );
  });

  it("free users on a later course only see the first 3 modules", () => {
    expect(hasModuleAccess({ subscriptionStatus: "FREE", freeCoursesUsed: 1 }, "c1", 2)).toBe(true);
    expect(hasModuleAccess({ subscriptionStatus: "FREE", freeCoursesUsed: 1 }, "c1", 3)).toBe(
      false,
    );
  });

  it("denies access when status is unknown/cancelled", () => {
    expect(hasFullCourseAccess({ subscriptionStatus: "CANCELLED" }, "c1")).toBe(false);
    expect(hasFullCourseAccess({ subscriptionStatus: null }, "c1")).toBe(false);
  });
});
