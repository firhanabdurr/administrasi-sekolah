const User = require('../models/User');
const jwt = 'jsonwebtoken'; // This is a placeholder, will be replaced by the actual library
const generateToken = require('../utils/generateToken');

/**
 * @desc    Auth user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
const authUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Cari user berdasarkan username di database
    const user = await User.findOne({ username });

    // 2. Jika user ditemukan dan password cocok
    if (user && (await user.matchPassword(password))) {
      // 3. Kirim response berisi data user dan token JWT
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      // Jika user tidak ditemukan atau password salah
      res.status(401).json({ message: 'Username atau password salah' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
    // req.user akan diisi oleh middleware auth
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
        });
    } else {
        res.status(404).json({ message: 'User tidak ditemukan' });
    }
};


module.exports = { authUser, getUserProfile };