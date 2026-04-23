import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

export const redis = hasRedis
  ? new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
  : null;

// 5 orders per hour per IP
export const orderRateLimit = (hasRedis && redis)
  ? new Ratelimit({
    redis: redis as Redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "rl:orders",
  })
  : null;

// 20 general API requests per minute per IP
export const apiRateLimit = (hasRedis && redis)
  ? new Ratelimit({
    redis: redis as Redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    prefix: "rl:api",
  })
  : null;

export async function nextTicketId(): Promise<string> {
  if (redis) {
    const seq = await redis.incr("ticket:seq");
    return `JC-${String(seq).padStart(4, "0")}`;
  }
  // Local bypass: Generate a random JC-XXXX ID
  return `JC-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
}
