// backend/routes/ruanganRoutes.js
import express from "express";
import { db } from "../db/connection.js";

const router = express.Router();

// GET all ruangan
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ruangan ORDER BY nama_ruangan ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ruangan", err });
  }
});

// GET by id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ruangan WHERE id = ?", [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ruangan", err });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const { nama_ruangan, kapasitas = 0 } = req.body;
    const [result] = await db.query(
      "INSERT INTO ruangan (nama_ruangan, kapasitas) VALUES (?, ?)",
      [nama_ruangan, kapasitas]
    );
    res.status(201).json({ id: result.insertId, message: "Ruangan created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating ruangan", err });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { nama_ruangan, kapasitas = 0 } = req.body;
    await db.query("UPDATE ruangan SET nama_ruangan = ?, kapasitas = ? WHERE id = ?", [
      nama_ruangan, kapasitas, req.params.id,
    ]);
    res.json({ message: "Ruangan updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating ruangan", err });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM ruangan WHERE id = ?", [req.params.id]);
    res.json({ message: "Ruangan deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting ruangan", err });
  }
});

export default router;
