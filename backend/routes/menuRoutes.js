const express = require("express");
const path = require("path");
const Menu = require("../models/Menu");

const router = express.Router();

// Route untuk menambahkan menu baru
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image URL is required!" });
    }

    const newMenu = new Menu({
      name,
      description,
      price,
      category,
      image, // Menyimpan URL gambar
    });

    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route untuk mengambil semua menu
router.get("/", async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update menu
router.put("/:id", async (req, res) => {
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedMenu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update menu" });
  }
});

// Delete menu
router.delete("/:id", async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete menu" });
  }
});


module.exports = router;