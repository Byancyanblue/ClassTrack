import express from "express";
import { db } from "../../db/connection.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const [[ruang]] = await db.query("SELECT COUNT(*) AS total FROM ruangan");
    const [[jadwal]] = await db.query("SELECT COUNT(*) AS total FROM jadwal_kuliah");
    const [[dosen]] = await db.query("SELECT COUNT(*) AS total FROM dosen");
    const [[makul]] = await db.query("SELECT COUNT(*) AS total FROM makul");

    const [logs] = await db.query(`
      SELECT 
        log_jadwal.id,
        log_jadwal.id_jadwal,
        log_jadwal.aksi,
        log_jadwal.waktu,
        makul.nama_mk
      FROM log_jadwal
      JOIN jadwal_kuliah ON log_jadwal.id_jadwal = jadwal_kuliah.id
      JOIN makul ON jadwal_kuliah.id_makul = makul.id
      ORDER BY log_jadwal.waktu DESC
      LIMIT 10
    `);

    const getBadgeColor = (aksi = "") => {
      const lower = aksi.toLowerCase();

      if (lower.includes("online")) return "#2563eb";      // biru
      if (lower.includes("offline")) return "#ea580c";     // oranye
      if (lower.includes("diundur")) return "#7c3aed";     // ungu
      if (lower.includes("batal") || lower.includes("delete")) return "#dc2626";  // merah
      if (lower.includes("sesuai")) return "#16a34a";      // hijau

      return "#475569"; // default abu-abu
    };

    const notifikasi =
  logs.length > 0
    ? logs.map((row) => {
        let message = "";
        const mk = row.nama_mk;

        switch (row.aksi.toLowerCase()) {
          case "update":
            message = `${mk} (Jadwal #${row.id_jadwal}) telah diperbarui.`;
            break;

          case "delete":
            message = `${mk} (Jadwal #${row.id_jadwal}) telah dihapus.`;
            break;

          case "online":
            message = `${mk} diubah menjadi mode Online.`;
            break;

          case "offline":
            message = `${mk} diubah menjadi Tatap Muka.`;
            break;

          case "diundur":
            message = `${mk} mengalami perubahan jadwal (diundur).`;
            break;

          case "sesuai":
            message = `${mk} kembali mengikuti jadwal semula.`;
            break;

          default:
            message = `Perubahan pada ${mk}: ${row.aksi}`;
        }

        return {
          id: row.id,
          aksi: message,
          rawAksi: row.aksi,        // untuk menentukan warna
          waktu: row.waktu,
          badgeColor: getBadgeColor(row.aksi), // ←⚡ warna badge dari backend
        };
      })
    : [
        {
          id: 0,
          aksi: "Belum ada perubahan jadwal.",
          waktu: null,
          badgeColor: "#475569",
        },
      ];

    res.json({
      ruangTerpakai: ruang.total,
      jadwalAktif: jadwal.total,
      dosenAktif: dosen.total,
      mataKuliah: makul.total,
      notifikasi,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
});


export default router;
