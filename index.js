const express = require("express");
const { Pool } = require("pg");
const { createAppAuth } = require("@octokit/auth-app");
const { Octokit } = require("@octokit/rest");

const app = express();
app.use(express.json());

// --- SECCIÓN DE VARIABLES DE ENTORNO ---
const {
  DATABASE_URL,
  PORT,
  GITHUB_APP_ID,
  GITHUB_INSTALLATION_ID,
  GITHUB_PRIVATE_KEY,
  GITHUB_REPO_OWNER,
  GITHUB_REPO_NAME
} = process.env;

// --- FUNCIÓN DE CONEXIÓN A LA BASE DE DATOS ---
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS misiones (
      id SERIAL PRIMARY KEY,
      objetivo TEXT NOT NULL,
      estado VARCHAR(32) NOT NULL DEFAULT 'nueva',
      creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `);
  console.log("Base de datos y tabla 'misiones' verificadas.");
};

// --- FUNCIÓN DE AUTENTICACIÓN CON GITHUB ---
async function getAuthenticatedOctokit() {
  const auth = createAppAuth({
    appId: GITHUB_APP_ID,
    privateKey: GITHUB_PRIVATE_KEY,
    installationId: GITHUB_INSTALLATION_ID,
  });
  const installationAuth = await auth({ type: "installation" });
  return new Octokit({ auth: installationAuth.token });
}

// --- ENDPOINTS DE LA API ---
app.get("/", (_req, res) => {
  res.json({ ok: true, servicio: "proto-nexus-web", status: "operativo" });
});

app.post("/misiones", async (req, res) => {
  // (Este es el endpoint que ya funciona para crear misiones)
  try {
    const { objetivo } = req.body;
    if (!objetivo || typeof objetivo !== 'string') {
      return res.status(400).json({ error: "Campo 'objetivo' es requerido." });
    }
    const result = await pool.query(
      "INSERT INTO misiones (objetivo) VALUES ($1) RETURNING *;",
      [objetivo]
    );
    return res.status(201).json({ mision: result.rows[0] });
  } catch (err) {
    console.error("Error en POST /misiones:", err);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
});

// --- NUEVO ENDPOINT PARA LA PRUEBA DE FUEGO ---
app.post("/archivar-mision-prueba", async (req, res) => {
  try {
    console.log("Iniciando prueba de archivado en GitHub...");
    const octokit = await getAuthenticatedOctokit();
    const filePath = `actas/acta-prueba-${Date.now()}.md`;
    const content = Buffer.from("Prueba de escritura autónoma del Nexus exitosa.").toString("base64");
    
    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_REPO_OWNER,
      repo: GITHUB_REPO_NAME,
      path: filePath,
      message: "COMMIT AUTÓNOMO: Prueba de escritura del Nexus",
      content: content,
      committer: { name: "Nexus-Soberano-Bot", email: "bot@nexus.dev" },
      author: { name: "Nexus-Soberano-Bot", email: "bot@nexus.dev" },
    });

    console.log("Archivo creado exitosamente en GitHub.");
    return res.status(201).json({ ok: true, message: "Archivo de prueba creado en GitHub.", url: data.content.html_url });
  } catch (error) {
    console.error("Error en /archivar-mision-prueba:", error.message);
    return res.status(500).json({ ok: false, error: "Fallo al escribir en GitHub.", details: error.message });
  }
});

// --- INICIO DEL SERVIDOR ---
initDb().then(() => {
  app.listen(PORT || 3000, () => {
    console.log(`Proto-Nexus v2 escuchando en el puerto ${PORT || 3000}`);
  });
}).catch(err => {
    console.error("Fallo al inicializar la base de datos:", err);
    process.exit(1);
});
