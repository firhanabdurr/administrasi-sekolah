// Mengimpor pustaka yang diperlukan
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

// Memuat variabel lingkungan dari file .env
dotenv.config();

// Menghubungkan ke database MongoDB
connectDB();

// Inisialisasi aplikasi Express
const app = express();

// Middleware
// Mengaktifkan CORS (Cross-Origin Resource Sharing) agar frontend bisa mengakses API ini
app.use(cors());
// Mengaktifkan body-parser untuk membaca request body dalam format JSON
app.use(express.json());

// Rute API Utama
app.get('/', (req, res) => {
  res.send('API Administrasi Sekolah Berjalan...');
});

// Menggunakan file rute yang terpisah
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/reports', require('./routes/reports'));


// Menentukan port server
const PORT = process.env.PORT || 5000;

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});