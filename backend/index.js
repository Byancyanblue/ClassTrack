import express from "express";
import cors from "cors";
import { db } from "./db/connection.js";

import userRoutes from "./routes/userRoutes.js";
import dosenRoutes from "./routes/dosenRoutes.js";
import makulRoutes from "./routes/makulRoutes.js";
import ruanganRoutes from "./routes/ruanganRoutes.js";
import sesiRoutes from "./routes/sesiRoutes.js";
import jadwalRoutes from "./routes/jadwalRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import dashboardAdminRoutes from "./routes/admin/dashboardAdminRoutes.js";
import kalendarAdminRoutes from "./routes/admin/kalendarAdminRoutes.js";
import logAdminRoutes from "./routes/admin/log.js";
import userAdminRoutes from "./routes/admin/users.js";
import dashboardDosenRoutes from "./routes/dosen/dashboardDosenRoutes.js";
import jadwalAkademikRoutes from "./routes/dosen/jadwalAkademikRoutes.js";
import jadwalDosenRoutes from "./routes/dosen/jadwalDosenRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboard from "./routes/mahasiswa/dashboard.js"; 

const app = express();
app.use(cors());
app.use(express.json());

// 🔍 Check database connection on startup
db.getConnection()
  .then(() => console.log("✅ Connected to MySQL Database"))
  .catch((err) => console.log("❌ DB Connection Failed:", err));

// Test route
app.use("/api/test", testRoutes);

// ROUTES DOSEN
app.use("/api/dosen/jadwalAkademik", jadwalAkademikRoutes);
app.use("/api/dosen/jadwal-personal", jadwalDosenRoutes);

// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/dosen", dosenRoutes);
app.use("/api/makul", makulRoutes);
app.use("/api/ruangan", ruanganRoutes);
app.use("/api/sesi", sesiRoutes);
app.use("/api/jadwal", jadwalRoutes);
app.use("/api/log", logRoutes);

// LOGIN
app.use("/api", authRoutes);

app.use("/api/mahasiswa", dashboard); 

// ROUTES ADMIN
app.use("/api/admin/dashboard-admin", dashboardAdminRoutes);
app.use("/api/admin/kalendar-admin", kalendarAdminRoutes);
app.use("/api/admin/menu", logAdminRoutes);
app.use("/api/admin/menu", userAdminRoutes);

// ROUTES DOSEN
app.use("/api/dosen", dashboardDosenRoutes);

// GLOBAL ERROR HANDLER (opsional tapi sangat direkomendasikan)
app.use((err, req, res, next) => {
  console.log("🔥 ERROR:", err);
  res.status(500).json({ error: "Internal Server Error", detail: err.message });
});

// ⚠️ PERHATIKAN PORT INI (3030)
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));