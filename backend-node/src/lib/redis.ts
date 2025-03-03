import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export async function initializeRedisClient() {
  if (!client) {
    const redisHost = process.env.REDIS_HOST || "localhost";
    client = createClient({
      url: `redis://${redisHost}:6379`,
    });
    client.on("error", (error) => {
      console.log(error);
    });
    client.on("conenct", () => {
      console.log("Redis connected");
    });
    await client.connect();
  }

  return client;
}
