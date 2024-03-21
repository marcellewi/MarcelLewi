const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const UserRepository = require('../repositories/userRepository');
const PasswordHelpers = require('../utils/passwordHelpers');

const logger = require('../logger');
const systemLogger = require('../../utils/logger');

const {
  NotFoundException,
  BadRequestException,
  UnauthorizeException,
  ForbiddenException,
} = require('../exceptions/exceptions');

dotenv.config();

const signOptions = {
  expiresIn: process.env.JWT_EXPIRES_IN,
  algorithm: process.env.JWT_ALGORITHM,
};

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.passwordHelpers = new PasswordHelpers();
  }

  async login(username, password) {
    const user = await this.userRepository.get(username);

    if (!user) {
      systemLogger.error(`POST - LOGIN - 404 - No se encontro el usuario ${username}`);
      throw new NotFoundException('Username not found.');
    }
    const passwordMatch = await this.passwordHelpers.comparePassword(
      password,
      user.password,
    );

    if (!passwordMatch) {
      systemLogger.error(`POST - LOGIN - 400 - Contraseña invalida para el usuario ${username}`);
      throw new BadRequestException(`Invalid password for user ${username}.`);
    }
    const payload = {
      username: user.username,
      password: user.password,
      role: user.role,
    };

    if (user) {
      systemLogger.info(`POST - LOGIN - 200 - Login realizado correctamente ${username}`);
      return jwt.sign(payload, process.env.PRIVATE_KEY, signOptions);
    }
    logger.error(`POST - LOGIN - 401 - ${username} Desautorizado`);
    throw new UnauthorizeException('Desautorizado');
  }

  async register(_id, username, password, role) {
    const user = await this.userRepository.get(username);
    if (user) {
      throw new BadRequestException('User already exists.');
    }
    const hashedPass = await this.passwordHelpers.hashPassword(password);
    const newUser = await this.userRepository.createUser(
      _id,
      username,
      hashedPass,
      role,
    );
    systemLogger.info(`POST - REGISTER - 200 - Usuario creado: ${username}`);
    return newUser;
  }

  async verifyToken(role, token) {
    let payload;

    try {
      payload = await jwt.verify(token, process.env.PRIVATE_KEY);
    } catch (error) {
      throw new ForbiddenException('Forbidden access');
    }

    const user = await this.userRepository.get(payload.username);

    if (user) {
      if (payload.username !== user.username) {
        throw new BadRequestException('Invalid username');
      } else if (payload.password !== user.password) {
        throw new BadRequestException('Invalid password');
      } else if (payload.role !== role) {
        logger.error(
          `GET - VERIFY USER - 403 - ${user.username} unauthorized access`,
        );
        systemLogger.error(`GET - VERIFY USER - 403 - ${user.username} unauthorized access`);
        throw new UnauthorizeException('Unauthorized access')
      }
    } else {
      throw new NotFoundException('User not found');
    }

    logger.info(
      `GET - VERIFY USER - 200 - Allowed access for ${user.username} `,
    );
    systemLogger.info(`GET - VERIFY USER - 200 - Allowed access for ${user.username} `);
  }

  async logs() {
    try {
      const filePath = path.join(__dirname, '..', 'logs', 'acessLogs.log');
      const result = await fs.promises.readFile(filePath, 'utf8');
      return result;
    } catch (error) {
      throw new NotFoundException('No se pudo obtener ningun log');
    }
  }

  async getLoggedUser(token) {
    try {
      const payload = await jwt.verify(token, process.env.PRIVATE_KEY);
      const user = await this.userRepository.get(payload.username);

      return { id: user._id };
    } catch (error) {
      throw new NotFoundException('No se pudo obtener ningun usuario');
    }
  }
}

module.exports = AuthService;
