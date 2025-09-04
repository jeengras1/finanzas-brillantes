const fs = require('fs'); const path = require('path');
const ROOT = 'dossier'; const errors = [];
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.md') ? [path.join(dir, e.name)] : []); }
const files = walk(ROOT); console.log(`Auditando ${files.length} documentos...`);
for (const file of files) { const content = fs.readFileSync(file, 'utf8'); if (!content.startsWith('---\n')) { errors.push(`Error en ${file}: Falta encabezado YAML.`); } }
if (errors.length > 0) { console.error('\nErrores de validación:'); errors.forEach(e => console.error(`- ${e}`)); process.exit(1); }
console.log('✅ Documentos válidos.');
