import crypto from "crypto";
import Razorpay from "razorpay";
import { prisma } from "./prisma";

let razorpay: Razorpay | null = null;

function getRazorpayClient() {
  if (!razorpay) {
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_SECRET_ID;

    if (!key_id || !key_secret) {
      // In a real application, you might want to log this error or handle it differently
      // For now, we'll just return null and let the calling function handle it
      return null;
    }

    razorpay = new Razorpay({
      key_id,
      key_secret,
    });
  }
  return razorpay;
}

export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: "monthly",
    name: "Premium Monthly",
    description: "Unlimited access to all courses and features",
    price: 49900,
    interval: "MONTHLY" as const,
    features: [
      "Unlimited course access",
      "Unlimited module access",
      "AI instructor for all courses",
      "Download course materials",
      "Priority support",
    ],
  },
  YEARLY: {
    id: "yearly",
    name: "Premium Yearly",
    description: "Unlimited access to all courses and features with 2 months free",
    price: 499900,
    interval: "YEARLY" as const,
    features: ["All monthly features", "2 months free (save ₹999)", "Early access to new features"],
  },
};

// Create Razorpay order
export async function createOrder(amount: number, currency: string = "INR", receipt: string) {
  const client = getRazorpayClient();
  if (!client) {
    throw new Error("Razorpay client is not initialized.");
  }

  try {
    // Ensure receipt is no more than 40 characters (Razorpay requirement)
    const truncatedReceipt = receipt.substring(0, 40);

    const order = await client.orders.create({
      amount,
      currency,
      receipt: truncatedReceipt,
    });
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
}

// Constant-time hex-string comparison to avoid signature timing attacks.
function safeEqualHex(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) {
    return false;
  }
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

// Verify the Razorpay payment signature (checkout handshake): HMAC-SHA256 of
// `orderId|paymentId` keyed by the secret, compared in constant time.
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const key_secret = process.env.RAZORPAY_SECRET_ID;
  if (!key_secret) {
    throw new Error("Razorpay secret ID is not configured.");
  }
  const generatedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return safeEqualHex(generatedSignature, signature);
}

// Verify a Razorpay *webhook* signature: HMAC-SHA256 of the raw request body
// keyed by RAZORPAY_WEBHOOK_SECRET (set in the Razorpay dashboard webhook config).
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Razorpay webhook secret is not configured.");
  }
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}

// Create a Razorpay customer
export async function createCustomer(name: string, email: string) {
  const client = getRazorpayClient();
  if (!client) {
    throw new Error("Razorpay client is not initialized.");
  }
  try {
    const customer = await client.customers.create({
      name,
      email,
      fail_existing: 0,
    });
    return customer;
  } catch (error) {
    console.error("Error creating Razorpay customer:", error);
    throw error;
  }
}

// Create a Razorpay subscription
export async function createSubscription(
  planId: string,
  customerId: string,
  totalCount: number = 12,
) {
  const client = getRazorpayClient();
  if (!client) {
    throw new Error("Razorpay client is not initialized.");
  }
  try {
    // Note: This is a simplified version - in a real implementation,
    // you would need to use the correct Razorpay API parameters
    const subscription = await client.subscriptions.create({
      plan_id: planId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(customerId ? ({ customer_id: customerId } as any) : {}),
      total_count: totalCount as any,
    });
    return subscription;
  } catch (error) {
    console.error("Error creating Razorpay subscription:", error);
    throw error;
  }
}

// Cancel a Razorpay subscription
export async function cancelSubscription(subscriptionId: string) {
  const client = getRazorpayClient();
  if (!client) {
    throw new Error("Razorpay client is not initialized.");
  }
  try {
    const subscription = await client.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error("Error cancelling Razorpay subscription:", error);
    throw error;
  }
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  const client = getRazorpayClient();
  if (!client) {
    throw new Error("Razorpay client is not initialized.");
  }
  try {
    const subscription = await client.subscriptions.fetch(subscriptionId);
    return subscription;
  } catch (error) {
    console.error("Error fetching Razorpay subscription:", error);
    throw error;
  }
}

