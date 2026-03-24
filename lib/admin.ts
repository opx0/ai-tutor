import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

/**
 * Get the current session and verify the user has ADMIN role.
 * For use in Server Components — redirects to / if not admin.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return session;
}

/**
 * Get the current session and verify the user has ADMIN role.
 * For use in API Routes — returns null if not admin (caller should return 403).
 */
export async function requireAdminApi() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}

/**
 * Check if a user ID has ADMIN role (DB lookup).
 * Use sparingly — prefer session.user.role for most checks.
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === "ADMIN";
}
