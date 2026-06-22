import { type NextRequest, NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { captureSubscriptionPayment, verifyWebhookSignature } from "@/lib/razorpay";

// Razorpay webhooks need the Node runtime (crypto + Prisma) and the raw body.
export const runtime = "nodejs";

/**
 * Razorpay webhook receiver — the resilient capture path.
 *
 * The client-driven /api/subscriptions/verify flow can be missed if the user
 * closes the tab right after paying. This webhook captures the payment server-
 * side regardless. Configure it in the Razorpay dashboard (events:
 * `payment.captured`, `order.paid`) and set RAZORPAY_WEBHOOK_SECRET.
 */
export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // The HMAC is computed over the EXACT bytes Razorpay sent — read the raw body.
  const rawBody = await req.text();

  let valid = false;
  try {
    valid = verifyWebhookSignature(rawBody, signature);
  } catch {
    // Secret not configured — fail closed rather than silently accepting.
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // biome-ignore lint/suspicious/noExplicitAny: Razorpay webhook payload is dynamic.
  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const type: string | undefined = event?.event;
    if (type === "payment.captured" || type === "order.paid") {
      const payment = event?.payload?.payment?.entity;
      const orderId: string | undefined = payment?.order_id ?? event?.payload?.order?.entity?.id;
      const paymentId: string | undefined = payment?.id;

      if (orderId) {
        const transaction = await prisma.subscriptionTransaction.findFirst({
          where: { razorpayOrderId: orderId },
          select: { id: true },
        });
        if (transaction) {
          const result = await captureSubscriptionPayment({
            transactionId: transaction.id,
            razorpayPaymentId: paymentId ?? "razorpay-webhook",
          });
          logInfo("Razorpay webhook processed", {
            type,
            orderId,
            captured: result.ok && !("alreadyCaptured" in result && result.alreadyCaptured),
          });
        }
      }
    }

    // Always ack handled/ignored events so Razorpay doesn't retry forever.
    return NextResponse.json({ received: true });
  } catch (error) {
    logError("Razorpay webhook handler error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}
