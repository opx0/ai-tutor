import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { captureSubscriptionPayment, verifyPaymentSignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, transactionId } = body;

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !transactionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get the transaction
    const transaction = await prisma.subscriptionTransaction.findUnique({
      where: {
        id: transactionId,
      },
      include: {
        subscription: true,
        user: {
          select: {
            id: true,
            subscriptionStatus: true,
            subscriptionExpiresAt: true,
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (transaction.userId !== session.user.id) {
      return NextResponse.json(
        { error: "This transaction does not belong to the current user." },
        { status: 403 },
      );
    }

    if (!transaction.razorpayOrderId || transaction.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json(
        { error: "Order ID mismatch for this transaction." },
        { status: 400 },
      );
    }

    // Idempotent success: already captured.
    if (transaction.status === "CAPTURED") {
      return NextResponse.json({
        success: true,
        message: "Payment already verified",
        subscriptionStatus: transaction.user.subscriptionStatus,
        subscriptionExpiresAt: transaction.user.subscriptionExpiresAt,
      });
    }

    // Verify the payment signature
    const isValidSignature = verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Idempotently capture the payment and upgrade the user (shared with the
    // webhook path so both can never double-apply the upgrade).
    const captureResult = await captureSubscriptionPayment({
      transactionId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!captureResult.ok) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      subscriptionStatus: captureResult.subscriptionStatus,
      subscriptionExpiresAt: captureResult.subscriptionExpiresAt,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
