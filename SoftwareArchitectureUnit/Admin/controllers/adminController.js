const {
  HttpErrorCodes,
  evalException,
  BadRequestException,
} = require('../exceptions/exceptions');
const AdminService = require('../services/adminService');
const EventService = require('../services/eventService');

module.exports = class AdminController {
  constructor() {
    this.adminService = new AdminService();
    this.eventService = new EventService();
  }

  async create(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        throw new BadRequestException(
          'Debe proporcionar un nombre, email, y contraseña',
        );
      }

      const admin = await this.adminService.createAdmin(req.body);
      if (!admin) {
        throw new BadRequestException('No se pudo crear el administrador');
      }

      return res.status(HttpErrorCodes.HTTP_200_OK).json(admin);
    } catch (err) {
      return evalException(err, res);
    }
  }

  async logs(req, res) {
    try {
      const { from, to } = req.body;
      const result = await this.adminService.logs(from, to);
      return res.status(HttpErrorCodes.HTTP_200_OK).send(result);
    } catch (err) {
      return evalException(err, res);
    }
  }
};
