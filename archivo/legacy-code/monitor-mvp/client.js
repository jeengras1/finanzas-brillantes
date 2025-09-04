// client.js - Fase 1.3: Activación de Entrada Dinámica

const NEXUS_URL = 'https://nexus-mvp-hxnc4lt5ca-uc.a.run.app/mission';
const TIMEOUT_MS = 15000;

const missionForm = document.getElementById('mission-form');
const objectiveEl = document.getElementById('objective');
const sendBtn = document.getElementById('sendBtn');
const responseEl = document.getElementById('response');
const diagnosticsEl = document.getElementById('diagnostics');

function log(level, message, data) {
  const timestamp = new Date().toISOString();
  diagnosticsEl.textContent = `[${timestamp}] [${level}] ${message}\n` + (data ? JSON.stringify(data, null, 2) : '') + '\n\n' + diagnosticsEl.textContent;
}

missionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const objective = objectiveEl.value.trim();
  
  // Validación de campo vacío
  if (!objective) {
    alert('El objetivo de la misión no puede estar vacío.');
    log('WARN', 'Intento de envío con campo vacío.');
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = 'Enviando...';
  responseEl.innerHTML = '<em>Contactando al Nexus...</em>';
  log('INFO', 'Iniciando envío de misión.', { objective });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(NEXUS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objective: objective }),
      signal: controller.signal
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Respuesta no exitosa del servidor.');
    }
    
    responseEl.innerHTML = `<p><strong>Éxito.</strong> Misión registrada con ID:</p><pre>${data.mission_id}</pre>`;
    log('SUCCESS', 'Respuesta recibida del Nexus.', data);

  } catch (error) {
    if (error.name === 'AbortError') {
        responseEl.innerHTML = '<p><strong>Error de Timeout.</strong> El Nexus no respondió a tiempo.</p>';
        log('ERROR', 'Timeout en la comunicación con el Nexus.');
    } else {
        responseEl.innerHTML = '<p><strong>Error.</strong> No se pudo conectar con el Nexus.</p>';
        log('ERROR', 'Fallo en la comunicación con el Nexus.', error.message);
    }
  } finally {
    clearTimeout(timeoutId);
    sendBtn.disabled = false;
    sendBtn.textContent = 'Enviar Misión';
  }
});
