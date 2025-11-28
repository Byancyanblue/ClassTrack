import { db } from "../db/connection.js";

export const getJadwal = async (req, res) => {
  const [rows] = await db.query(`
    SELECT j.*, m.nama_mk, d.nama AS nama_dosen, r.nama_ruangan, s.nama_sesi
    FROM jadwal_kuliah j
    LEFT JOIN makul m ON j.matakuliah_id = m.id
    LEFT JOIN dosen d ON j.dosen_id = d.id
    LEFT JOIN ruangan r ON j.ruang_id = r.id
    LEFT JOIN sesi s ON j.sesi_id = s.id
  `);
  res.json(rows);
};

export const createJadwal = async (req, res) => {
  const {
    matakuliah_id, dosen_id, ruang_id, sesi_id,
    hari, kelas, status, keterangan, semester
  } = req.body;

  await db.query(
    `INSERT INTO jadwal 
    (matakuliah_id, dosen_id, ruang_id, sesi_id, hari, kelas, status, keterangan, semester)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [matakuliah_id, dosen_id, ruang_id, sesi_id, hari, kelas, status, keterangan, semester]
  );

  res.json({ message: "Jadwal created" });
};
