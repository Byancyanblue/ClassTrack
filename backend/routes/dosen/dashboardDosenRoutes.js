import express from "express";
import { db } from "../../db/connection.js";

const router = express.Router();

// Mapping nama hari Inggris → Indonesia
const dayMap = {
  Monday: "Senin",
  Tuesday: "Selasa",
  Wednesday: "Rabu",
  Thursday: "Kamis",
  Friday: "Jumat",
  Saturday: "Sabtu",
  Sunday: "Minggu",
};

// ================= GET DOSEN BY USERNAME =================
router.get("/by-username/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const [rows] = await db.query(
      `SELECT d.id AS id_dosen, d.nama 
       FROM dosen d
       JOIN users u ON u.id = d.user_id
       WHERE u.username = ?`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Dosen tidak ditemukan" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dosen", error });
  }
});

// ================= JADWAL HARI INI =================
router.get("/:id/jadwal-hari-ini", async (req, res) => {
  try {
    const { id } = req.params;

    // Ambil nama hari hari ini (Senin, Selasa, ...)
    const english = new Date().toLocaleString("en-US", { weekday: "long" });
    const hariIni = dayMap[english];

    const [rows] = await db.query(
      `SELECT 
        jk.id,
        mk.nama_mk AS makul,
        s.jam_mulai,
        s.jam_selesai,
        r.nama_ruangan AS ruangan,
        IFNULL(
          (SELECT aksi 
           FROM log_jadwal lj 
           WHERE lj.id_jadwal = jk.id 
           ORDER BY lj.waktu DESC LIMIT 1), 
          'Sesuai Jadwal'
        ) AS status
      FROM jadwal_kuliah jk
      JOIN makul mk ON mk.id = jk.id_makul
      JOIN sesi s ON s.id = jk.id_sesi
      JOIN ruangan r ON r.id = jk.id_ruangan
      WHERE jk.id_dosen = ? AND jk.hari = ?
      ORDER BY s.jam_mulai ASC`,
      [id, hariIni]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jadwal hari ini", error });
  }
});

// ================= PENGUMUMAN PERUBAHAN JADWAL HARI INI =================
router.get("/:id/pengumuman", async (req, res) => {
  try {
    const { id } = req.params;

    const english = new Date().toLocaleString("en-US", { weekday: "long" });
    const hariIni = dayMap[english];

    const [rows] = await db.query(
      `SELECT 
        lj.id,
        lj.aksi,
        lj.waktu,
        mk.nama_mk AS makul
      FROM log_jadwal lj
      JOIN jadwal_kuliah jk ON jk.id = lj.id_jadwal
      JOIN makul mk ON mk.id = jk.id_makul
      WHERE jk.id_dosen = ? AND jk.hari = ?
      ORDER BY lj.waktu DESC`,
      [id, hariIni]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pengumuman", error });
  }
});

// ================= UPDATE STATUS JADWAL =================
router.post("/jadwal/:id/update-status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: "Status wajib diisi" });

    await db.query(
      `INSERT INTO log_jadwal (id_jadwal, aksi, waktu) VALUES (?, ?, NOW())`,
      [id, status]
    );

    res.json({ message: "Status berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
});

export default router;
