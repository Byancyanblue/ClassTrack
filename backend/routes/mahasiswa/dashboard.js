import express from "express";
import { db } from "../../db/connection.js";

const router = express.Router();

// ==========================================
// 1. GET: Jadwal Kuliah Mahasiswa
// URL: /api/mahasiswa/:id_mahasiswa/jadwal
// ==========================================
router.get("/:id_mahasiswa/jadwal", async (req, res) => {
  const { id_mahasiswa } = req.params;
  console.log(`🔹 [JADWAL] Request untuk ID: ${id_mahasiswa}`);

  try {
    // Query disederhanakan: Ambil data mentah, format di JS
    const query = `
      SELECT 
        jk.id,
        m.kode_mk,
        m.nama_mk,
        d.nama AS nama_dosen,
        r.nama_ruangan,
        s.jam_mulai,
        s.jam_selesai,
        jk.hari,
        (SELECT aksi FROM log_jadwal WHERE id_jadwal = jk.id ORDER BY waktu DESC LIMIT 1) as status_terbaru
      FROM jadwal_mahasiswa jm
      JOIN jadwal_kuliah jk ON jm.id_jadwal = jk.id
      JOIN makul m ON jk.id_makul = m.id
      JOIN dosen d ON jk.id_dosen = d.id
      JOIN ruangan r ON jk.id_ruangan = r.id
      JOIN sesi s ON jk.id_sesi = s.id
      WHERE jm.id_mahasiswa = ?
      ORDER BY FIELD(jk.hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'), s.jam_mulai
    `;

    const [rows] = await db.query(query, [id_mahasiswa]);

    // Format Jam di sini (lebih aman daripada SQL)
    const formattedData = rows.map((row) => {
      // Ambil 5 karakter pertama (HH:mm) dari string jam
      const mulai = row.jam_mulai ? row.jam_mulai.toString().substring(0, 5) : "00:00";
      const selesai = row.jam_selesai ? row.jam_selesai.toString().substring(0, 5) : "00:00";

      return {
        id: row.id,
        kode_mk: row.kode_mk,
        nama_mk: row.nama_mk,
        nama_dosen: row.nama_dosen,
        nama_ruangan: row.nama_ruangan,
        jam_kuliah: `${mulai} - ${selesai}`,
        hari: row.hari,
        status_terbaru: row.status_terbaru || "Sesuai Jadwal",
      };
    });

    console.log(`✅ [JADWAL] Berhasil dikirim (${formattedData.length} item)`);
    res.json(formattedData);

  } catch (error) {
    console.error("❌ [ERROR JADWAL]:", error.message);
    res.status(500).json({ message: "Gagal memuat jadwal", detail: error.message });
  }
});

// ==========================================
// 2. GET: Notifikasi / Log
// URL: /api/mahasiswa/:id_mahasiswa/notifikasi
// ==========================================
router.get("/:id_mahasiswa/notifikasi", async (req, res) => {
  const { id_mahasiswa } = req.params;

  try {
    const query = `
      SELECT 
        lg.id,
        lg.aksi,
        lg.waktu,
        m.nama_mk
      FROM log_jadwal lg
      JOIN jadwal_kuliah jk ON lg.id_jadwal = jk.id
      JOIN makul m ON jk.id_makul = m.id
      JOIN jadwal_mahasiswa jm ON jk.id = jm.id_jadwal
      WHERE jm.id_mahasiswa = ?
      ORDER BY lg.waktu DESC
      LIMIT 10
    `;

    const [rows] = await db.query(query, [id_mahasiswa]);

    // Format pesan agar user-friendly
    const notifikasi = rows.map((row) => {
      const date = new Date(row.waktu);
      const formattedTime = date.toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
      
      return {
        id: row.id,
        aksi: row.aksi,
        waktu_formatted: formattedTime,
        nama_mk: row.nama_mk
      };
    });

    res.json(notifikasi);

  } catch (error) {
    console.error("❌ [ERROR NOTIFIKASI]:", error.message);
    res.status(500).json({ message: "Gagal memuat notifikasi", detail: error.message });
  }
});

