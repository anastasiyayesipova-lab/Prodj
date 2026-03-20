import { Request, Response } from "express";
import * as usersService from "../services/users.service";

export function getAllUsers(req: Request, res: Response) {
  res.json({ items: usersService.getAllUsers() });
}

export function getUserById(req: Request, res: Response) {
  const user = usersService.getUserById(String(req.params.id));

  if (!user) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(user);
}

export function createUser(req: Request, res: Response) {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const user = usersService.createUser(req.body);
  res.status(201).json(user);
}

export function updateUser(req: Request, res: Response) {
  const updated = usersService.updateUser(String(req.params.id), req.body);

  if (!updated) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(updated);
}

export function deleteUser(req: Request, res: Response) {
  const success = usersService.deleteUser(String(req.params.id));

  if (!success) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(204).send();
}