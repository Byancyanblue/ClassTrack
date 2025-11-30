import express from "express";
import { db } from "../../db/connection.js";

const router = express.Router();

/* ============================
   GET ALL LOGS
===============================*/
router.get("/log", async (req, res) => {
  try {
    const [result] = await db.query(
      `SELECT 
        log_jadwal.id,
        log_jadwal.id_jadwal,
        log_jadwal.aksi,
        log_jadwal.waktu
       FROM log_jadwal
       ORDER BY waktu DESC`
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching logs", err });
  }
});

/* ============================
   CREATE LOG
===============================*/
router.post("/log", async (req, res) => {
  try {
    const { id_jadwal, aksi } = req.body;

    await db.query(
      `INSERT INTO log_jadwal (id_jadwal, aksi) VALUES (?, ?)`,
      [id_jadwal, aksi]
    );

    res.json({ message: "Log created" });
  } catch (err) {
    res.status(500).json({ message: "Error creating log", err });
  }
});

/* ============================
   UPDATE LOG
===============================*/
router.put("/log/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { aksi } = req.body;

    await db.query(`UPDATE log_jadwal SET aksi=? WHERE id=?`, [
      aksi,
      id,
    ]);

    res.json({ message: "Log updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating log", err });
  }
});

/* ============================
   DELETE LOG
===============================*/
router.delete("/log/:id", async (req, res) => {
  try {
    await db.query(`DELETE FROM log_jadwal WHERE id=?`, [req.params.id]);
    res.json({ message: "Log deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting log", err });
  }
});

export default router;
