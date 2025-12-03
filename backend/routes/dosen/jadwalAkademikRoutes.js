import express from 'express';
import { db } from "../../db/connection.js"; // Pastikan path ../ nya benar sesuai struktur foldermu

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // PERBAIKAN: Gunakan LEFT JOIN agar data tetap muncul meski ada ID yang tidak berelasi
        // Tambahkan IFNULL untuk menangani data kosong
        const query = `
            SELECT 
                jk.id,
                IFNULL(m.nama_mk, 'Makul Dihapus') AS makul,
                m.kode_mk,
                m.sks,
                IFNULL(d.nama, 'Dosen Tidak Ada') AS dosen,
                IFNULL(r.nama_ruangan, '-') AS ruangan,
                IFNULL(s.nama_sesi, '-') AS sesi,
                s.jam_mulai,
                s.jam_selesai,
                jk.hari,
                jk.tahun_ajaran,
                jk.semester
            FROM jadwal_kuliah jk
            LEFT JOIN makul m ON jk.id_makul = m.id
            LEFT JOIN dosen d ON jk.id_dosen = d.id
            LEFT JOIN ruangan r ON jk.id_ruangan = r.id
            LEFT JOIN sesi s ON jk.id_sesi = s.id
            ORDER BY jk.hari DESC, s.jam_mulai ASC
        `;

        const [rows] = await db.query(query);

        // DEBUG: Cek di terminal apakah rows ada isinya
        console.log("Data Jadwal Akademik:", rows.length, "baris"); 

        res.status(200).json({
            success: true,
            data: rows,
        });

    } catch (error) {
        console.error('Error fetching jadwal:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data jadwal akademik',
            error: error.message
        });
    }
});

export default router;