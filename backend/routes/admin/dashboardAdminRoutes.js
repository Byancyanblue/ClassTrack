import express from "express";
import { db } from "../../db/connection.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    // Hitung statistik
    const [[ruang]] = await db.query("SELECT COUNT(*) AS total FROM ruangan");
    const [[jadwal]] = await db.query("SELECT COUNT(*) AS total FROM jadwal_kuliah");
    const [[dosen]] = await db.query("SELECT COUNT(*) AS total FROM dosen");
    const [[makul]] = await db.query("SELECT COUNT(*) AS total FROM makul");

    // Ambil log jadwal
    const [logs] = await db.query(`
      SELECT id, id_jadwal, aksi, waktu
      FROM log_jadwal
      ORDER BY waktu DESC
      LIMIT 10
    `);

    // Format supaya manusiawi
    const formatMessage = (row) => {
      let text = "";

      switch (row.aksi.toLowerCase()) {
        case "update":
          text = `Jadwal #${row.id_jadwal} telah diperbarui.`;
          break;
        case "delete":
          text = `Jadwal #${row.id_jadwal} telah dihapus.`;
          break;
        case "online":
          text = `Jadwal #${row.id_jadwal} diubah menjadi Online.`;
          break;
        case "offline":
          text = `Jadwal #${row.id_jadwal} diubah menjadi Tatap Muka.`;
          break;
        default:
          text = `Perubahan pada jadwal #${row.id_jadwal}: ${row.aksi}`;
      }

      return {
        id: row.id,
        message: text,
        time: row.waktu,
      };
    };

    const notifikasi =
      logs.length > 0
        ? logs.map((item) => formatMessage(item))
        : [
            {
              id: 0,
              message: "Belum ada perubahan jadwal.",
              time: null,
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
    console.error(error);
    res.status(500).json({ message: "Error fetching stats", error });
  }
});

export default router;
