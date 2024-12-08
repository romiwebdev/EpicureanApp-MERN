const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { name, address, items } = req.body;

    // Pastikan setiap item memiliki quantity >= 1
    const validatedItems = items.map((item) => ({
      ...item,
      quantity: item.quantity > 0 ? item.quantity : 1, // Default quantity = 1 jika tidak valid
    }));

    // Hitung total
    const total = validatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Simpan pesanan ke database
    const newOrder = new Order({
      name,
      address,
      items: validatedItems,
      total,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating order" });
  }
};
