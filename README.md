
# Project Fullstack (Frontend & Backend)

Project ini adalah aplikasi fullstack yang dibangun menggunakan JavaScript, dengan backend menggunakan Node.js dan MongoDB, serta frontend menggunakan React.js. Aplikasi ini memungkinkan pengguna untuk mengelola menu makanan dan melakukan pemesanan.

---

## **Persyaratan Sistem**

Sebelum memulai, pastikan perangkat Anda telah terpasang beberapa hal berikut:
- **Node.js** (versi 14 ke atas)
- **npm** (biasanya sudah terinstall bersama Node.js)
- **MongoDB** (untuk pengembangan lokal, jika tidak menggunakan MongoDB Atlas)
- **React.js** (untuk frontend)

---

## **Langkah-langkah Instalasi**

Ikuti langkah-langkah berikut untuk memindahkan dan menjalankan project ini di perangkat lain.

### **1. Memindahkan Project ke Perangkat Baru**

1. **Salin Project**: Salin seluruh folder project ke perangkat baru Anda. Pastikan untuk memindahkan folder `frontend`, `backend`, serta file lainnya (seperti `.env` jika ada).

2. **Install Dependensi**:
   - Buka terminal pada perangkat baru dan pastikan berada di dalam folder project.
   
   - Pertama, masuk ke folder `backend` dan install dependensi:
     ```bash
     cd backend
     npm install
     ```

   - Setelah itu, masuk ke folder `frontend` dan install dependensi:
     ```bash
     cd ../frontend
     npm install
     ```

### **2. Mengatur Database**

#### **Jika Menggunakan MongoDB Atlas**:
1. **Buat Cluster di MongoDB Atlas** (jika belum ada):
   - Masuk ke [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) dan buat cluster baru.
   - Buat database baru dan dapatkan string koneksi database.

2. **Atur Koneksi di File `config/db.js`**:
   - Ganti konfigurasi koneksi di `config/db.js` dengan string koneksi MongoDB Atlas yang Anda dapatkan:
     ```javascript
     const mongoose = require("mongoose");

     mongoose.connect("YOUR_MONGODB_ATLAS_CONNECTION_STRING", {
       useNewUrlParser: true,
       useUnifiedTopology: true,
     });

     const db = mongoose.connection;
     db.on("error", console.error.bind(console, "connection error:"));
     db.once("open", function () {
       console.log("Connected to MongoDB Atlas!");
     });
     ```

#### **Jika Menggunakan MongoDB Lokal**:
1. **Pastikan MongoDB Terpasang dan Berjalan**:
   - Jika Anda menggunakan MongoDB lokal, pastikan MongoDB sudah terinstall di perangkat baru Anda.
   - Jalankan MongoDB dengan perintah:
     ```bash
     mongod
     ```
   - Pastikan aplikasi backend dapat terhubung ke MongoDB lokal dengan string koneksi `mongodb://localhost:27017/nama_database` di `config/db.js`.

---

### **3. Menjalankan Aplikasi**

#### **Backend**:
1. Buka terminal di folder `backend`.
2. Jalankan server backend dengan perintah:
   ```bash
   npm start
   ```
   - Server backend akan berjalan pada port `5000` (atau sesuai dengan pengaturan di `server.js`).

#### **Frontend**:
1. Buka terminal di folder `frontend`.
2. Jalankan aplikasi React dengan perintah:
   ```bash
   npm start
   ```
   - Aplikasi frontend akan berjalan pada port `3000` (atau sesuai dengan pengaturan di `package.json`).

---

## **Mengatur URL Backend di Frontend**
- Pastikan URL backend di frontend sesuai dengan alamat server backend Anda.
- Anda dapat mengatur URL backend di file `.env` di folder `frontend`:
  ```
  REACT_APP_BACKEND_URL=http://localhost:5000
  ```
- Pastikan variabel `REACT_APP_BACKEND_URL` diakses di frontend menggunakan `process.env.REACT_APP_BACKEND_URL`.

---

## **Masalah Umum dan Solusinya**

1. **Dependensi Tidak Terpasang**:
   - Jika Anda mendapatkan error terkait dependensi yang hilang, pastikan Anda menjalankan perintah `npm install` di folder `frontend` dan `backend`.

2. **Koneksi MongoDB Gagal**:
   - Periksa string koneksi database di `config/db.js` dan pastikan MongoDB berjalan dengan baik.
   - Jika menggunakan MongoDB Atlas, pastikan IP perangkat Anda sudah ditambahkan di whitelist Atlas.

3. **Port Konflik**:
   - Jika port default `5000` atau `3000` sudah digunakan oleh aplikasi lain, ubah port aplikasi backend atau frontend sesuai kebutuhan.

---

## **Fitur Aplikasi**

- **Dashboard Admin**: Menambahkan, memperbarui, dan menghapus menu makanan.
- **Halaman Menu**: Pengguna dapat melihat daftar menu dan melihat detail menu.
- **Pemesanan**: Pengguna dapat memilih menu dan melakukan pemesanan.
- **Laporan Penjualan**: Admin dapat melihat laporan penjualan.

---

## **Teknologi yang Digunakan**

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas atau lokal)
- **State Management**: React hooks (`useState`, `useEffect`)
- **HTTP Requests**: Axios
- **Authentication**: JSON Web Token (JWT) untuk login admin.

---

## **Lisensi**
Project ini dibuat dengan lisensi MIT.

---

Jika Anda mengalami masalah atau perlu bantuan lebih lanjut, silakan hubungi saya atau buka issue di repository GitHub.
```

Dengan file `README.md` ini, Anda sudah memiliki dokumentasi lengkap yang dapat digunakan oleh orang lain untuk memindahkan dan menjalankan project di perangkat lain.