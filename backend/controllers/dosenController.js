import { db } from "../db/connection.js";

export const getDosen = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM dosen");
  res.json(rows);
};

export const createDosen = async (req, res) => {
  const { user_id, nama, NIP, email, k_keahlian } = req.body;
  await db.query(
    "INSERT INTO dosen (user_id, nama, NIP, email, k_keahlian) VALUES (?, ?, ?, ?, ?)",
    [user_id, nama, NIP, email, k_keahlian]
  );
  res.json({ message: "Dosen created" });
};
