const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Skema untuk data Operator/User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Middleware yang berjalan sebelum data user disimpan
// Ini untuk melakukan hashing pada password
userSchema.pre('save', async function (next) {
  // Hanya hash password jika field password diubah
  if (!this.isModified('password')) {
    next();
  }

  // Generate salt untuk hashing
  const salt = await bcrypt.genSalt(10);
  // Hash password dengan salt
  this.password = await bcrypt.hash(this.password, salt);
});

// Metode untuk membandingkan password yang diinput dengan password di database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;