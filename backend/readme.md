---

# 📘 ClassTrack Backend (Express.js + MySQL)

Backend ini menyediakan API untuk aplikasi **ClassTrack**. Dibangun menggunakan **Express.js** dan **MySQL** dengan struktur folder modular agar mudah dikembangkan.

---

## 🚀 Fitur Utama

* CRUD: User, Dosen, Mata Kuliah, Ruangan, Sesi, Jadwal, Log
* Koneksi database MySQL (Pool)
* Struktur folder rapi: routes, controllers, db
* Siap dihubungkan dengan frontend React Native (Expo)

---

## 📁 Struktur Folder

```
backend/
├── controllers/
├── routes/
├── database/
│   ├── seed.js
│   └── schema.sql
├── db/
    └── connection.js
├── index.js
├── .env.example
└── package.json
```

---

## ⚙ Instalasi

### 1. Install dependencies

```bash
npm install
```

### 2. Buat file `.env`

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=classtrack
```

### 3. Buat database & import schema

```sql
CREATE DATABASE classtrack;
```

Import:

```bash
mysql -u root -p classtrack < db/schema.sql
```

### 4. (Opsional) Jalankan seeder

```bash
node database/seed.js
```

---

## ▶ Menjalankan Server

### Development

```bash
npm run dev
```

### Production

```bash
node index.js
```

---

## 📡 Contoh Request (Postman)

**GET semua dosen**

```
GET /api/dosen
```

**POST tambah jadwal**

```json
POST /api/jadwal
{
  "id_dosen": 1,
  "id_makul": 1,
  "id_ruangan": 2,
  "id_sesi": 3,
  "hari": "Senin"
}
```

---

## 🔗 Integrasi dengan Frontend (Expo)

```ts
const API_URL = "http://192.168.x.x:3000/api";
```

---

## 📝 Catatan

* Pastikan backend berjalan di jaringan yang sama dengan device Expo.
* `schema.sql` wajib dijalankan sebelum CRUD bekerja.

---
