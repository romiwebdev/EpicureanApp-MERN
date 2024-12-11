const Order = require("../models/Order");

// Fungsi untuk membuat pesanan baru
exports.createOrder = async (req, res) => {
  try {
    // Mengambil data dari body permintaan
    const { name, address, items } = req.body;

    // Memastikan setiap item memiliki quantity >= 1
    const validatedItems = items.map((item) => ({
      ...item,
      quantity: item.quantity > 0 ? item.quantity : 1, // Default quantity = 1 jika tidak valid
    }));

    // Menghitung total harga pesanan
    const total = validatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity, // Menghitung total berdasarkan harga dan quantity
      0 // Inisialisasi total dengan 0
    );

    // Membuat objek pesanan baru
    const newOrder = new Order({
      name,
      address,
      items: validatedItems,
      total,
    });

    // Menyimpan pesanan ke database
    const savedOrder = await newOrder.save();
    // Mengirim respons dengan status 201 dan data pesanan yang disimpan
    res.status(201).json(savedOrder);
  } catch (err) {
    // Menangani error jika terjadi kesalahan
    console.error(err);
    res.status(500).json({ message: "Error creating order" }); // Mengirim respons error
  }
};
