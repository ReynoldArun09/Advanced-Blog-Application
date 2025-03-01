import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export async function initializeRedisClient() {
  if (!client) {
    client = createClient();
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
