import express from "express";
import { getSesi, createSesi } from "../controllers/sesiController.js";

const router = express.Router();

router.get("/", getSesi);
router.post("/", createSesi);

export default router;
