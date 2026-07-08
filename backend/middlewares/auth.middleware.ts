import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    throw new ApiError(401, "Authorization token missing");
  }

  try {
    const decoded = jwt.verify(token, "secret_key") as { id: string }

    req.userId = decoded.id

    next()
  } catch (error) {
    console.log("invalid token", error)
    next(error)
  }
}
