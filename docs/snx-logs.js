/* ============================================================
   SODA‑NEXUS — Módulo Institucional de Logs del Monitor
   Este archivo permite visualizar los logs soberanos del backend
   en tiempo real desde el monitor web.
   ============================================================ */

/* OBS: Obtiene la URL soberana definida en config.js. */
const API = window.SNX_BACKEND_URL;

/* OBS: Función para solicitar los logs del backend. */
async function snx_getLogs() {
    /* OBS: Realiza solicitud GET al endpoint /logs del backend. */
    const response = await fetch(`${API}/logs`);

    /* OBS: Convierte la respuesta en texto plano para mostrar logs. */
    const data = await response.text();

    /* OBS: Inserta los logs en el contenedor HTML correspondiente. */
    document.getElementById("snx-logs").innerText = data;

    /* OBS: Retorna los logs por si otro módulo los necesita. */
    return data;
}

/* OBS: Actualiza los logs automáticamente cada 5 segundos. */
setInterval(snx_getLogs, 5000);

/* OBS: Ejecuta una carga inicial al abrir el monitor. */
window.onload = () => {
    snx_getLogs();
};

/* ============================================================
   PIE DE PÁGINA INSTITUCIONAL — SODA‑NEXUS
   Este archivo pertenece al sistema soberano SODA‑NEXUS.
   REGLAS INSTITUCIONALES:
   1. Las instrucciones deben darse SIEMPRE en orden y completas.
   2. No se deben modificar líneas sin aprobación institucional.
   3. Si un script existe en el sistema, debe solicitarse, leerse
      y modificarse únicamente sobre su contenido real.
   4. No mover, eliminar o sobrescribir archivos sin inspección
      previa del filesystem para evitar pérdida de memoria.
   5. Cada script o documento debe incluir encabezado, observaciones
      por línea y este pie de página institucional.
   6. Mantener coherencia con la estructura soberana del Estado.
   7. Garantizar anti‑amnesia y auditabilidad total.
   8. Realizar la mayoría de tareas en un solo chat para preservar
      el contexto operativo y la memoria institucional.
   ============================================================ */
