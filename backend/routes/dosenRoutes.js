// backend/routes/dosenRoutes.js
import express from "express";
import { db } from "../db/connection.js";

const router = express.Router();

// GET all dosen
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM dosen ORDER BY nama ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dosen", err });
  }
});

// GET dosen by id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM dosen WHERE id = ?", [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dosen", err });
  }
});

// CREATE dosen
router.post("/", async (req, res) => {
  try {
    const { user_id = null, nama, NIP = null, email = null, k_keahlian = null } = req.body;
    const [result] = await db.query(
      `INSERT INTO dosen (user_id, nama, NIP, email, k_keahlian) VALUES (?, ?, ?, ?, ?)`,
      [user_id, nama, NIP, email, k_keahlian]
    );
    res.status(201).json({ id: result.insertId, message: "Dosen created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating dosen", err });
  }
});

// UPDATE dosen
router.put("/:id", async (req, res) => {
  try {
    const { user_id = null, nama, NIP = null, email = null, k_keahlian = null } = req.body;
    await db.query(
      `UPDATE dosen SET user_id = ?, nama = ?, NIP = ?, email = ?, k_keahlian = ? WHERE id = ?`,
      [user_id, nama, NIP, email, k_keahlian, req.params.id]
    );
    res.json({ message: "Dosen updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating dosen", err });
  }
});

// DELETE dosen
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM dosen WHERE id = ?", [req.params.id]);
    res.json({ message: "Dosen deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting dosen", err });
  }
});

export default router;
