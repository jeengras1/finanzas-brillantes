const fs = require('fs');
const path = require('path');

// Validador simple que asegura que cada documento tiene una ficha técnica.
function validateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.startsWith('---\n')) {
        throw new Error(`Validación fallida en ${filePath}: Falta la ficha técnica (encabezado YAML).`);
    }
}

console.log('Iniciando auditoría de documentos modificados...');
// Obtenemos la lista de archivos modificados del evento de GitHub
const files = process.env.MODIFIED_FILES.split(' ');
files.forEach(file => {
    if (file.endsWith('.md') && file.startsWith('dossier/')) {
        console.log(`-> Auditando: ${file}`);
        validateFile(file);
    }
});
console.log('✅ Auditoría completada. Todos los documentos auditados son válidos.');
