/* ============================================================
   SODA‑NEXUS — Módulo de Logs (Versión 2)
   Nueva versión independiente. No modifica snx-logs.js previo.
   ============================================================ */

const API_LOGS_V2 = window.SNX_BACKEND_URL; /* OBS: URL soberana */

/* OBS: Solicita logs para la versión 3 del monitor */
async function snx_getLogs_v3() {
    const response = await fetch(`${API_LOGS_V2}/logs`);
    const data = await response.text();
    document.getElementById("snx-logs-v3").innerText = data;
    return data;
}

/* OBS: Actualiza logs cada 5 segundos */
setInterval(snx_getLogs_v3, 5000);

/* ============================================================
   PIE DE PÁGINA INSTITUCIONAL — SODA‑NEXUS
   No modificar líneas sin aprobación institucional.
   No sobrescribir archivos previos; siempre crear nuevas versiones.
   Mantener encabezado, observaciones y pie de página.
   ============================================================ */
