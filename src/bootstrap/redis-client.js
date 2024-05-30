import { Redis } from "ioredis";
import { promisify } from "util";
import logger from "../logger/index.js";

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

redisClient.on("error", (err) => {
  logger.error("Redis connection error:", err);
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const incrAsync = promisify(redisClient.incr).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

export { redisClient, getAsync, setAsync, incrAsync, delAsync };
