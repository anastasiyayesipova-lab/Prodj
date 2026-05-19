import { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const msg = String((err as any)?.message || err);

  if (msg.includes("UNIQUE constraint failed")) {
    res.status(409).json({
      message: "Unique constraint violation",
    });
    return;
  }

  if (
    msg.includes("NOT NULL constraint failed") ||
    msg.includes("CHECK constraint failed")
  ) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }

  if (msg.includes("FOREIGN KEY constraint failed")) {
    res.status(400).json({
      message: "Invalid reference",
    });
    return;
  }

  console.error(err);

  res.status(500).json({
    message: "Server error",
  });
}