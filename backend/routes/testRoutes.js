import { Router } from "express";
import { db } from "../db/connection.js";

const router = Router();

router.get("/db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({ success: true, result: rows[0].result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
