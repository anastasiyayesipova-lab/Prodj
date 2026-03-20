import { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err);

  res.status(500).json({
    message: "Server error",
  });
}