const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Roles } = require('../../utils/constants/roles');

const AdminRepository = require('../repositories/adminRepository');
const { BadRequestException, NotFoundException } = require('../exceptions/exceptions');

const logger = require('../../utils/logger');

module.exports = class AdminService {
  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async createAdmin(adminData) {
    const data = adminData;
    try {
      const newAdmin = await this.adminRepository.create(data);

      await axios.post('http://localhost:3001/auth/register', {
        _id: newAdmin._id,
        username: data.username,
        password: data.password,
        role: Roles.ADMIN,
      });

      logger.info(`POST - CREATE ADMIN - 200 - Admin creado: ${data.username} `);
      return newAdmin;
    } catch (e) {
      logger.error(`POST - CREATE ADMIN - 500 - ${e.message} `);
      throw new BadRequestException(`No se pudo crear el administrador${e.message}`);
    }
  }

  async logs(from, to) {
    if (from && to) {
      if (from > to) {
        logger.error('POST - LOGS - 400 - La fecha de inicio debe ser menor a la fecha de fin');
        throw new BadRequestException('La fecha de inicio debe ser menor a la fecha de fin');
      }
    }

    try {
      const filePath = path.join(__dirname, '..', '..', 'utils', 'logs', 'bitacora.log');
      let result = await fs.promises.readFile(filePath, 'utf8');
      if (from && to) {
        result = result.split('\n').filter((date) => {
          const dateString = date.substring(1, 11);
          return dateString >= from && dateString <= to;
        });
      }
      return result;
    } catch (error) {
      throw new NotFoundException('No se pudo obtener ningun log');
    }
  }
};
