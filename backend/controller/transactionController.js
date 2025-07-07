const Transaction = require('../models/Transaction');
const Student = require('../models/Student');

/**
 * @desc    Create a new transaction (setor, tarik, spp)
 * @route   POST /api/transactions
 * @access  Private
 */
const createTransaction = async (req, res) => {
  const { siswaId, tipe, jumlah, keterangan } = req.body;

  try {
    const student = await Student.findById(siswaId);

    if (!student) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }

    // Logika untuk memperbarui saldo tabungan siswa
    if (tipe === 'setor') {
      student.saldoTabungan += Number(jumlah);
    } else if (tipe === 'tarik') {
      // Periksa apakah saldo mencukupi
      if (student.saldoTabungan < jumlah) {
        return res.status(400).json({ message: 'Saldo tabungan tidak mencukupi' });
      }
      student.saldoTabungan -= Number(jumlah);
    }
    // Untuk tipe 'spp', saldo tabungan tidak terpengaruh.
    // Ini hanya catatan pembayaran.

    // Buat catatan transaksi baru
    const transaction = await Transaction.create({
      siswaId,
      tipe,
      jumlah,
      keterangan,
    });

    // Simpan perubahan saldo pada data siswa
    await student.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

/**
 * @desc    Get all transactions for a specific student
 * @route   GET /api/transactions/student/:id
 * @access  Private
 */
const getStudentTransactions = async (req, res) => {
  try {
    // Cari semua transaksi berdasarkan ID siswa, urutkan dari yang terbaru
    const transactions = await Transaction.find({ siswaId: req.params.id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

/**
 * @desc    Get SPP payment status for a student for a given year
 * @route   GET /api/transactions/spp-status/:id/:year
 * @access  Private
 */
const getSppStatus = async (req, res) => {
    const { id: siswaId, year } = req.params;
    
    try {
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

        // Cari semua transaksi SPP untuk siswa dan tahun yang ditentukan
        const sppPayments = await Transaction.find({
            siswaId,
            tipe: 'spp',
            createdAt: { $gte: startDate, $lte: endDate }
        });

        // Buat array yang berisi bulan apa saja yang sudah lunas (0 = Januari, 11 = Desember)
        const paidMonths = sppPayments.map(p => new Date(p.createdAt).getMonth());

        res.json({ year, paidMonths });

    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

module.exports = {
  createTransaction,
  getStudentTransactions,
  getSppStatus,
};
