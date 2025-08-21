# NORMA-004: Del Protocolo de Incidentes

* **1. Propósito:** Establecer el protocolo para la detección, clasificación, registro y resolución de incidentes.
* **2. Clasificación de Severidad:**
    * **BAJA:** Error menor sin impacto funcional.
    * **MEDIA:** Fallo funcional parcial que no detiene el sistema.
    * **ALTA:** Violación constitucional, pérdida de contexto o fallo funcional grave.
    * **CRÍTICA:** Paralización total del Monitor Maestro o de un pilar fundamental.
* **3. Protocolo de Registro:** Todo incidente se registrará en `LOG_INCIDENTES` con el siguiente formato JSON:
    \`\`\`json
    {
      "id_incidente": "INC-YYYY-NNN",
      "timestamp": "YYYY-MM-DDTHH:MM:SSZ",
      "autor_deteccion": "ID_DEL_AGENTE",
      "severidad": "ALTA",
      "descripcion": "Descripción técnica del fallo.",
      "estado": "EN_INVESTIGACIÓN"
    }
    \`\`\`
* **4. Flujo de Escalamiento:**
    * **MEDIA:** Notificación automática al Orquestador.
    * **ALTA:** Notificación inmediata al Director y al consorcio + creación de un `DUV-CRISIS`.
    * **CRÍTICA:** Alerta roja y activación del protocolo de emergencia.
