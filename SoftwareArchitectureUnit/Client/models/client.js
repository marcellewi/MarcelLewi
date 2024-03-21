const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} no es un correo electrónico válido.',
    },
  },
  country: {
    type: String,
    required: true,
  },
});

const Client = mongoose.model('Client', UserSchema);

module.exports = Client;
