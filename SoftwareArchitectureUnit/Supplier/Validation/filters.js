const { default: axios } = require('axios');

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
    errors.push('Las fechas del evento no son consistentes.');
  }

  return errors;
}

async function regulatoryUnityFilter(errors, event) {
  const supplierId = event.supplier.id;
  try {
    const userIsAuthorized = await axios.get(
      `http://localhost:3003/regulatory-unity/authorized-user/${supplierId}`,
    );
    if (!userIsAuthorized.data) {
      errors.push(
        'El usuario no está autorizado por la Unidad Regulatoria para realizar eventos.',
      );
    }
    return errors;
  } catch (error) {
    throw new Error(
      'No fue posible comunicarse con el servicio de Unidad Regulatoria.'
    )
  }
}

async function paymentGatewayFilter(errors, event) {
  const supplierId = event.supplier.id;
  try {
    const userIsAuthorized = await axios.get(
      `http://localhost:3003/payment-gateway/authorized-user/${supplierId}`,
    );

    if (!userIsAuthorized.data) {
      errors.push(
        'El usuario no ha abondado los costos por la transmisión del evento.',
      );
    }
  } catch (error) {
    errors.push(
      'No fue posible comunicarse con el servicio de Payment Gateway.',
    );
  }

  return errors;
}

module.exports = {
  validateDatesFilter,
  regulatoryUnityFilter,
  paymentGatewayFilter,
};
