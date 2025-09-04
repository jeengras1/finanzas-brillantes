import express from 'express';
import { Pool } from 'pg';
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

const app = express();
app.use(express.json());

const { GITHUB_APP_ID, GITHUB_INSTALLATION_ID, GITHUB_PRIVATE_KEY, GITHUB_REPO_OWNER, GITHUB_REPO_NAME = 'finanzas-brillantes' } = process.env;

async function getInstallationOctokit() {
  if (!GITHUB_APP_ID || !GITHUB_INSTALLATION_ID || !GITHUB_PRIVATE_KEY || !GITHUB_REPO_OWNER) {
    throw new Error('Faltan una o más variables de entorno de GitHub.');
  }
  const auth = createAppAuth({
    appId: parseInt(GITHUB_APP_ID, 10),
    privateKey: GITHUB_PRIVATE_KEY.replace(/\\n/g, '\n'),
    installationId: parseInt(GITHUB_INSTALLATION_ID, 10)
  });
  const { token } = await auth({ type: 'installation' });
  return new Octokit({ auth: token });
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const init = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS misiones ( id SERIAL PRIMARY KEY, objetivo TEXT NOT NULL, estado VARCHAR(32) DEFAULT 'nueva', creado_en TIMESTAMPTZ DEFAULT NOW() );
  `);
  console.log("✅ Tabla 'misiones' lista.");
};

app.post('/archivar-mision-prueba', async (req, res) => {
  try {
    const octokit = await getInstallationOctokit();
    const path = `actas/acta-prueba-${Date.now()}.md`;
    const content = Buffer.from('Prueba de escritura autónoma desde Nexus v2 (ESM)').toString('base64');
    const result = await octokit.rest.repos.createOrUpdateFileContents({
      owner: GITHUB_REPO_OWNER,
      repo: GITHUB_REPO_NAME,
      path,
      message: 'Acta de prueba automática (ESM)',
      content,
      committer: { name: 'Nexus Bot', email: 'bot@nexus.dev' },
      author: { name: 'Nexus Bot', email: 'bot@nexus.dev' }
    });
    res.json({ ok: true, url: result.data.content.html_url });
  } catch (err) {
    console.error('❌ Error en /archivar-mision-prueba:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
init().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Nexus activo en modo ESM en puerto ${PORT}`);
  });
});
