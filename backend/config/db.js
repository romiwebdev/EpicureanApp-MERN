const mongoose = require("mongoose");

// Koneksi langsung ke MongoDB Atlas
const MONGO_URI = "mongodb+srv://romi:312CvDDElNkEhCCS@cluster0.ixde5.mongodb.net/restaurantDB?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit jika koneksi gagal
  }
};

module.exports = connectDB;
