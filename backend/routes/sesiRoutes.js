// backend/routes/sesiRoutes.js
import express from "express";
import { db } from "../db/connection.js";

const router = express.Router();

// GET all sesi
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM sesi ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching sesi", err });
  }
});

// GET by id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM sesi WHERE id = ?", [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching sesi", err });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const { nama_sesi = null, jam_mulai, jam_selesai } = req.body;
    const [result] = await db.query(
      "INSERT INTO sesi (nama_sesi, jam_mulai, jam_selesai) VALUES (?, ?, ?)",
      [nama_sesi, jam_mulai, jam_selesai]
    );
    res.status(201).json({ id: result.insertId, message: "Sesi created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating sesi", err });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { nama_sesi = null, jam_mulai, jam_selesai } = req.body;
    await db.query(
      "UPDATE sesi SET nama_sesi = ?, jam_mulai = ?, jam_selesai = ? WHERE id = ?",
      [nama_sesi, jam_mulai, jam_selesai, req.params.id]
    );
    res.json({ message: "Sesi updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating sesi", err });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM sesi WHERE id = ?", [req.params.id]);
    res.json({ message: "Sesi deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting sesi", err });
  }
});

export default router;
