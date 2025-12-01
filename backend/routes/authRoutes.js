import express from "express";
import { db } from "../db/connection.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Username atau password salah" });
    }

    const user = rows[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error server", error });
  }
});

export default router;
