const axios = require('axios');

// Función para hacer la solicitud al endpoint
async function makeRequest() {
  try {
    const response = await axios.post('http://localhost:3000/admin/events/notification');
    console.log('Solicitud exitosa:', response.data);
  } catch (error) {
    console.error('Error al hacer la solicitud:', error.message);
  }
}

// Ejecutar la solicitud al inicio
makeRequest();

// Configurar la tarea cron para que se ejecute cada hora
setInterval(makeRequest, 60 * 60 * 1000); 