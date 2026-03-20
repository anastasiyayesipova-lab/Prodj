import { Request, Response } from "express";
import * as passesService from "../services/passes.service";

export function getAllPasses(req: Request, res: Response) {
  res.json({ items: passesService.getAllPasses() });
}

export function getPassById(req: Request, res: Response) {
  const pass = passesService.getPassById(String(req.params.id));

  if (!pass) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(pass);
}

export function createPass(req: Request, res: Response) {
  const { userName, reason, validDate, comment, issuer } = req.body;

  if (!userName || !reason || !validDate || !issuer) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const newPass = passesService.createPass(req.body);
  res.status(201).json(newPass);
}

export function updatePass(req: Request, res: Response) {
  const updated = passesService.updatePass(String(req.params.id), req.body);

  if (!updated) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(updated);
}

export function deletePass(req: Request, res: Response) {
  const success = passesService.deletePass(String(req.params.id));

  if (!success) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(204).send();
}