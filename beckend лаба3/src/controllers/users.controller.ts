import { Request, Response } from "express";
import * as usersService from "../services/users.service";

export async function getAllUsers(req: Request, res: Response) {
  const items = await usersService.getAllUsers();
  res.json({ items });
}

export async function getUserById(req: Request, res: Response) {
  const user = await usersService.getUserById(String(req.params.id));

  if (!user) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(user);
}

export async function createUser(req: Request, res: Response) {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const user = await usersService.createUser(req.body);
  res.status(201).json(user);
}

export async function updateUser(req: Request, res: Response) {
  const updated = await usersService.updateUser(String(req.params.id), req.body);

  if (!updated) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(updated);
}

export async function deleteUser(req: Request, res: Response) {
  const success = await usersService.deleteUser(String(req.params.id));

  if (!success) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(204).send();
}