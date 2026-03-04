async function cargarDiagnostico() {
  const cont = document.getElementById("ia-output");
  cont.innerHTML = "Cargando diagnóstico...";

  try {
    const res = await fetch("http://127.0.0.1:5051/ia/diagnostico");
    const data = await res.json();

    cont.innerHTML = `
      <h4>Resumen</h4>
      <pre>${data.resumen}</pre>

      <h4>Anomalías</h4>
      <pre>${data.logs.length ? data.logs.join("\n") : "Sin anomalías detectadas."}</pre>

      <h4>Riesgos</h4>
      <pre>${data.procesos.length ? data.procesos.join("\n") : "Sin riesgos detectados."}</pre>

      <h4>Recomendaciones</h4>
      <pre>${data.recomendaciones.join("\n")}</pre>

      <small>Última actualización: ${new Date(data.timestamp * 1000).toLocaleString()}</small>
    `;
  } catch (e) {
    cont.innerHTML = "Error al obtener diagnóstico.";
  }
}
