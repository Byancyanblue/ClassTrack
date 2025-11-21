import express from "express";
import { getRuangan, createRuangan } from "../controllers/ruanganController.js";

const router = express.Router();

router.get("/", getRuangan);
router.post("/", createRuangan);

export default router;
