import { NextFunction, Request, Response } from "express";
import { get } from "../db/dbClient";

declare global {
  namespace Express {
    interface Request {
      currentUserId?: number;
    }
  }
}

export async function demoAuth(req: Request, res: Response, next: NextFunction) {
  const rawUserId = req.header("X-Demo-UserId");
  const userId = Number(rawUserId);

  if (!rawUserId || !Number.isInteger(userId) || userId <= 0) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await get("SELECT id FROM users WHERE id = ?", [userId]);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.currentUserId = userId;
  next();
}