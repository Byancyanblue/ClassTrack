import express from "express";
import { db } from "../../db/connection.js";
//import bcrypt from "bcrypt";

const router = express.Router();

/* ============================
   GET ALL USERS
===============================*/
router.get("/users", async (req, res) => {
  try {
    const [result] = await db.query(`SELECT id, username, role FROM users`);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", err });
  }
});

/* ============================
   CREATE USER
===============================*/
router.post("/users", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
      [username, hashed, role]
    );

    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", err });
  }
});

/* ============================
   UPDATE USER
===============================*/
router.put("/users/:id", async (req, res) => {
  try {
    const { username, role } = req.body;

    await db.query(
      `UPDATE users SET username=?, role=? WHERE id=?`,
      [username, role, req.params.id]
    );

    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", err });
  }
});

/* ============================
   UPDATE PASSWORD (OPTIONAL)
===============================*/
router.put("/users/password/:id", async (req, res) => {
  try {
    const { password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      `UPDATE users SET password=? WHERE id=?`,
      [hashed, req.params.id]
    );

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating password", err });
  }
});

/* ============================
   DELETE USER
===============================*/
router.delete("/users/:id", async (req, res) => {
  try {
    await db.query(`DELETE FROM users WHERE id=?`, [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", err });
  }
});

export default router;
