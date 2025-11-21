import { db } from "../db/connection.js";

export const getUsers = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM users");
  res.json(rows);
};

export const createUser = async (req, res) => {
  const { username, password, role } = req.body;
  const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
  await db.query(sql, [username, password, role]);
  res.json({ message: "User created" });
};
