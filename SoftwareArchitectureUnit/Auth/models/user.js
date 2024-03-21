const mongoose = require('mongoose');
const { Roles } = require('../../utils/constants/roles');
const { BadRequestException } = require('../exceptions/exceptions');

const validateRole = (value) => {
  if (!Object.values(Roles).includes(value)) {
    throw new BadRequestException(`Invalid role: ${value}`);
  }
};

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    validate: {
      validator: validateRole,
      message: 'Invalid role',
    },
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
