import { Request, Response } from "express";
import * as passesService from "../services/passes.service";

export async function getAllPasses(req: Request, res: Response) {
  const items = await passesService.getAllPasses();
  res.json({ items });
}

export async function getPassById(req: Request, res: Response) {
  const pass = await passesService.getPassById(String(req.params.id));

  if (!pass) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(pass);
}

export async function createPass(req: Request, res: Response) {
  const { userId, reasonId, statusId, validDate, issuer } = req.body;

  if (!userId || !reasonId || !statusId || !validDate || !issuer) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const newPass = await passesService.createPass(req.body);
  res.status(201).json(newPass);
}

export async function updatePass(req: Request, res: Response) {
  const { userId, reasonId, statusId, validDate, issuer } = req.body;

  if (!userId || !reasonId || !statusId || !validDate || !issuer) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const updated = await passesService.updatePass(String(req.params.id), req.body);

  if (!updated) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(updated);
}

export async function deletePass(req: Request, res: Response) {
  const success = await passesService.deletePass(String(req.params.id));

  if (!success) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(204).send();
}

export async function getPassStats(req: Request, res: Response) {
  const stats = await passesService.getPassStats();
  res.json({ data: stats });
}