// ==========================================
// 3. GET: Profil Mahasiswa (UNTUK FIX ERROR 404)
// URL: /api/mahasiswa/:id_mahasiswa/profile
// ==========================================
router.get("/:id_mahasiswa/profile", async (req, res) => {
  const { id_mahasiswa } = req.params;

  try {
    // 👇 UPDATE QUERY: Ambil NIM dan Email juga
    const query = `
      SELECT nama, NIM, email, semester, prodi 
      FROM mahasiswa 
      WHERE id = ?
    `;

    const [rows] = await db.query(query, [id_mahasiswa]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }
  } catch (error) {
    console.error("❌ Error Profil:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/:id_mahasiswa/inbox", async (req, res) => {
  const { id_mahasiswa } = req.params;

  try {
    // Ambil Log Perubahan Jadwal yang relevan dengan mahasiswa ini
    const [logs] = await db.query(`
      SELECT 
        lg.id, 
        lg.aksi, 
        lg.waktu, 
        m.nama_mk,
        jk.hari,
        TIME_FORMAT(s.jam_mulai, '%H:%i') as jam_mulai
      FROM log_jadwal lg
      JOIN jadwal_kuliah jk ON lg.id_jadwal = jk.id
      JOIN makul m ON jk.id_makul = m.id
      JOIN sesi s ON jk.id_sesi = s.id
      JOIN jadwal_mahasiswa jm ON jk.id = jm.id_jadwal
      WHERE jm.id_mahasiswa = ?
      ORDER BY lg.waktu DESC 
      LIMIT 50 -- Menampilkan 50 riwayat terakhir
    `, [id_mahasiswa]);

    // Format Data agar rapi di frontend
    const formattedInbox = logs.map((item) => {
        // Format Waktu Log (Kapan perubahan dilakukan)
        const dateLog = new Date(item.waktu);
        const timeString = dateLog.toLocaleDateString('id-ID', { 
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
        });

        // Format Pesan agar enak dibaca
        let message = item.aksi;
        let iconType = "calendar"; // default icon
        let colorType = "#2ecc71"; // default green

        const aksiLower = item.aksi.toLowerCase();
        
        if (aksiLower.includes("online")) {
            message = "Perkuliahan diubah menjadi Online.";
            iconType = "globe-outline";
            colorType = "#3498db"; // Biru
        } else if (aksiLower.includes("offline") || aksiLower.includes("tatap")) {
            message = "Perkuliahan kembali Tatap Muka.";
            iconType = "people-outline";
            colorType = "#2ecc71"; // Hijau
        } else if (aksiLower.includes("undur") || aksiLower.includes("pindah")) {
            message = "Jadwal mengalami perubahan waktu/ruang.";
            iconType = "time-outline";
            colorType = "#f39c12"; // Oranye
        } else if (aksiLower.includes("batal") || aksiLower.includes("delete")) {
            message = "Perkuliahan dibatalkan/dihapus.";
            iconType = "close-circle-outline";
            colorType = "#e74c3c"; // Merah
        } else if (aksiLower.includes("sesuai")) {
            message = "Jadwal kembali seperti semula.";
            iconType = "checkmark-circle-outline";
            colorType = "#27ae60";
        }

        return {
            id: item.id,
            mata_kuliah: item.nama_mk,
            pesan: message,
            detail_jadwal: `${item.hari}, ${item.jam_mulai}`, // Info tambahan jadwal aslinya
            waktu_log: timeString,
            icon: iconType,
            color: colorType
        };
    });

    res.json(formattedInbox);

  } catch (error) {
    console.error("❌ SQL ERROR (Inbox):", error);
    res.status(500).json({ message: "Error fetching inbox", error: error.message });
  }
});

export default router;