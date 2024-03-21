const { default: axios } = require('axios');
const logger = require('../../utils/logger');

function validateDatesFilter(errors, event) {
  const today = new Date();
  const publicationDate = event.createdAt;
  const { startDate } = event;
  const { endDate } = event;

  if (
    publicationDate > today
    || startDate < today
    || endDate < today
    || startDate < endDate
    || publicationDate < startDate
  ) {
    logger.info(`VALIDATE DATES FILTER - Las fechas ${startDate}, ${endDate}, ${publicationDate} no son consistentes`);
    errors.push('Las fechas del evento no son consistentes.');
  }

  return errors;
}

async function regulatoryUnityFilter(errors, event) {
  const supplierId = event.supplier.id;
  const userIsAuthorized = await axios.get(
    `http://localhost:3003/regulatory-unity/authorized-user/${supplierId}`,
  );

  if (!userIsAuthorized.data) {
    logger.info('REGULATORY UNITY FILTER - El usuario no está autorizado por la Unidad Regulatoria para realizar eventos.');
    errors.push(
      'El usuario no está autorizado por la Unidad Regulatoria para realizar eventos.',
    );
  }

  return errors;
}

module.exports = {
  validateDatesFilter,
  regulatoryUnityFilter,
};
