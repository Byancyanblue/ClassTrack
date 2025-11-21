import { db } from "../db/connection.js";

async function seed() {
  try {
    console.log("🌱 Menanam data awal...");

    // USERS
    await db.query(`
      INSERT INTO users (username, password, role) VALUES
      ('admin', '123456', 'admin'),
      ('dosen1', '123456', 'dosen'),
      ('mahasiswa1', '123456', 'mahasiswa')
    `);

    // DOSEN
    await db.query(`
      INSERT INTO dosen (user_id, nama, NIP, email, k_keahlian) VALUES
      (2, 'Irwan Saputra', '19821212', 'irwan@gmail.com', 'Machine Learning')
    `);

    // MAKUL
    await db.query(`
      INSERT INTO makul (kode_mk, nama_mk, sks, semester) VALUES
      ('IF2101', 'Pemrograman Web', 3, 2),
      ('IF2102', 'Basis Data', 3, 2)
    `);

    // RUANGAN
    await db.query(`
      INSERT INTO ruangan (nama_ruangan, kapasitas) VALUES
      ('Lab A', 30),
      ('Lab B', 25)
    `);

    // SESI
    await db.query(`
      INSERT INTO sesi (jam_mulai, jam_selesai, nama_sesi) VALUES
      ('07:00', '08:40', 'Sesi 1'),
      ('08:40', '10:20', 'Sesi 2')
    `);

    console.log("✅ Seeder selesai!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder gagal:", error);
    process.exit(1);
  }
}

seed();
