import express from "express";
import { db } from "../../db/connection.js";

const router = express.Router();

// Utility: Convert nama hari → nomor hari (0 = Minggu, 1 = Senin, ...)
const dayIndex = {
  "Senin": 1,
  "Selasa": 2,
  "Rabu": 3,
  "Kamis": 4,
  "Jumat": 5,
  "Sabtu": 6,
  "Minggu": 0
};

// Generate tanggal berdasarkan hari jadwal minggu ini
function getDateOfCurrentWeek(dayName) {
  const today = new Date();
  const currentDay = today.getDay(); // 0-6
  const targetDay = dayIndex[dayName]; // 0-6

  if (targetDay === undefined) return null;

  // Selisih hari
  const diff = targetDay - currentDay;

  const result = new Date(today);
  result.setDate(today.getDate() + diff);

  // Format YYYY-MM-DD
  return result.toISOString().slice(0, 10);
}

router.get("/kalendar", async (req, res) => {
  try {
    // Ambil semua jadwal kuliah + join makul, dosen, ruangan, sesi
    const [rows] = await db.query(`
      SELECT 
        jadwal_kuliah.id,
        jadwal_kuliah.hari,
        jadwal_kuliah.semester,
        makul.nama_mk AS mataKuliah,
        ruangan.nama_ruangan AS ruang,
        sesi.nama_sesi AS sesi
      FROM jadwal_kuliah
      JOIN makul ON jadwal_kuliah.id_makul = makul.id
      JOIN ruangan ON jadwal_kuliah.id_ruangan = ruangan.id
      JOIN sesi ON jadwal_kuliah.id_sesi = sesi.id
      ORDER BY jadwal_kuliah.hari ASC, sesi.nama_sesi ASC
    `);

    const finalData = rows.map(item => {
      return {
        id: item.id,
        tanggal: getDateOfCurrentWeek(item.hari), // buat tanggal otomatis berdasarkan hari
        sesi: item.sesi,
        mataKuliah: item.mataKuliah,
        ruang: item.ruang,
        semester: item.semester % 2 === 1 ? "Ganjil" : "Genap",
      };
    });

    res.json(finalData);

  } catch (error) {
    console.error("❌ Error Kalender:", error);
    res.status(500).json({ message: "Error fetching kalender", error });
  }
});

export default router;
