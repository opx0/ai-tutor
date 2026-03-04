import { createSuccessResponse } from "@/lib/api-utils";
import { logError, logInfo } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

/**
 * Health check endpoint
 * Verifies the Next.js backend and database connection are working properly
 */
export async function GET() {
  const components: Record<string, unknown> = {
    nextjs: {
      status: "healthy",
      version: process.env.NEXT_PUBLIC_VERSION || "15.2.4",
    },
    database: {
      status: "unknown",
    },
  };

  let overallStatus = "healthy";

  // Check database connection
  try {
    const startTime = performance.now();
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Math.round(performance.now() - startTime);

    components.database = {
      status: "healthy",
      responseTime,
    };
  } catch (error) {
    overallStatus = "degraded";
    components.database = {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown database error",
    };
    logError("Health check - Database connection error", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // Check environment variables
  const requiredEnvVars = [
    "DATABASE_URL",
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
  ];
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  components.environment = {
    status: missingEnvVars.length === 0 ? "healthy" : "warning",
    ...(missingEnvVars.length > 0 && { missingVariables: missingEnvVars }),
  };

  if (missingEnvVars.length > 0) {
    overallStatus = "degraded";
  }

  logInfo("Health check completed", { status: overallStatus });

  return createSuccessResponse({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    components,
  });
}
