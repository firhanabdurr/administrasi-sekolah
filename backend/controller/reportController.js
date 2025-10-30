const PDFDocument = require('pdfkit');
const Transaction = require('../models/Transaction');
const Student = require('../models/Student');

/**
 * @desc    Generate a financial report (monthly or by semester)
 * @route   GET /api/reports/financial
 * @access  Private
 */
const generateFinancialReport = async (req, res) => {
  // Mengambil parameter dari query URL
  const { type, month, year, semester } = req.query;

  try {
    let startDate, endDate;
    let periodText;

    // Menentukan rentang tanggal berdasarkan tipe laporan
    if (type === 'monthly') {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
      periodText = `${startDate.toLocaleString('id-ID', { month: 'long' })} ${year}`;
    } else if (type === 'semester') {
      if (semester === '1') { // Semester Ganjil (Juli - Des)
        startDate = new Date(year, 6, 1);
        endDate = new Date(year, 11, 31, 23, 59, 59);
        periodText = `Semester Ganjil (Juli - Des) ${year}`;
      } else { // Semester Genap (Jan - Juni)
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 5, 30, 23, 59, 59);
        periodText = `Semester Genap (Jan - Juni) ${year}`;
      }
    } else {
      return res.status(400).json({ message: 'Tipe laporan tidak valid' });
    }

    // Mengambil data transaksi sesuai rentang tanggal
    const transactions = await Transaction.find({
      createdAt: { $gte: startDate, $lte: endDate },
    }).populate('siswaId', 'nama'); // Mengambil data nama siswa dari referensi

    // Mulai membuat dokumen PDF
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    // Mengatur header response agar browser tahu ini adalah file PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Laporan_Keuangan_${periodText.replace(/ /g, '_')}.pdf`);
    
    // Mengalirkan output PDF ke response
    doc.pipe(res);

    // --- Mulai Menulis Konten PDF ---

    // Header Laporan
    doc.fontSize(16).font('Helvetica-Bold').text('LAPORAN KEUANGAN SEKOLAH', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text(`Periode: ${periodText}`, { align: 'center' });
    doc.moveDown(2);

    // Fungsi untuk menggambar baris tabel
    function drawTableRow(y, c1, c2, c3, c4, c5) {
        doc.fontSize(10).text(c1, 50, y).text(c2, 150, y).text(c3, 250, y).text(c4, 350, y, { width: 90, align: 'right' }).text(c5, 450, y, { width: 90, align: 'right' });
    }

    // Header Tabel
    drawTableRow(doc.y, 'Tanggal', 'Nama Siswa', 'Tipe Transaksi', 'Pemasukan', 'Pengeluaran');
    doc.moveDown();
    const tableHeaderY = doc.y;
    doc.moveTo(50, tableHeaderY).lineTo(550, tableHeaderY).stroke();
    
    let totalIncome = 0;
    let totalOutcome = 0;

    // Isi Tabel (Data Transaksi)
    transactions.forEach(tx => {
        const income = (tx.tipe === 'setor' || tx.tipe === 'spp') ? tx.jumlah : 0;
        const outcome = tx.tipe === 'tarik' ? tx.jumlah : 0;
        totalIncome += income;
        totalOutcome += outcome;

        const y = doc.y + 5;
        drawTableRow(
            y,
            new Date(tx.createdAt).toLocaleDateString('id-ID'),
            tx.siswaId ? tx.siswaId.nama : 'N/A',
            tx.tipe.toUpperCase(),
            `Rp ${income.toLocaleString('id-ID')}`,
            `Rp ${outcome.toLocaleString('id-ID')}`
        );
        doc.y += 20; // Menambah spasi antar baris
    });

    // Garis penutup tabel
    const tableFooterY = doc.y;
    doc.moveTo(50, tableFooterY).lineTo(550, tableFooterY).stroke();
    doc.moveDown();

    // Ringkasan Total
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text(`Total Pemasukan: Rp ${totalIncome.toLocaleString('id-ID')}`, { align: 'right' });
    doc.text(`Total Pengeluaran: Rp ${totalOutcome.toLocaleString('id-ID')}`, { align: 'right' });
    doc.moveDown();
    doc.fontSize(12).text(`SALDO AKHIR: Rp ${(totalIncome - totalOutcome).toLocaleString('id-ID')}`, { align: 'right' });

    // --- Selesai Menulis Konten PDF ---
    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal membuat laporan PDF', error: error.message });
  }
};

// Di sini bisa menambahkan fungsi lain seperti generateSppReport
// const generateSppReport = async (req, res) => { ... };

module.exports = {
  generateFinancialReport,
  // generateSppReport,
};
