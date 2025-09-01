// index.js (Versión Radical - Sin Base de Datos)
import express from 'express';

async function init() {
  console.log("Iniciando Nexus Financiero v2.0.1 en MODO SIN ESTADO FORZADO.");

  const app = express();
  const port = process.env.PORT || 8080;

  app.get('/', (req, res) => {
    res.send('Servicio Nexus Financiero operativo en modo sin estado. La conexión a la base de datos ha sido eliminada temporalmente.');
  });

  app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${port}`);
  });
}

init();
