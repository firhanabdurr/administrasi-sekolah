const Student = require('../models/Student');

/**
 * @desc    Create a new student
 * @route   POST /api/students
 * @access  Private
 */
const createStudent = async (req, res) => {
  const { nomorInduk, nama, kelas, alamat } = req.body;

  try {
    const studentExists = await Student.findOne({ nomorInduk });

    if (studentExists) {
      return res.status(400).json({ message: 'Nomor Induk sudah terdaftar' });
    }

    const student = await Student.create({
      nomorInduk,
      nama,
      kelas,
      alamat,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

/**
 * @desc    Get all students
 * @route   GET /api/students
 * @access  Private
 */
const getStudents = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { nama: { $regex: req.query.search, $options: 'i' } },
            { nomorInduk: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};

    const students = await Student.find({ ...keyword }).sort({ nama: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

/**
 * @desc    Get a single student by ID
 * @route   GET /api/students/:id
 * @access  Private
 */
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

/**
 * @desc    Update a student
 * @route   PUT /api/students/:id
 * @access  Private
 */
const updateStudent = async (req, res) => {
  const { nama, kelas, alamat } = req.body;

  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      student.nama = nama || student.nama;
      student.kelas = kelas || student.kelas;
      student.alamat = alamat || student.alamat;

      const updatedStudent = await student.save();
      res.json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

/**
 * @desc    Delete a student
 * @route   DELETE /api/students/:id
 * @access  Private
 */
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      await student.deleteOne();
      // Di aplikasi nyata, Anda mungkin juga ingin menghapus transaksi terkait
      res.json({ message: 'Siswa berhasil dihapus' });
    } else {
      res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
