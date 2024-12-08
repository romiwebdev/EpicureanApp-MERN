const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/db");
const menuRoutes = require("./routes/menuRoutes"); // Route untuk menu
const authRoutes = require("./routes/authRoutes"); // Route untuk login
const orderRoutes = require("./routes/order"); // Route untuk order
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;

// Menambahkan middleware untuk melayani file statis
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Folder uploads dapat diakses

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Hubungkan ke MongoDB
connectDB();

// Fungsi untuk menambahkan user admin
const seedAdminUser  = async () => {
  try {
    // Cek apakah user admin sudah ada
    const existingAdmin = await User.findOne({ username: "admin" });
    if (!existingAdmin) {
      const adminUser  = new User({
        username: "admin",
        password: "admin123", // Password langsung (belum dienkripsi, ini sederhana)
      });
      await adminUser .save();
      console.log("Admin user created: username=admin, password=admin123");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error.message);
  }
};

// Panggil fungsi untuk menambahkan user admin
seedAdminUser ();

// Route
app.use("/api/menu", menuRoutes); // Menyediakan route untuk menu
app.use("/api/auth", authRoutes); // Route untuk login
app.use("/api/order", orderRoutes); // Menyediakan route untuk order

// Default endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/restaurant", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB:", err));

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});