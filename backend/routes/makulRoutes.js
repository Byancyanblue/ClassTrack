import express from "express";
import { getMakul, createMakul } from "../controllers/makulController.js";

const router = express.Router();

router.get("/", getMakul);
router.post("/", createMakul);

export default router;