export type CaptureResult =
  | { ok: false; reason: "not_found" }
  | {
      ok: true;
      alreadyCaptured: boolean;
      userId: string;
      subscriptionStatus: string | null;
      subscriptionExpiresAt: Date | null;
    };

/**
 * Idempotently capture a subscription payment: flip the transaction
 * CREATED→CAPTURED and upgrade the user to PREMIUM, computing the new expiry
 * server-side. Safe to call from BOTH the client verify route and the webhook —
 * a conditional update guarantees only the first caller performs the upgrade.
 */
export async function captureSubscriptionPayment(params: {
  transactionId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
}): Promise<CaptureResult> {
  const { transactionId, razorpayPaymentId, razorpaySignature } = params;

  const transaction = await prisma.subscriptionTransaction.findUnique({
    where: { id: transactionId },
    include: {
      subscription: true,
      user: {
        select: { id: true, subscriptionStatus: true, subscriptionExpiresAt: true },
      },
    },
  });

  if (!transaction) {
    return { ok: false, reason: "not_found" };
  }

  if (transaction.status === "CAPTURED") {
    return {
      ok: true,
      alreadyCaptured: true,
      userId: transaction.userId,
      subscriptionStatus: transaction.user.subscriptionStatus,
      subscriptionExpiresAt: transaction.user.subscriptionExpiresAt,
    };
  }

  const now = new Date();
  const baseDate =
    transaction.user.subscriptionExpiresAt && transaction.user.subscriptionExpiresAt > now
      ? transaction.user.subscriptionExpiresAt
      : now;
  const expiryDate = new Date(baseDate);
  if (transaction.subscription.interval === "MONTHLY") {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  } else if (transaction.subscription.interval === "YEARLY") {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  }

  // Conditional update: only the first writer (client verify OR webhook) flips
  // CREATED→CAPTURED and upgrades the user, so concurrent calls can't double-apply.
  const captured = await prisma.$transaction(async (tx) => {
    const res = await tx.subscriptionTransaction.updateMany({
      where: { id: transactionId, status: { not: "CAPTURED" } },
      data: {
        status: "CAPTURED",
        razorpayPaymentId,
        ...(razorpaySignature ? { razorpaySignature } : {}),
      },
    });
    if (res.count === 0) {
      return false;
    }
    await tx.user.update({
      where: { id: transaction.userId },
      data: { subscriptionStatus: "PREMIUM", subscriptionExpiresAt: expiryDate },
    });
    return true;
  });

  return {
    ok: true,
    alreadyCaptured: !captured,
    userId: transaction.userId,
    subscriptionStatus: "PREMIUM",
    subscriptionExpiresAt: expiryDate,
  };
}

type AccessUser = {
  subscriptionStatus?: string | null;
  freeCoursesUsed?: number | null;
};

function normalizeSubscriptionStatus(status: string | null | undefined) {
  if (!status) return null;
  const normalized = status.toUpperCase();
  if (normalized === "FREE" || normalized === "PREMIUM" || normalized === "CANCELLED") {
    return normalized;
  }
  return null;
}

// Check if a user has access to a full course
export function hasFullCourseAccess(user: AccessUser, _courseId: string) {
  const status = normalizeSubscriptionStatus(user.subscriptionStatus);
  const freeCoursesUsed = user.freeCoursesUsed ?? 0;

  // Premium users have access to all courses
  if (status === "PREMIUM") {
    return true;
  }

  // Free users can access one full course
  if (status === "FREE" && freeCoursesUsed === 0) {
    return true;
  }

  return false;
}

// Check if a user has access to a specific module
export function hasModuleAccess(
  user: AccessUser,
  _courseId: string, // kept for compatibility with call sites
  moduleOrder: number,
) {
  const status = normalizeSubscriptionStatus(user.subscriptionStatus);
  const freeCoursesUsed = user.freeCoursesUsed ?? 0;

  // Premium users have access to all modules
  if (status === "PREMIUM") {
    return true;
  }

  // Free users can access up to 3 modules per course (except their first course)
  if (status === "FREE") {
    // If this is their first course, they can access all modules
    if (freeCoursesUsed === 0) {
      return true;
    }

    // Otherwise, they can only access the first 3 modules
    return moduleOrder < 3;
  }

  return false;
}
