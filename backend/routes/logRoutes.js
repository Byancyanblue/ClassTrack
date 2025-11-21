import express from "express";
import { getLog, createLog } from "../controllers/logController.js";

const router = express.Router();

router.get("/", getLog);
router.post("/", createLog);

export default router;
