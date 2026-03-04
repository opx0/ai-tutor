import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils";
import { authOptions } from "@/lib/auth";
import { logApiRequest, logError, logInfo } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { getServerSession } from "next-auth";
import { type NextRequest } from "next/server";
import { z } from "zod";

const verifyPaymentSchema = z.object({
  razorpayPaymentId: z.string().min(1, "Payment ID is required"),
  razorpayOrderId: z.string().min(1, "Order ID is required"),
  razorpaySignature: z.string().min(1, "Signature is required"),
  transactionId: z.string().min(1, "Transaction ID is required"),
});

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
    const validation = verifyPaymentSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        "Invalid input data",
        400,
        JSON.stringify(validation.error.flatten().fieldErrors),
        "VALIDATION_ERROR"
      );
    }

    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, transactionId } =
      validation.data;

    // Verify the payment signature
    const isValidSignature = verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValidSignature) {
      return createErrorResponse(
        "Invalid payment signature",
        400,
        undefined,
        "INVALID_SIGNATURE"
      );
    }

    // Get the transaction
    const transaction = await prisma.subscriptionTransaction.findUnique({
      where: { id: transactionId },
      include: { subscription: true },
    });

    if (!transaction) {
      return createErrorResponse(
        "Transaction not found",
        404,
        undefined,
        "TRANSACTION_NOT_FOUND"
      );
    }

    // Update the transaction
    await prisma.subscriptionTransaction.update({
      where: { id: transactionId },
      data: {
        status: "CAPTURED",
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    // Calculate subscription expiry date
    const now = new Date();
    const expiryDate = new Date();

    if (transaction.subscription.interval === "MONTHLY") {
      expiryDate.setMonth(now.getMonth() + 1);
    } else if (transaction.subscription.interval === "YEARLY") {
      expiryDate.setFullYear(now.getFullYear() + 1);
    }

    // Update user's subscription status
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionStatus: "PREMIUM",
        subscriptionExpiresAt: expiryDate,
      },
    });

    logInfo("Payment verified and subscription activated", {
      ...requestContext,
      transactionId,
    });

    return createSuccessResponse({
      message: "Payment verified successfully",
      subscriptionStatus: "PREMIUM",
      subscriptionExpiresAt: expiryDate,
    });
  } catch (error) {
    logError("Error verifying payment", {
      ...requestContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return createErrorResponse(
      "Failed to verify payment",
      500,
      error instanceof Error ? error.message : "Unknown error",
      "PAYMENT_VERIFICATION_ERROR"
    );
  }
}
