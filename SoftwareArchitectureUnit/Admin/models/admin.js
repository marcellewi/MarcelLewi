const mongoose = require('mongoose');
const validator = require('validator');

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      return validator.isEmail(value);
    },
  },
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
