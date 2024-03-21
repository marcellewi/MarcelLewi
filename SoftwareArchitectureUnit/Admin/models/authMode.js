const mongoose = require('mongoose');
const { EventAuthorizationMode } = require('../../utils/constants/eventAuthorizationMode');

const authModeSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: [EventAuthorizationMode.AUTO, EventAuthorizationMode.MANUAL],
    default: EventAuthorizationMode.MANUAL,
  },
});

const AuthMode = mongoose.model('AuthMode', authModeSchema);

module.exports = AuthMode;
