import { db } from "../db/connection.js";

export const getRuangan = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM ruangan");
  res.json(rows);
};

export const createRuangan = async (req, res) => {
  const { nama_ruangan, kapasitas } = req.body;
  await db.query(
    "INSERT INTO ruangan (nama_ruangan, kapasitas) VALUES (?, ?)",
    [nama_ruangan, kapasitas]
  );
  res.json({ message: "Ruangan created" });
};
