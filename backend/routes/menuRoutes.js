import express from 'express';
import path from 'path';
import Menu from '../models/Menu.js'; // Pastikan untuk menambahkan .js jika menggunakan ES Module

// Membuat router untuk menu
const router = express.Router();

// Route untuk menambahkan menu baru
router.post("/", async (req, res) => {
  try {
    // Mengambil data dari request body
    const { name, description, price, category, image } = req.body;

    // Memastikan URL gambar disediakan
    if (!image) {
      return res.status(400).json({ message: "Image URL is required!" });
    }

    // Membuat instance baru dari model Menu
    const newMenu = new Menu({
      name,
      description,
      price,
      category,
      image, // Menyimpan URL gambar
    });

    // Menyimpan menu baru ke database
    await newMenu.save();
    res.status(201).json(newMenu); // Mengembalikan menu yang baru dibuat
  } catch (error) {
    res.status(500).json({ message: error.message }); // Mengembalikan pesan kesalahan jika terjadi
  }
});

// Route untuk mengambil semua menu
router.get("/", async (req, res) => {
  try {
    // Mengambil semua menu dari database
    const menus = await Menu.find();
    res.status(200).json(menus); // Mengembalikan daftar menu
  } catch (error) {
    res.status(500).json({ message: error.message }); // Mengembalikan pesan kesalahan jika terjadi
  }
});

// Route untuk memperbarui menu berdasarkan ID
router.put("/:id", async (req, res) => {
  try {
    // Mencari dan memperbarui menu berdasarkan ID
    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Mengembalikan menu yang telah diperbarui
    );
    res.status(200).json(updatedMenu); // Mengembalikan menu yang telah diperbarui
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update menu" }); // Mengembalikan pesan kesalahan jika terjadi
  }
});

// Route untuk menghapus menu berdasarkan ID
router.delete("/:id", async (req, res) => {
  try {
    // Menghapus menu berdasarkan ID
    await Menu.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Menu deleted successfully" }); // Mengembalikan pesan sukses
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete menu" }); // Mengembalikan pesan kesalahan jika terjadi
  }
});

export default router;
