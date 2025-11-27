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

              case "sesuai jadwal":
                message = `${mk} kembali mengikuti jadwal semula.`;
                break;

              default:
                message = `Perubahan pada ${mk}: ${row.aksi}`;
            }

            return {
              id: row.id,
              aksi: message,
              waktu: row.waktu,
            };
          })
        : [
            {
              id: 0,
              aksi: "Belum ada perubahan jadwal.",
              waktu: null,
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
