/* ============================================================
   SODA‑NEXUS — Lógica del Monitor Web (Versión 2)
   Nueva versión independiente. No modifica monitor.js previo.
   ============================================================ */

const API_V2 = window.SNX_BACKEND_URL; /* OBS: URL soberana */

/* OBS: Solicita estado del backend para la versión 3 del monitor */
async function snx_getStatus_v3() {
    const response = await fetch(`${API_V2}/status`);
    const data = await response.json();
    document.getElementById("snx-status-v3").innerText = data.status;
    return data;
}

/* OBS: Ejecuta automáticamente al cargar index-3.html */
window.onload = () => {
    snx_getStatus_v3();
};

/* ============================================================
   PIE DE PÁGINA INSTITUCIONAL — SODA‑NEXUS
   No modificar líneas sin aprobación institucional.
   No sobrescribir archivos previos; siempre crear nuevas versiones.
   Mantener encabezado, observaciones y pie de página.
   ============================================================ */
