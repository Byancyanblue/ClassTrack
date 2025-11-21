import express from "express";
import { getJadwal, createJadwal } from "../controllers/jadwalController.js";

const router = express.Router();

router.get("/", getJadwal);
router.post("/", createJadwal);

export default router;
