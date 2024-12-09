const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Login endpoint
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cari user berdasarkan username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Cek apakah password cocok
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Jika login berhasil
    res.status(200).json({ message: "Login successful", isAuthenticated: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/verify", async (req, res) => {
  const { isAuthenticated } = req.body;
  if (isAuthenticated) {
    res.status(200).json({ message: "User is authenticated" });
  } else {
    res.status(401).json({ message: "User is not authenticated" });
  }
});


module.exports = router;
