import type { NextFunction, Request, Response } from "express";
import type { HttpError } from "http-errors";
import { ApiError } from "../utils/ApiError.js";
import { ApiRes } from "../utils/ApiResponse.js";

const globalErrorHandler = (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {

  if (!(err instanceof ApiError)) {
    return res.status(500).json(new ApiRes(
      500,
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
      null
    ))
  }
  return res.status(err.statusCode).json({
    statusCode: err.statusCode,
    message: err.message,
    errorStack: process.env.NODE_ENV === "development" ? err.stack : ""
  })
}

export { globalErrorHandler }
