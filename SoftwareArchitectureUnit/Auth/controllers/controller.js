const AuthService = require('../services/authService');
const logger = require('../logger');
const {
  HttpErrorCodes,
  evalException,
  BadRequestException,
  UnauthorizeException,
  NotFoundException,
} = require('../exceptions/exceptions');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        throw new BadRequestException(
          'Debe proporcionar un usuario y una contraseña.',
        );
      }
      const token = await this.authService.login(username, password);

      logger.info(`POST - LOGIN - 200 - ${username} Inicio de sesion exitoso`);
      return res
        .status(HttpErrorCodes.HTTP_200_OK)
        .send({ message: 'Inicio de sesión exitoso.', token });
    } catch (error) {
      if (error instanceof NotFoundException) {
        logger.error(`POST - LOGIN - 404 - ${username} not found`);
        return res
          .status(HttpErrorCodes.ERROR_404_NOT_FOUND)
          .json({ error: error.message });
      }
      logger.error(`POST - LOGIN - 500 - ${username} ${error.message}`);
      return evalException(error, res);
    }
  }

  async register(req, res) {
    try {
      const {
        _id, username, password, role,
      } = req.body;
      if (!_id || !username || !password || !role) {
        throw new BadRequestException(
          'Debe proporcionar un usuario, contraseña y rol.',
        );
      }
      const newUser = await this.authService.register(_id, username, password, role);
      return res.status(HttpErrorCodes.HTTP_200_OK).send(newUser);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async verifyToken(req, res) {
    try {
      const authorization = req.header('Authorization');
      const token = authorization ? authorization.replace('Bearer ', '') : null;
      const { role } = req.query;

      if (!token) {
        throw new BadRequestException('Token no proporcionado');
      }
      if (role === undefined) {
        throw new BadRequestException('Rol no proporcionado');
      }

      await this.authService.verifyToken(role, token);

      return res
        .status(HttpErrorCodes.HTTP_200_OK)
        .json({ message: 'Usuario habilitado' });
    } catch (err) {
      return evalException(err, res);
    }
  }

  async logs(_req, res) {
    try {
      const result = await this.authService.logs();
      return res.status(HttpErrorCodes.HTTP_200_OK).send(result);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async getLoggedUser(req, res) {
    try {
      const authorization = req.header('Authorization');
      const token = authorization ? authorization.replace('Bearer ', '') : null;

      if (!token) {
        throw new BadRequestException('Token no proporcionado');
      }

      const user = await this.authService.getLoggedUser(token);
      return res.status(HttpErrorCodes.HTTP_200_OK).send(user);
    } catch (err) {
      return evalException(err, res);
    }
  }
}

module.exports = AuthController;
