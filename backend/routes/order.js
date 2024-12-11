import express from 'express';
const router = express.Router();
import Order from '../models/Order.js'; // Pastikan untuk menambahkan .js jika menggunakan ES Module
// Endpoint untuk membuat pesanan baru
router.post("/", async (req, res) => {
  const { name, address, items, total } = req.body;

  // Validasi input
  if (!name || !address || !items || items.length === 0 || !total) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Membuat pesanan baru
    const newOrder = new Order({
      name,
      address,
      items,
      total,
    });

    // Menyimpan pesanan ke database
    const savedOrder = await newOrder.save();

    // Mengirimkan response setelah pesanan berhasil disimpan
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint untuk mengambil semua order
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find(); // Mengambil semua data order dari database
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint untuk menghapus pesanan berdasarkan ID
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Laporan Penjualan
router.get("/sales-report", async (req, res) => {
  try {
    const orders = await Order.find();
    
    // Menghitung total pendapatan dari pesanan
    const totalSales = orders.reduce((acc, order) => {
      return acc + order.total; // Menambahkan total setiap order
    }, 0);
    
    res.status(200).json({ totalSales });
  } catch (err) {
    console.error("Error fetching sales report:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;