import express from "express";
import * as usersController from "../controllers/users.controller";

const router = express.Router();

router.get("/users", usersController.getAllUsers);
router.get("/users/:id", usersController.getUserById);
router.post("/users", usersController.createUser);
router.put("/users/:id", usersController.updateUser);
router.delete("/users/:id", usersController.deleteUser);

export default router;