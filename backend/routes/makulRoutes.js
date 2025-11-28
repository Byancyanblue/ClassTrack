// backend/routes/makulRoutes.js
import express from "express";
import { db } from "../db/connection.js";

const router = express.Router();

// GET all mata kuliah
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM makul ORDER BY nama_mk ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching makul", err });
  }
});

// GET by id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM makul WHERE id = ?", [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching makul", err });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const { kode_mk = null, nama_mk, sks = 3, semester = 1 } = req.body;
    const [result] = await db.query(
      `INSERT INTO makul (kode_mk, nama_mk, sks, semester) VALUES (?, ?, ?, ?)`,
      [kode_mk, nama_mk, sks, semester]
    );
    res.status(201).json({ id: result.insertId, message: "Mata kuliah created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating makul", err });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { kode_mk = null, nama_mk, sks = 3, semester = 1 } = req.body;
    await db.query(
      `UPDATE makul SET kode_mk = ?, nama_mk = ?, sks = ?, semester = ? WHERE id = ?`,
      [kode_mk, nama_mk, sks, semester, req.params.id]
    );
    res.json({ message: "Mata kuliah updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating makul", err });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM makul WHERE id = ?", [req.params.id]);
    res.json({ message: "Mata kuliah deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting makul", err });
  }
});

export default router;
