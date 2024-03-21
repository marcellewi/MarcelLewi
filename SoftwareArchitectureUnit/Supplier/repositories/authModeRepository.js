const AuthMode = require('../models/authMode');

module.exports = class AuthModeRepository {
  async setAuthMode(mode) {
    const authMode = await AuthMode.findOne();
    if (authMode) {
      authMode.mode = mode;
      await authMode.save();
      return authMode;
    }
    const newAuthMode = await new AuthMode({ mode });
    await newAuthMode.save();
    return newAuthMode;
  }

  async getAuthMode() {
    const authMode = await AuthMode.findOne();
    return authMode.mode;
  }
};
