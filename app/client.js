// La dirección oficial y permanente de nuestro Nexus en Render
const NEXUS_URL = 'https://proto-nexus-web.onrender.com';

// Función de ejemplo para enviar una nueva misión al Nexus
async function crearMision(objetivo) {
  try {
    const response = await fetch(`${NEXUS_URL}/misiones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ objetivo }),
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const resultado = await response.json();
    console.log('Misión creada con éxito:', resultado);
    // Aquí se podría actualizar la interfaz de usuario
    return resultado;
  } catch (error) {
    console.error('Fallo al crear la misión:', error);
    // Aquí se podría mostrar un error en la interfaz de usuario
  }
}
