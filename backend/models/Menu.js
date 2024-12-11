import mongoose from 'mongoose';

// Mendefinisikan skema untuk menu menggunakan Mongoose
const menuSchema = new mongoose.Schema({
  name: {
    type: String, // Tipe data untuk nama menu
    required: true, // Nama menu wajib diisi
  },
  description: {
    type: String, // Tipe data untuk deskripsi menu
    required: true, // Deskripsi menu wajib diisi
  },
  price: {
    type: Number, // Tipe data untuk harga menu
    required: true, // Harga menu wajib diisi
  },
  category: {
    type: String, // Tipe data untuk kategori menu
    required: true, // Kategori menu wajib diisi
  },
  image: {
    type: String, // Menyimpan URL gambar menu
    required: true, // Gambar wajib diisi
  },
});

export default mongoose.model("Menu", menuSchema);
