type RateLimitOptions = {
  max: number;
  windowMs: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterMs: number;
};

const buckets = new Map<string, Bucket>();

function getNow() {
  return Date.now();
}

function cleanupExpired(now: number) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function consumeRateLimit(
  key: string,
  { max, windowMs }: RateLimitOptions
): RateLimitResult {
  const now = getNow();
  cleanupExpired(now);

  const safeKey = key || "anonymous";
  const existing = buckets.get(safeKey);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(safeKey, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: Math.max(0, max - 1),
      resetAt,
      retryAfterMs: 0,
    };
  }

  if (existing.count >= max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfterMs: Math.max(0, existing.resetAt - now),
    };
  }

  existing.count += 1;
  buckets.set(safeKey, existing);
  return {
    allowed: true,
    remaining: Math.max(0, max - existing.count),
    resetAt: existing.resetAt,
    retryAfterMs: 0,
  };
}

export function getClientIdentifier(req: Request, fallback = "anonymous") {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  return forwarded || realIp || fallback;
}
