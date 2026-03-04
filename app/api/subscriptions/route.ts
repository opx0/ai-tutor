import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { authOptions } from "@/lib/auth";
import { logApiRequest, logError, logInfo } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { SUBSCRIPTION_PLANS, createOrder } from "@/lib/razorpay";
import { getServerSession } from "next-auth";
import { type NextRequest } from "next/server";
import { z } from "zod";

const createOrderSchema = z.object({
  planId: z.string().min(1, "Plan ID is required"),
});

// Get subscription plans
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createErrorResponse(
        "Unauthorized. Please sign in.",
        401,
        undefined,
        "UNAUTHORIZED"
      );
    }

    // Get user's current subscription status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
        freeCoursesUsed: true,
      },
    });

    // Get available subscription plans
    let subscriptionPlans = await prisma.subscription.findMany({
      where: { isActive: true },
    });

    // If no plans exist in the database, create them
    if (subscriptionPlans.length === 0) {
      await prisma.subscription.createMany({
        data: [
          {
            name: SUBSCRIPTION_PLANS.MONTHLY.name,
            description: SUBSCRIPTION_PLANS.MONTHLY.description,
            price: SUBSCRIPTION_PLANS.MONTHLY.price,
            interval: SUBSCRIPTION_PLANS.MONTHLY.interval,
            features: SUBSCRIPTION_PLANS.MONTHLY.features,
          },
          {
            name: SUBSCRIPTION_PLANS.YEARLY.name,
            description: SUBSCRIPTION_PLANS.YEARLY.description,
            price: SUBSCRIPTION_PLANS.YEARLY.price,
            interval: SUBSCRIPTION_PLANS.YEARLY.interval,
            features: SUBSCRIPTION_PLANS.YEARLY.features,
          },
        ],
      });

      subscriptionPlans = await prisma.subscription.findMany({
        where: { isActive: true },
      });
    }

    return createSuccessResponse({
      subscriptionStatus: user?.subscriptionStatus || "FREE",
      subscriptionExpiresAt: user?.subscriptionExpiresAt || null,
      freeCoursesUsed: user?.freeCoursesUsed || 0,
      plans: subscriptionPlans,
    });
  } catch (error) {
    logError("Error fetching subscription plans", {
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to fetch subscription plans",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "SUBSCRIPTION_FETCH_ERROR"
    );
  }
}

// Create a new subscription order
export async function POST(req: NextRequest) {
  const requestContext = logApiRequest(req);

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createErrorResponse(
        "Unauthorized. Please sign in.",
        401,
        undefined,
        "UNAUTHORIZED"
      );
    }

    const body = await req.json();

    // Validate input
    const validation = createOrderSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        "Invalid input data",
        400,
        JSON.stringify(validation.error.flatten().fieldErrors),
        "VALIDATION_ERROR"
      );
    }

    const { planId } = validation.data;

    // Get the subscription plan
    const plan = await prisma.subscription.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return createErrorResponse(
        "Subscription plan not found",
        404,
        undefined,
        "PLAN_NOT_FOUND"
      );
    }

    // Create a Razorpay order
    const receiptId = `sub_${Date.now().toString().slice(-8)}`;
    const order = await createOrder(plan.price, plan.currency, receiptId);

    // Create a transaction record
    const transaction = await prisma.subscriptionTransaction.create({
      data: {
        userId: session.user.id,
        subscriptionId: plan.id,
        amount: plan.price,
        currency: plan.currency,
        status: "CREATED",
        razorpayOrderId: order.id,
      },
    });

    logInfo("Subscription order created", {
      ...requestContext,
      transactionId: transaction.id,
    });

    return createSuccessResponse({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      transactionId: transaction.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error: unknown) {
    logError("Error creating subscription order", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });

    // Provide more specific error messages for Razorpay errors
    const razorpayError = error as { error?: { description?: string; code?: string }; statusCode?: number };
    if (razorpayError?.error?.description) {
      return createErrorResponse(
        "Failed to create subscription order",
        razorpayError.statusCode || 500,
        razorpayError.error.description,
        razorpayError.error.code || "RAZORPAY_ERROR"
      );
    }

    return createErrorResponse(
      "Failed to create subscription order",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "SUBSCRIPTION_ORDER_ERROR"
    );
  }
}
