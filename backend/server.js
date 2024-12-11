import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db.js'; // Pastikan untuk menambahkan .js jika menggunakan ES Module
import menuRoutes from './routes/menuRoutes.js'; // Pastikan untuk menambahkan .js
import authRoutes from './routes/authRoutes.js'; // Pastikan untuk menambahkan .js
import orderRoutes from './routes/order.js'; // Pastikan untuk menambahkan .js
import User from './models/User.js'; // Pastikan untuk menambahkan .js

dotenv.config(); // Memuat variabel lingkungan

const app = express(); 
const PORT = process.env.PORT || 5000;

// Middleware

// Middleware
const corsOptions = {
  origin: 'https://epicureanculinary.vercel.app', // Ganti dengan URL frontend Anda
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metode yang diperbolehkan
  allowedHeaders: ['Content-Type', 'Authorization'], // Header yang diizinkan
  credentials: true // Jika Anda menggunakan cookies atau autentikasi
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Hubungkan ke MongoDB
connectDB();

// Fungsi untuk menambahkan user admin
const seedAdminUser  = async () => {
  try {
    const existingAdmin = await User.findOne({ username: process.env.ADMIN_USERNAME });
    if (!existingAdmin) {
      const adminUser  = new User({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD, 
      });
      await adminUser .save();
      console.log(`Admin user created: username=${process.env.ADMIN_USERNAME}, password=${process.env.ADMIN_PASSWORD}`);
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error.message);
  }
};

// Panggil fungsi untuk menambahkan user admin
seedAdminUser ();

// Route
app.use("/api/menu", menuRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/order", orderRoutes);

// Default endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});