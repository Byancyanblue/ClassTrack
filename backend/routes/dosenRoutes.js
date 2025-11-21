import express from "express";
import { getDosen, createDosen } from "../controllers/dosenController.js";

const router = express.Router();

router.get("/", getDosen);
router.post("/", createDosen);

export default router;
