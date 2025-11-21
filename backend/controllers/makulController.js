import { db } from "../db/connection.js";

export const getMakul = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM makul");
  res.json(rows);
};

export const createMakul = async (req, res) => {
  const { kode_mk, nama_mk, sks, semester } = req.body;
  await db.query(
    "INSERT INTO makul (kode_mk, nama_mk, sks, semester) VALUES (?, ?, ?, ?)",
    [kode_mk, nama_mk, sks, semester]
  );
  res.json({ message: "Makul created" });
};
