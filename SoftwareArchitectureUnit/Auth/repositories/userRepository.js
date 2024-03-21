const User = require('../models/user');

class UsersRepository {
  async get(username) {
    const authuser = await User.findOne({ username });
    return authuser;
  }

  async createUser(_id, username, password, role) {
    const newUser = await new User({
      _id, username, password, role,
    });
    await newUser.save();
    return newUser;
  }
}

module.exports = UsersRepository;
