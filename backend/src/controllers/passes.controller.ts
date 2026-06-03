import { Request, Response } from "express";
import * as passesService from "../services/passes.service";

function auth(req: Request) {
  return {
    userId: Number(req.currentUserId),
    role: String(req.currentUserRole || "user"),
  };
}

export async function getAllPasses(req: Request, res: Response) {
  const items = await passesService.getAllPasses(auth(req));
  res.json({ items });
}

export async function getPassById(req: Request, res: Response) {
  const pass = await passesService.getPassById(String(req.params.id), auth(req));

  if (!pass) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(pass);
}

export async function createPass(req: Request, res: Response) {
  const { reasonId, statusId, validDate, issuer } = req.body;

  if (!reasonId || !statusId || !validDate || !issuer) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const current = auth(req);
  const requestedUserId = Number(req.body.userId || current.userId);

  if (current.role !== "admin" && requestedUserId !== current.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const newPass = await passesService.createPass({
    ...req.body,
    userId: requestedUserId,
  });

  res.status(201).json(newPass);
}

export async function updatePass(req: Request, res: Response) {
  const { reasonId, statusId, validDate, issuer } = req.body;

  if (!reasonId || !statusId || !validDate || !issuer) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const current = auth(req);
  const requestedUserId = Number(req.body.userId || current.userId);

  if (current.role !== "admin" && requestedUserId !== current.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const updated = await passesService.updatePass(String(req.params.id), current, {
    ...req.body,
    userId: requestedUserId,
  });

  if (!updated) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(updated);
}

export async function deletePass(req: Request, res: Response) {
  const success = await passesService.deletePass(String(req.params.id), auth(req));

  if (!success) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(204).send();
}

export async function getPassStats(req: Request, res: Response) {
  const stats = await passesService.getPassStats(auth(req));
  res.json({ data: stats });
}
