import { db } from "../db/connection.js";

export const getSesi = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM sesi");
  res.json(rows);
};

export const createSesi = async (req, res) => {
  const { jam_mulai, jam_selesai, nama_sesi } = req.body;
  await db.query(
    "INSERT INTO sesi (jam_mulai, jam_selesai, nama_sesi) VALUES (?, ?, ?)",
    [jam_mulai, jam_selesai, nama_sesi]
  );
  res.json({ message: "Sesi created" });
};
