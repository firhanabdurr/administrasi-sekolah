const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Mencoba menghubungkan ke MongoDB menggunakan URI dari variabel lingkungan
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`Berhasil terhubung ke MongoDB: ${conn.connection.host}`);
  } catch (error) {
    // Jika koneksi gagal, tampilkan pesan error dan hentikan proses
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
