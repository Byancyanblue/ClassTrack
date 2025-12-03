import express from 'express';
import { db } from "../../db/connection.js"; 

const router = express.Router();

// GET Jadwal Spesifik berdasarkan Username yang login
// URL nanti: /api/dosen/jadwal-personal/:username
router.get('/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const query = `
            SELECT 
                jk.id,
                m.nama_mk AS makul,
                m.kode_mk,
                m.sks,
                r.nama_ruangan AS ruangan,
                s.nama_sesi AS sesi,
                s.jam_mulai,
                s.jam_selesai,
                jk.hari,
                jk.tahun_ajaran,
                jk.semester,
                d.nama AS nama_dosen -- Sekedar validasi
            FROM jadwal_kuliah jk
            JOIN makul m ON jk.id_makul = m.id
            JOIN ruangan r ON jk.id_ruangan = r.id
            JOIN sesi s ON jk.id_sesi = s.id
            JOIN dosen d ON jk.id_dosen = d.id
            JOIN users u ON d.user_id = u.id
            WHERE u.username = ?
            ORDER BY 
                CASE 
                    WHEN jk.hari = 'Senin' THEN 1
                    WHEN jk.hari = 'Selasa' THEN 2
                    WHEN jk.hari = 'Rabu' THEN 3
                    WHEN jk.hari = 'Kamis' THEN 4
                    WHEN jk.hari = 'Jumat' THEN 5
                    WHEN jk.hari = 'Sabtu' THEN 6
                    ELSE 7 
                END, 
                s.jam_mulai ASC
        `;

        const [rows] = await db.query(query, [username]);

        res.status(200).json({
            success: true,
            data: rows,
        });

    } catch (error) {
        console.error('Error fetching jadwal personal:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data jadwal personal',
            error: error.message
        });
    }
});

export default router;