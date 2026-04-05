import { createClient } from "redis";

let client: ReturnType<typeof createClient>;

export async function getRedis() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on("error", (err) => console.error("Redis error:", err));
    await client.connect();
  }
  return client;
}

export async function nextTicketId(): Promise<string> {
  const redis = await getRedis();
  const seq = await redis.incr("ticket:seq");
  return `JC-${String(seq).padStart(4, "0")}`;
}
