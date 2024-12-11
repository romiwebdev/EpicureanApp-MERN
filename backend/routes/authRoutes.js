import express from 'express';
import User from '../models/User.js'; // Pastikan untuk menambahkan .js jika menggunakan ES Module

// Membuat router untuk endpoint login dan verifikasi
const router = express.Router();

// Endpoint login
router.post("/login", async (req, res) => {
  // Mengambil username dan password dari request body
  const { username, password } = req.body;

  try {
    // Mencari user berdasarkan username
    const user = await User.findOne({ username });
    if (!user) {
      // Jika user tidak ditemukan, kembalikan respon 401 dengan pesan kesalahan
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Cek apakah password cocok (perlu diingat bahwa ini tidak aman, sebaiknya gunakan hashing)
    if (user.password !== password) {
      // Jika password tidak cocok, kembalikan respon 401 dengan pesan kesalahan
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Jika login berhasil, kembalikan respon 200 dengan pesan sukses
    res.status(200).json({ message: "Login successful", isAuthenticated: true });
  } catch (error) {
    // Jika terjadi kesalahan, kembalikan respon 500 dengan pesan kesalahan
    res.status(500).json({ message: error.message });
  }
});

// Endpoint verifikasi
router.get("/verify", async (req, res) => {
  // Mengambil status autentikasi dari request body (perlu diingat bahwa ini tidak aman, sebaiknya gunakan token atau cookie)
  const { isAuthenticated } = req.body;
  if (isAuthenticated) {
    // Jika user autentikasi, kembalikan respon 200 dengan pesan sukses
    res.status(200).json({ message: "User  is authenticated" });
  } else {
    // Jika user tidak autentikasi, kembalikan respon 401 dengan pesan kesalahan
    res.status(401).json({ message: "User  is not authenticated" });
  }
});


export default router;
