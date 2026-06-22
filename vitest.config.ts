import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: { "@": root.replace(/\/$/, "") },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // Pure-logic tests don't hit the DB, but importing modules whose import
    // graph includes the Prisma client requires a URL for the client to
    // construct. These are never connected to.
    env: {
      DATABASE_URL: "postgresql://test:test@localhost:5432/test",
      RAZORPAY_SECRET_ID: "test_secret",
    },
  },
});
