// models/User.js
import mongoose from 'mongoose';

// Mendefinisikan skema untuk pengguna menggunakan Mongoose
const userSchema = new mongoose.Schema({
  username: { 
    type: String, // Tipe data untuk nama pengguna
    required: true, // Nama pengguna wajib diisi
    unique: true, // Nama pengguna harus unik (tidak boleh sama)
  },
  password: { 
    type: String, // Tipe data untuk kata sandi
    required: true, // Kata sandi wajib diisi
  },
});

const User = mongoose.model("User ", userSchema);
export default User; // Menggunakan ekspor default 