import type { NextFunction, Request, Response } from "express";
import { createClient } from "redis";

const redisClient = await createClient().on("error", (err) => console.log("Redis client Error", err)).connect();

const LIMIT = 5
const WINDOW = 60

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId || req.ip

    const key = `rate_limit:${userId}`

    const current = await redisClient.incr(key)

    if (current === 1) {
      await redisClient.expire(key, WINDOW)
    }

    if (current > LIMIT) {
      return res.status(429).json({
        message: "Too many requests"
      });
    }

    next()
  } catch (error) {
    next(error)
  }
}
