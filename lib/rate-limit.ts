import { Redis } from "@upstash/redis";

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

// ---------------------------------------------------------------------------
// Durable backend (Upstash Redis) — cross-instance, used when configured.
// Falls back to the per-instance in-memory limiter below when env is unset or
// Redis is unreachable, so the limiter degrades gracefully but never crashes.
// ---------------------------------------------------------------------------

let redis: Redis | null = null;
let redisResolved = false;

function getRedis(): Redis | null {
  if (redisResolved) return redis;
  redisResolved = true;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    redis = new Redis({ url, token });
  }
  return redis;
}

async function consumeRedis(
  client: Redis,
  key: string,
  { max, windowMs }: RateLimitOptions,
): Promise<RateLimitResult> {
  // Fixed-window counter: INCR, set the expiry on first hit, read remaining TTL.
  const redisKey = `rl:${key}`;
  const count = await client.incr(redisKey);
  if (count === 1) {
    await client.pexpire(redisKey, windowMs);
  }
  let ttl = await client.pttl(redisKey);
  if (ttl < 0) {
    // Key exists without a TTL (shouldn't happen) — re-arm it.
    await client.pexpire(redisKey, windowMs);
    ttl = windowMs;
  }
  const resetAt = Date.now() + ttl;

  if (count > max) {
    return { allowed: false, remaining: 0, resetAt, retryAfterMs: ttl };
  }
  return { allowed: true, remaining: Math.max(0, max - count), resetAt, retryAfterMs: 0 };
}

// ---------------------------------------------------------------------------
// In-memory backend (per-instance fallback)
// ---------------------------------------------------------------------------

const buckets = new Map<string, Bucket>();

function cleanupExpired(now: number) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

function consumeMemory(key: string, { max, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  cleanupExpired(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: Math.max(0, max - 1), resetAt, retryAfterMs: 0 };
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
  buckets.set(key, existing);
  return {
    allowed: true,
    remaining: Math.max(0, max - existing.count),
    resetAt: existing.resetAt,
    retryAfterMs: 0,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function consumeRateLimit(
  key: string,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const safeKey = key || "anonymous";
  const client = getRedis();
  if (client) {
    try {
      return await consumeRedis(client, safeKey, options);
    } catch {
      // Redis hiccup — fall back to the in-memory limiter rather than failing open.
    }
  }
  return consumeMemory(safeKey, options);
}

export function getClientIdentifier(req: Request, fallback = "anonymous") {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  return forwarded || realIp || fallback;
}
