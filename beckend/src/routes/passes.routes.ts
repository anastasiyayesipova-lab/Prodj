import express from "express";
import * as passesController from "../controllers/passes.controller";

const router = express.Router();

router.get("/passes", passesController.getAllPasses);
router.get("/passes/:id", passesController.getPassById);
router.post("/passes", passesController.createPass);
router.put("/passes/:id", passesController.updatePass);
router.delete("/passes/:id", passesController.deletePass);

export default router;