// backend/routes/jadwalRoutes.js
import express from "express";
import { db } from "../db/connection.js";

const router = express.Router();

// GET all jadwal (JOIN agar frontend langsung dapat nama makul/dosen/ruang/sesi)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT j.id, j.hari, j.tahun_ajaran, j.semester,
             j.id_makul, m.nama_mk AS mataKuliah, m.kode_mk,
             j.id_dosen, d.nama AS dosen,
             j.id_ruangan, r.nama_ruangan AS ruang,
             j.id_sesi, s.nama_sesi AS sesi
      FROM jadwal_kuliah j
      JOIN makul m ON j.id_makul = m.id
      JOIN dosen d ON j.id_dosen = d.id
      JOIN ruangan r ON j.id_ruangan = r.id
      JOIN sesi s ON j.id_sesi = s.id
      ORDER BY FIELD(j.hari, 'Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'), s.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching jadwal", err });
  }
});

// GET by id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT j.*, m.nama_mk AS mataKuliah, d.nama AS dosen, r.nama_ruangan AS ruang, s.nama_sesi AS sesi
      FROM jadwal_kuliah j
      JOIN makul m ON j.id_makul = m.id
      JOIN dosen d ON j.id_dosen = d.id
      JOIN ruangan r ON j.id_ruangan = r.id
      JOIN sesi s ON j.id_sesi = s.id
      WHERE j.id = ?
    `, [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching jadwal", err });
  }
});

// CREATE jadwal
router.post("/", async (req, res) => {
  try {
    const { id_makul, id_dosen, id_ruangan, id_sesi, hari, tahun_ajaran = null, semester = null } = req.body;

    // basic validation
    if (!id_makul || !id_dosen || !id_ruangan || !id_sesi || !hari) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await db.query(
      `INSERT INTO jadwal_kuliah (id_makul, id_dosen, id_ruangan, id_sesi, hari, tahun_ajaran, semester)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_makul, id_dosen, id_ruangan, id_sesi, hari, tahun_ajaran, semester]
    );

    res.status(201).json({ id: result.insertId, message: "Jadwal created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating jadwal", err });
  }
});

// UPDATE jadwal
router.put("/:id", async (req, res) => {
  try {
    const { id_makul, id_dosen, id_ruangan, id_sesi, hari, tahun_ajaran = null, semester = null } = req.body;

    await db.query(
      `UPDATE jadwal_kuliah SET id_makul = ?, id_dosen = ?, id_ruangan = ?, id_sesi = ?, hari = ?, tahun_ajaran = ?, semester = ? WHERE id = ?`,
      [id_makul, id_dosen, id_ruangan, id_sesi, hari, tahun_ajaran, semester, req.params.id]
    );

    res.json({ message: "Jadwal updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating jadwal", err });
  }
});

// DELETE jadwal
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM jadwal_kuliah WHERE id = ?", [req.params.id]);
    res.json({ message: "Jadwal deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting jadwal", err });
  }
});

export default router;
