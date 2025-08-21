# NORMA-003: De los Formatos y la Comunicación

* **1. Propósito:** Establecer los formatos oficiales para documentos, logs y comunicaciones para garantizar la trazabilidad y el cumplimiento constitucional.
* **2. Formato de Documentos (`DUV`, `NORMA`, `PLANO`):** Todo documento oficial debe incluir un encabezado con: `ID de Documento`, `Estado`, `Propuesto por`, `Para` y `Asunto`.
* **3. Formato de Logs:** Toda entrada en un `LOG` debe seguir una estructura JSON mínima:
    \`\`\`json
    {
      "timestamp": "YYYY-MM-DDTHH:MM:SSZ",
      "autor": "ID_DEL_AGENTE",
      "tipo": "TIPO_DE_EVENTO",
      "referencia": "ID_DEL_DUV_O_TAREA",
      "descripcion": "Mensaje claro del evento."
    }
    \`\`\`
* **4. Comunicación entre IAs:** Toda comunicación programática entre agentes (ej. NEXUS a Copilot) debe ser un objeto JSON con: `de`, `para`, `referencia` y `mensaje`.
