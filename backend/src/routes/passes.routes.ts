import express from "express";
import * as passesController from "../controllers/passes.controller";
import { demoAuth } from "../infrastructure/demoAuth";

const router = express.Router();

router.get("/passes/stats", demoAuth, passesController.getPassStats);
router.get("/passes", demoAuth, passesController.getAllPasses);
router.get("/passes/:id", demoAuth, passesController.getPassById);
router.post("/passes", demoAuth, passesController.createPass);
router.put("/passes/:id", demoAuth, passesController.updatePass);
router.delete("/passes/:id", demoAuth, passesController.deletePass);

export default router;