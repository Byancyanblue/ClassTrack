import { db } from "../db/connection.js";

export const getLog = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM log_perubahan_jadwal");
  res.json(rows);
};

export const createLog = async (req, res) => {
  const { jadwal_id, dosen_id, status_lama, status_baru, keterangan } = req.body;
  await db.query(
    `INSERT INTO log_perubahan_jadwal
    (jadwal_id, dosen_id, status_lama, status_baru, keterangan, tanggal_perubahan)
    VALUES (?, ?, ?, ?, ?, NOW())`,
    [jadwal_id, dosen_id, status_lama, status_baru, keterangan]
  );
  res.json({ message: "Log created" });
};
