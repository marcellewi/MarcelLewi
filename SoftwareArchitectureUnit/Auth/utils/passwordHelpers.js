const bcrypt = require('bcrypt');

class passwordHelpers {
  async hashPassword(password) {
    try {
      const hash = await bcrypt.hash(password, 10);
      return hash;
    } catch (error) {
      throw new Error('Error al encriptar la contraseña');
    }
  }

  async comparePassword(password, hash) {
    try {
      const match = await bcrypt.compare(password, hash);
      return match;
    } catch (error) {
      throw new Error('Error al comparar la contraseña');
    }
  }
}

module.exports = passwordHelpers;
