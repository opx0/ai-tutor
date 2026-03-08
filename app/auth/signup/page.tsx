"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import dynamic from "next/dynamic";
import { toast } from "sonner";

const CanvasRevealEffect = dynamic(
  () => import("@/components/ui/sign-in-flow-1").then((m) => m.CanvasRevealEffect),
  { ssr: false }
);

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      toast.success("Account created successfully! Please sign in.");
      router.push("/auth/signin");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create account"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("Google sign up error:", error);
      toast.error("Failed to sign up with Google");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex w-[100%] flex-col min-h-screen bg-black relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-black"
            colors={[
              [255, 255, 255],
              [255, 255, 255],
            ]}
            dotSize={6}
            reverse={false}
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 flex bg-[#1f1f1f57] backdrop-blur-md border border-[#333] rounded-full p-1.5 shadow-lg">
          <Link href="/auth/signin" className="px-6 py-2 rounded-full text-gray-400 hover:text-white text-sm font-medium transition-all">
            Sign In
          </Link>
          <Link href="/auth/signup" className="px-6 py-2 rounded-full bg-white text-black text-sm font-medium transition-all shadow-sm">
            Sign Up
          </Link>
        </div>

        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full mt-[100px] max-w-sm px-4 md:px-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6 text-center"
              >
                <div className="space-y-1">
                  <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">
                    Join AI Tutor
                  </h1>
                  <p className="text-[1.2rem] text-white/70 font-light">
                    Create an account to start your learning journey
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    disabled={isGoogleLoading}
                    className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors disabled:opacity-50"
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="google"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                      >
                        <path
                          fill="currentColor"
                          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                        ></path>
                      </svg>
                    )}
                    <span>Sign up with Google</span>
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="text-white/40 text-sm">or email</span>
                    <div className="h-px bg-white/10 flex-1" />
                  </div>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-3 text-left"
                      autoComplete="off"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormControl>
                              <input
                                type="text"
                                placeholder="Full name"
                                autoComplete="name"
                                className="w-full backdrop-blur-[1px] text-white border border-white/10 bg-white/5 rounded-full py-3 px-6 focus:outline-none focus:border-white/30 transition-colors"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-400 pl-4" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormControl>
                              <input
                                type="email"
                                placeholder="Email address"
                                autoComplete="new-email"
                                className="w-full backdrop-blur-[1px] text-white border border-white/10 bg-white/5 rounded-full py-3 px-6 focus:outline-none focus:border-white/30 transition-colors"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-400 pl-4" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormControl>
                              <input
                                type="password"
                                placeholder="Password"
                                autoComplete="new-password"
                                className="w-full backdrop-blur-[1px] text-white border border-white/10 bg-white/5 rounded-full py-3 px-6 focus:outline-none focus:border-white/30 transition-colors"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-400 pl-4" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormControl>
                              <div className="relative">
                                <input
                                  type="password"
                                  placeholder="Confirm Password"
                                  autoComplete="new-password"
                                  className="w-full backdrop-blur-[1px] text-white border border-white/10 bg-white/5 rounded-full py-3 px-6 pb-3 focus:outline-none focus:border-white/30 transition-colors pr-12"
                                  {...field}
                                />
                                <button
                                  type="submit"
                                  disabled={isLoading}
                                  className="absolute right-1.5 top-1.5 text-black w-9 h-9 flex items-center justify-center rounded-full bg-white hover:bg-white/90 transition-colors group overflow-hidden disabled:opacity-50"
                                >
                                  {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <span className="relative w-full h-full block overflow-hidden">
                                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
                                        →
                                      </span>
                                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">
                                        →
                                      </span>
                                    </span>
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs text-red-400 pl-4" />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </div>

                <p className="text-xs text-white/40 pt-6">
                  Already have an account?{" "}
                  <Link
                    href="/auth/signin"
                    className="text-white hover:underline transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-black">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
