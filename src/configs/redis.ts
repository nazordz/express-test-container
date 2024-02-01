import { createClient } from "redis";
import { getEnv } from "./env";

const url = getEnv("REDIS_URL", "redis://localhost:6379");

export const redisClient = createClient({ url });

redisClient.on("error", (err) => console.log("Redis Client Error", err));

async function redisConnection() {
  await redisClient.connect();
}

redisConnection();

export async function getOrSetCache<T>(
  key: string,
  cb: () => Promise<T>,
  expiration = 86400
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await redisClient.get(key);

      // if exist in redis
      if (resp) return resolve(JSON.parse(resp));

      // if doesn't
      const newData = await cb();
      redisClient.setEx(key, expiration, JSON.stringify(newData));
      resolve(newData);
    } catch (error) {
      return reject(error);
    }
  });
}

export async function clearCache(key: string) {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.log(error)
  }
}
