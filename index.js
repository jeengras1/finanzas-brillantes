// DUV-040 • Proto-Nexus v2 (Node.js + PostgreSQL en Render - Free)
const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// Render inyecta DATABASE_URL y PORT
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERROR: Falta DATABASE_URL en variables de entorno.");
  process.exit(1);
}

// Render PostgreSQL requiere SSL. Aceptamos el certificado gestionado por Render.
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

// Inicialización: crear tabla si no existe
const init = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS misiones (
      id SERIAL PRIMARY KEY,
      objetivo TEXT NOT NULL,
      estado VARCHAR(32) NOT NULL DEFAULT 'nueva',
      creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `);
  console.log("Tabla 'misiones' verificada/creada.");
};

app.get("/", (_req, res) => {
  res.json({ ok: true, servicio: "proto-nexus-web", ts: new Date().toISOString() });
});

// Crear misión: { "objetivo": "..." }
app.post("/misiones", async (req, res) => {
  try {
    const objetivoRaw = req.body?.objetivo;
    if (typeof objetivoRaw !== "string") {
      return res.status(400).json({ error: "Campo 'objetivo' es requerido (string)." });
    }
    const objetivo = objetivoRaw.trim();
    if (!objetivo || objetivo.length > 2000) {
      return res.status(400).json({ error: "‘objetivo’ vacío o demasiado largo (máx 2000 caracteres)." });
    }
    const result = await pool.query(
      "INSERT INTO misiones (objetivo) VALUES ($1) RETURNING id, objetivo, estado, creado_en;",
      [objetivo]
    );
    return res.status(201).json({ mision: result.rows[0] });
  } catch (err) {
    console.error("Error en POST /misiones:", err);
    return res.status(500).json({ error: "Error interno." });
  }
});

// Arranque del servidor
const port = process.env.PORT || 3000;
init()
  .then(() => {
    app.listen(port, () => {
      console.log(`Proto-Nexus v2 escuchando en puerto ${port}`);
    });
  })
  .catch((e) => {
    console.error("Fallo en init():", e);
    process.exit(1);
  });
