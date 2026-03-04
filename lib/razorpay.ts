import { logError } from "@/lib/logger";
import crypto from "crypto";
import Razorpay from "razorpay";

// --- Types ---
interface SubscriptionUser {
  subscriptionStatus: string;
  freeCoursesUsed: number;
}

let razorpay: Razorpay | null = null;

function getRazorpayClient() {
  if (!razorpay) {
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_SECRET_ID;

    if (!key_id || !key_secret) {
      return null;
    }

    razorpay = new Razorpay({ key_id, key_secret });
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
    description:
      "Unlimited access to all courses and features with 2 months free",
    price: 499900,
    interval: "YEARLY" as const,
    features: [
      "All monthly features",
      "2 months free (save ₹999)",
      "Early access to new features",
    ],
  },
};

// Create Razorpay order
export async function createOrder(
  amount: number,
  currency: string = "INR",
  receipt: string
) {
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
    logError("Error creating Razorpay order", { error });
    throw error;
  }
}

// Verify Razorpay payment signature
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
) {
  const key_secret = process.env.RAZORPAY_SECRET_ID;
  if (!key_secret) {
    throw new Error("Razorpay secret ID is not configured.");
  }
  const generatedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
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
    logError("Error creating Razorpay customer", { error });
    throw error;
  }
}

// Create a Razorpay subscription
// Note: Uses type assertion for Razorpay SDK parameters that have incomplete type definitions
export async function createSubscription(
  planId: string,
  customerId: string,
  totalCount: number = 12
) {
  const client = getRazorpayClient();
  if (!client) {
    throw new Error("Razorpay client is not initialized.");
  }
  try {
    const subscription = await client.subscriptions.create({
      plan_id: planId,
      total_count: totalCount,
      customer_id: customerId,
    } as Parameters<typeof client.subscriptions.create>[0]);
    return subscription;
  } catch (error) {
    logError("Error creating Razorpay subscription", { error });
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
    logError("Error cancelling Razorpay subscription", { error });
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
    logError("Error fetching Razorpay subscription", { error });
    throw error;
  }
}

// Check if a user has access to a full course
export function hasFullCourseAccess(user: SubscriptionUser, _courseId: string) {
  // Premium users have access to all courses
  if (user.subscriptionStatus === "PREMIUM") {
    return true;
  }

  // Free users can access one full course
  if (user.subscriptionStatus === "FREE" && user.freeCoursesUsed === 0) {
    return true;
  }

  return false;
}

// Check if a user has access to a specific module
export function hasModuleAccess(
  user: SubscriptionUser,
  _courseId: string,
  moduleOrder: number
) {
  // Premium users have access to all modules
  if (user.subscriptionStatus === "PREMIUM") {
    return true;
  }

  // Free users can access up to 3 modules per course (except their first course)
  if (user.subscriptionStatus === "FREE") {
    // If this is their first course, they can access all modules
    if (user.freeCoursesUsed === 0) {
      return true;
    }

    // Otherwise, they can only access the first 3 modules
    return moduleOrder < 3;
  }

  return false;
}
