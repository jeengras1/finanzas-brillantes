// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║ 📁 MÓDULO 1 – GANANCIAS V1.2 (UltraBlindado y Optimizado para Monitor)    ║
// ║ 📅 Actualización: 27 de junio de 2025                                     ║
// ║ 🤖 IA Estratega: Gemini | IA Auditora: ChatGPT                           ║
// ║ 🧠 Rol: Identifica oportunidades y registra la actividad financiera.      ║
// ╚═══════════════════════════════════════════════════════════════════════════╝
const CONFIG_M1 = {
  NOMBRE_MODULO: "M1-GANANCIAS",
  HOJA_OPORTUNIDADES: "📌Oportunidades",
  ENCABEZADOS_OPORTUNIDADES: ["Fecha", "Activo", "Precio", "Volumen Promedio", "Volatilidad Diaria"],
  HOJA_ESTADO: "EstadoProcesoGanancias",
  ENCABEZADOS_ESTADO: ["Ultimo Indice"],
  HOJA_HISTORIAL: "Historial",
  ENCABEZADOS_HISTORIAL: ["Fecha", "Activo", "Qty", "Precio", "Valor", "Ganancia", "Fuente"],
  HOJA_DETALLE_ACTIVO: "Detalle por Activo",
  ENCABEZADOS_DETALLE_ACTIVO: ["Fecha", "Simbolo", "Qty", "Precio", "Valor", "Ganancia"],
  HOJA_CAPITAL: "CapitalDisponible",
  ENCABEZADOS_CAPITAL: ["Fecha", "Monto Disponible"],
  HOJA_RESUMEN_GANANCIAS: "Resumen Ganancias",
  ENCABEZADOS_RESUMEN_GANANCIAS: ["Campo", "Valor"],
  HOJA_DOCS: "Modulo 1 - Ganancias",
  HOJA_LISTA_SCRIPTS: "Lista Scripts .gs",
  HOJA_CODIGOS: "Scripts Completos",
  CACHE_KEY_ACTIVOS: "activos_alpaca",
  CACHE_DURACION_S_ACTIVOS: 21600, // 6 horas
  TAMANO_BLOQUE_ESCANEO: 100,
  MAX_DURACION_EJECUCION_MS: 280000, // 280s, margen para el límite de 6min (360s)
  CAPITAL_OPERATIVO_SIMULADO: 10,
  DIAS_BARRAS_HISTORICAS: 5
};
// ... (resto del código de Módulo 1)
