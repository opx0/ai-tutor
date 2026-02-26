"use client";

import { CheckIcon, Loader2, SparklesIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Declare Razorpay as a global variable
declare global {
  interface Window {
    Razorpay: any;
  }
}

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
};

type SubscriptionInfo = {
  subscriptionStatus: string;
  subscriptionExpiresAt: string | null;
  freeCoursesUsed: number;
  plans: SubscriptionPlan[];
};

function FilledCheck() {
  return (
    <div className="bg-primary text-primary-foreground rounded-full p-0.5">
      <CheckIcon className="size-3" strokeWidth={3} />
    </div>
  );
}

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/subscription");
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    if (status === "authenticated") {
      fetchSubscriptionPlans();
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [status, router]);

  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/subscriptions");

      if (!response.ok) {
        throw new Error("Failed to fetch subscription plans");
      }

      const data = await response.json();
      setSubscriptionInfo(data);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      toast.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setProcessingPayment(true);

      const orderResponse = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(
          errorData.details || errorData.error || "Failed to create order"
        );
      }

      const orderData = await orderResponse.json();

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AI Tutor",
        description: "Premium Subscription",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch("/api/subscriptions/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                transactionId: orderData.transactionId,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            await verifyResponse.json();
            toast.success("Subscription activated successfully!");
            fetchSubscriptionPlans();
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#6366F1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to process subscription");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  const monthlyPlans =
    subscriptionInfo?.plans.filter((plan) => plan.interval === "monthly") || [];
  const yearlyPlans =
    subscriptionInfo?.plans.filter((plan) => plan.interval === "yearly") || [];

  const freeFeatures = [
    "One full course with unlimited modules",
    "Up to 3 modules for additional courses",
    "Basic AI instructor support",
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background dots pattern */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 size-full opacity-40",
          "bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_8%,transparent)_1px,transparent_1px)]",
          "bg-[size:12px_12px]"
        )}
      />
      {/* Subtle radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(35%_60%_at_50%_0%,var(--foreground)/.06,transparent)]"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-16">
        {subscriptionInfo?.subscriptionStatus === "premium" ? (
          /* ── Premium member view (unchanged) ── */
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-6">Premium Membership</h1>
              <p className="text-lg text-muted-foreground">
                Thank you for being a premium member. Enjoy unlimited access to
                all features.
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-xl p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <CheckIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">Active Subscription</h3>
                  <p className="text-muted-foreground">
                    Your premium membership is active and in good standing
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Subscription Status
                  </p>
                  <p className="font-medium flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Active
                  </p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Valid Until
                  </p>
                  <p className="font-medium">
                    {subscriptionInfo.subscriptionExpiresAt
                      ? new Date(
                          subscriptionInfo.subscriptionExpiresAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="border-t border-primary/10 pt-6">
                <h4 className="font-medium mb-4">Premium Benefits</h4>
                <ul className="space-y-3">
                  {[
                    "Unlimited access to all courses",
                    "Priority AI instructor support",
                    "Advanced course generation features",
                    "Exclusive premium content",
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <CheckIcon className="h-5 w-5 mr-2 text-primary mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => router.push("/courses")}
              >
                Browse Courses
              </Button>
              <Button onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          /* ── Pricing bento grid ── */
          <section>
            {/* Heading */}
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
                Unlock Your Learning
              </h1>
              <p className="text-muted-foreground mt-4 text-sm md:text-base">
                Choose the plan that fits your learning journey. Upgrade
                anytime to access unlimited AI-powered courses, modules, and
                priority support.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-8">
              {/* ── Featured: Premium Monthly ── */}
              {monthlyPlans.length > 0 && (
                <div
                  className={cn(
                    "bg-background border-foreground/10 relative w-full overflow-hidden rounded-md border",
                    "supports-[backdrop-filter]:bg-background/10 backdrop-blur",
                    "lg:col-span-5"
                  )}
                >
                  {/* Decorative gradient overlay */}
                  <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
                    <div className="from-foreground/5 to-foreground/2 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
                      <div
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-0 size-full mix-blend-overlay",
                          "bg-[linear-gradient(to_right,var(--foreground)/.1_1px,transparent_1px)]",
                          "bg-[size:24px]"
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4">
                    <Badge variant="secondary">PREMIUM MONTHLY</Badge>
                    <Badge variant="outline" className="hidden lg:flex">
                      <SparklesIcon className="me-1 size-3" /> Most Popular
                    </Badge>
                    <div className="ml-auto">
                      <Button
                        onClick={() => handleSubscribe(monthlyPlans[0].id)}
                        disabled={processingPayment}
                      >
                        {processingPayment ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing…
                          </>
                        ) : (
                          "Subscribe"
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col p-4 lg:flex-row">
                    <div className="pb-4 lg:w-[30%]">
                      <span className="font-mono text-5xl font-semibold tracking-tight">
                        ₹{(monthlyPlans[0].price / 100).toFixed(0)}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        /month
                      </span>
                    </div>
                    <ul className="text-muted-foreground grid gap-4 text-sm lg:w-[70%]">
                      {monthlyPlans[0].features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <FilledCheck />
                          <span className="leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* ── Free Tier ── */}
              <div
                className={cn(
                  "bg-background border-foreground/10 relative overflow-hidden rounded-md border",
                  "supports-[backdrop-filter]:bg-background/10 backdrop-blur",
                  "lg:col-span-3"
                )}
              >
                <div className="flex items-center gap-3 p-4">
                  <Badge variant="secondary">FREE</Badge>
                  <div className="ml-auto">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/dashboard")}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
                <div className="flex items-end gap-2 px-4 py-2">
                  <span className="font-mono text-5xl font-semibold tracking-tight">
                    Free
                  </span>
                </div>
                <ul className="text-muted-foreground grid gap-4 p-4 text-sm">
                  {freeFeatures.map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <FilledCheck />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Premium Yearly ── */}
              {yearlyPlans.length > 0 && (
                <div
                  className={cn(
                    "bg-background border-foreground/10 relative overflow-hidden rounded-md border",
                    "supports-[backdrop-filter]:bg-background/10 backdrop-blur",
                    "lg:col-span-4"
                  )}
                >
                  <div className="flex items-center gap-3 p-4">
                    <Badge variant="secondary">PREMIUM YEARLY</Badge>
                    <Badge variant="outline" className="hidden sm:flex">
                      Save ₹999
                    </Badge>
                    <div className="ml-auto">
                      <Button
                        variant="outline"
                        onClick={() => handleSubscribe(yearlyPlans[0].id)}
                        disabled={processingPayment}
                      >
                        {processingPayment ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing…
                          </>
                        ) : (
                          "Subscribe"
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 px-4 py-2">
                    <span className="font-mono text-5xl font-semibold tracking-tight">
                      ₹{(yearlyPlans[0].price / 100).toFixed(0)}
                    </span>
                    <span className="text-muted-foreground text-sm">/year</span>
                  </div>
                  <ul className="text-muted-foreground grid gap-4 p-4 text-sm">
                    {yearlyPlans[0].features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <FilledCheck />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ── What's Included (info card) ── */}
              <div
                className={cn(
                  "bg-background border-foreground/10 relative overflow-hidden rounded-md border",
                  "supports-[backdrop-filter]:bg-background/10 backdrop-blur",
                  "lg:col-span-4"
                )}
              >
                <div className="flex items-center gap-3 p-4">
                  <Badge variant="secondary">ALL PLANS</Badge>
                </div>
                <div className="flex items-end gap-2 px-4 py-2">
                  <span className="font-mono text-2xl font-semibold tracking-tight">
                    What&apos;s included
                  </span>
                </div>
                <ul className="text-muted-foreground grid gap-4 p-4 text-sm">
                  {[
                    "AI-powered course generation on any topic",
                    "Interactive AI instructor for every course",
                    "Progress tracking & analytics",
                    "Access on all your devices",
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <FilledCheck />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground text-sm">
                All plans include access to our AI instructor and course
                generation features.
                <br />
                Need help choosing? Contact us for assistance.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
