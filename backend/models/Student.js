const mongoose = require('mongoose');

// Skema untuk data Siswa
const studentSchema = new mongoose.Schema(
  {
    nomorInduk: {
      type: String,
      required: [true, 'Nomor Induk wajib diisi'],
      unique: true,
      trim: true,
    },
    nama: {
      type: String,
      required: [true, 'Nama siswa wajib diisi'],
      trim: true,
    },
    kelas: {
      type: String,
      required: [true, 'Kelas wajib diisi'],
      trim: true,
    },
    alamat: {
      type: String,
      default: '',
    },
    saldoTabungan: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    // Menambahkan field createdAt dan updatedAt secara otomatis
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;