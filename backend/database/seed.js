import { db } from "../db/connection.js";

async function seed() {
  try {
    console.log("🧹 TRUNCATE semua tabel...");

    await db.query("SET FOREIGN_KEY_CHECKS = 0;");

    const tables = [
      "users",
      "dosen",
      "mahasiswa",
      "ruangan",
      "sesi",
      "makul",
      "jadwal_kuliah",
      "jadwal_mahasiswa",
      "log_jadwal",
    ];

    for (const table of tables) {
      await db.query(`TRUNCATE TABLE ${table}`);
    }

    await db.query("SET FOREIGN_KEY_CHECKS = 1;");

    // ==========================
    // USERS
    // ==========================
    console.log("🌱 Insert Users...");

    const [insertUsers] = await db.query(`
      INSERT INTO users (username, password, role) VALUES
      ('admin', '123456', 'admin'),       -- id = 1
      ('dosenlogin', '123456', 'dosen'),  -- id = 2
      ('mahasiswa1', '123456', 'mahasiswa'); -- id = 3
    `);

    // ==========================
    // MAHASISWA
    // ==========================
    console.log("🌱 Insert Mahasiswa...");

    await db.query(`
      INSERT INTO mahasiswa (user_id, nama, NIM, email, prodi, semester)
      VALUES (3, 'Mahasiswa Contoh', '2023123001', 'mhs1@gmail.com', 'Informatika', 3)
    `);

    // ==========================
    // DOSEN
    // ==========================
    console.log("🌱 Insert 20 Dosen...");

    const namaDosen = [
      "Budi Santoso", "Agus Firmansyah", "Dewi Lestari", "Rina Kartika", "Joko Prabowo",
      "Siti Rahma", "Hendra Wijaya", "Nadia Putri", "Fajar Ramadhan", "Tono Cahyono",
      "Yuni Rahayu", "Ilham Syahputra", "Rizki Pratama", "Nurul Aisyah", "Dian Sari",
      "Wahyu Adi", "Citra Anggraini", "Bayu Kurniawan", "Lukman Hakim", "Andi Prasetyo"
    ];

    const keahlian = [
      "Sistem Informasi",
      "Jaringan Komputer",
      "Kecerdasan Buatan dan Komputasi",
      "Software Engineer"
    ];

    // Dosen login (id_user = 2)
    await db.query(`
      INSERT INTO dosen (user_id, nama, NIP, email, k_keahlian)
      VALUES (2, 'Dr. Login Utama', '19821021', 'dosenlogin@gmail.com', 'Software Engineer')
    `);

    // 19 dosen lainnya
    for (let i = 0; i < 19; i++) {
      // 1. BUAT USER DULU UNTUK DOSEN INI
      const usernameDosen = `dosen_dummy_${i}`; // Buat username unik
      const [userResult] = await db.query(
        `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
        [usernameDosen, '123456', 'dosen']
      );

      const newUserId = userResult.insertId; // Ambil ID dari user yang baru dibuat

      // 2. BARU MASUKKAN DATA DOSEN MENGGUNAKAN ID USER TERSEBUT
      await db.query(
        `INSERT INTO dosen (user_id, nama, NIP, email, k_keahlian)
         VALUES (?, ?, ?, ?, ?)`,
        [
          newUserId, // <--- Ganti null dengan ID user yang valid
          namaDosen[i],
          "19000" + i,
          `dosen${i}@gmail.com`,
          keahlian[i % 4],
        ]
      );
    }

    // ==========================
    // RUANGAN
    // ==========================
    console.log("🌱 Insert Ruangan...");

    const ruangQueries = [];
    for (let i = 1; i <= 10; i++) {
      ruangQueries.push(`('Lab ${i}', ${20 + (i % 10)})`);
    }

    await db.query(`
      INSERT INTO ruangan (nama_ruangan, kapasitas)
      VALUES ${ruangQueries.join(",")}
    `);

    // ==========================
    // SESI
    // ==========================
    console.log("🌱 Insert Sesi...");

    await db.query(`
      INSERT INTO sesi (nama_sesi, jam_mulai, jam_selesai) VALUES
      ('Sesi 1', '07:30', '09:30'),
      ('Sesi 2', '09:40', '11:50'),
      ('Sesi 3', '12:45', '14:45'),
      ('Sesi 4', '14:55', '16:30')
    `);

    // ==========================
    // MATA KULIAH
    // ==========================
    console.log("🌱 Insert 40 Mata Kuliah...");

    const mkNames = [
      "Pemrograman Web", "Basis Data", "Struktur Data", "Statistika", "Jaringan Komputer",
      "Sistem Operasi", "Kecerdasan Buatan", "Machine Learning", "Deep Learning",
      "Pemrograman Mobile", "Rekayasa Perangkat Lunak", "Analisis Perancangan Sistem",
      "Komputasi Awan", "Keamanan Siber", "Algoritma & Pemrograman",
      "Interaksi Manusia & Komputer", "Metode Numerik", "IoT", "Big Data",
      "Pemrograman Game"
    ];

    const mkQueries = [];
    for (let i = 1; i <= 40; i++) {
      const name = mkNames[i % mkNames.length] + " " + i;
      const kode = `IF${2000 + i}`;
      const semester = (i % 8) + 1;

      mkQueries.push(`('${kode}', '${name}', 3, ${semester})`);
    }

    await db.query(`
      INSERT INTO makul (kode_mk, nama_mk, sks, semester)
      VALUES ${mkQueries.join(",")}
    `);

    // ==========================
    // FETCH DATA DASAR
    // ==========================
    const [dosenRows] = await db.query(`SELECT id FROM dosen`);
    const [makulRows] = await db.query(`SELECT id, semester FROM makul`);
    const [ruangRows] = await db.query(`SELECT id FROM ruangan`);
    const [sesiRows] = await db.query(`SELECT id FROM sesi`);

    // ==========================
    // JADWAL KULIAH
    // ==========================
    console.log("🌱 Insert 20 Jadwal Kuliah...");

    const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
    const jadwalInserted = [];

    let counter = 0;
    for (let h = 0; h < 5; h++) {
      for (let s = 0; s < 4; s++) {
        const mk = makulRows[counter];
        const dos = dosenRows[counter % dosenRows.length];
        const ruang = ruangRows[counter % ruangRows.length];
        const sesi = sesiRows[s];

        const semesterType = mk.semester % 2 === 1 ? "Ganjil" : "Genap";

        const [result] = await db.query(`
          INSERT INTO jadwal_kuliah 
          (id_makul, id_dosen, id_ruangan, id_sesi, hari, tahun_ajaran, semester)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          mk.id,
          dos.id,
          ruang.id,
          sesi.id,
          hari[h],
          "2024/2025",
          semesterType
        ]);

        jadwalInserted.push(result.insertId);
        counter++;
      }
    }

    // ==========================
    // MAPPING JADWAL MAHASISWA
    // ==========================
    console.log("🌱 Insert Mapping Jadwal Mahasiswa...");

    const [[mahasiswa]] = await db.query(`SELECT id FROM mahasiswa LIMIT 1`);
    const idMahasiswa = mahasiswa.id;

    for (const idj of jadwalInserted) {
      await db.query(`
        INSERT INTO jadwal_mahasiswa (id_mahasiswa, id_jadwal)
        VALUES (?, ?)
      `, [idMahasiswa, idj]);
    }

    // ==========================
    // LOG PERUBAHAN
    // ==========================
    console.log("🌱 Insert Log Perubahan...");

    const aksiOps = [
      "Diubah menjadi Online",
      "Dipindahkan ke ruangan lain",
      "Ditunda",
      "Dibatalkan",
      "Sesuai Jadwal"
    ];

    for (let i = 0; i < 10; i++) {
      const randomJadwal = jadwalInserted[i % jadwalInserted.length];
      const aksi = aksiOps[i % aksiOps.length];

      await db.query(`
        INSERT INTO log_jadwal (id_jadwal, aksi)
        VALUES (?, ?)
      `, [randomJadwal, aksi]);
    }

    console.log("🎉 SEED SELESAI!");
    process.exit(0);

  } catch (error) {
    console.error("❌ ERROR SEED:", error);
    process.exit(1);
  }
}

seed();
