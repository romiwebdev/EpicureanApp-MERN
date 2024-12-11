import mongoose from "mongoose";

// Mendefinisikan skema untuk pesanan menggunakan Mongoose
const OrderSchema = new mongoose.Schema({
  name: { 
    type: String, // Tipe data untuk nama pemesan
    required: true // Nama pemesan wajib diisi
  },
  address: { 
    type: String, // Tipe data untuk alamat pemesan
    required: true // Alamat pemesan wajib diisi
  },
  items: [ // Array untuk menyimpan item dalam pesanan
    {
      name: { 
        type: String, // Tipe data untuk nama item
        required: true // Nama item wajib diisi
      },
      price: { 
        type: Number, // Tipe data untuk harga item
        required: true // Harga item wajib diisi
      },
      quantity: { 
        type: Number, // Tipe data untuk jumlah item
        default: 1 // Default quantity = 1 jika tidak diisi
      },
    },
  ],
  total: { 
    type: Number, // Tipe data untuk total harga pesanan
    required: true // Total harga wajib diisi
  },
  createdAt: { 
    type: Date, // Tipe data untuk tanggal pembuatan pesanan
    default: Date.now // Default adalah waktu saat ini
  },
});

export default mongoose.model("Order", OrderSchema);
