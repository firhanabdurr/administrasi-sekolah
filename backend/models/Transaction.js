const mongoose = require('mongoose');

// Skema untuk data Transaksi
const transactionSchema = new mongoose.Schema(
  {
    siswaId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Student', // Membuat referensi ke model Student
    },
    tipe: {
      type: String,
      required: true,
      enum: ['setor', 'tarik', 'spp'], // Nilai yang diperbolehkan
    },
    jumlah: {
      type: Number,
      required: true,
    },
    keterangan: {
      type: String,
      default: '',
    },
    // Timestamp akan dibuat secara otomatis oleh Mongoose
  },
  {
    timestamps: true, // Menambahkan field createdAt dan updatedAt
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;