// config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Memuat variabel lingkungan dari file .env
dotenv.config();

// Mengambil URI MongoDB dari variabel lingkungan
const MONGO_URI = process.env.MONGO_URI;
 
// Fungsi untuk menghubungkan ke database MongoDB
const connectDB = async () => {
  try { 
    // Mencoba untuk menghubungkan ke MongoDB menggunakan Mongoose
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true, // Menggunakan parser URL baru
      useUnifiedTopology: true, // Menggunakan topologi yang disarankan  
    });
    // Menampilkan pesan jika koneksi berhasil
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Menangani error jika koneksi gagal
    console.error(`Error: ${error.message}`);
    process.exit(1); // Keluar dari proses jika koneksi gagal
  }
};

export default connectDB;