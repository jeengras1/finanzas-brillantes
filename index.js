// index.js (Versión Reparada y Blindada)
import { Pool } from 'pg';
import express from 'express';

// Variable para la base de datos
let pool;

// Función de inicialización
async function init() {
  console.log("Iniciando Nexus Financiero v2.0.1...");

  // --- !! INICIO DE LA REPARACIÓN !! ---
  // Comprobamos si el Director dio la orden de omitir la base de datos.
  if (process.env.OMIT_DB === 'true') {
    console.warn("⚠️  Modo SIN ESTADO activado. Omitiendo conexión a la base de datos.");
    // Dejamos el 'pool' como nulo. El resto del código deberá manejar esto.
  } else if (process.env.DATABASE_URL) {
    console.log("✅ DATABASE_URL encontrada. Conectando a la base de datos PostgreSQL...");
    try {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      });
      // Hacemos una consulta de prueba para verificar la conexión
      await pool.query('SELECT NOW()');
      console.log("✅ Conexión a la base de datos establecida con éxito.");
    } catch (err) {
      console.error("❌ ERROR CRÍTICO al conectar a la base de datos:", err);
      // Si la conexión falla, detenemos el proceso para evitar más errores.
      process.exit(1);
    }
  } else {
    console.error("❌ ERROR CRÍTICO: No se encontró la variable DATABASE_URL y el modo SIN ESTADO no está activado.");
    process.exit(1);
  }
  // --- !! FIN DE LA REPARACIÓN !! ---

  const app = express();
  const port = process.env.PORT || 8080;

  app.get('/', (req, res) => {
    const status = pool ? 'Conectado a la base de datos.' : 'Operando en modo sin estado.';
    res.send(`Servicio Nexus Financiero operativo. ${status}`);
  });

  app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${port}`);
  });
}

init();
