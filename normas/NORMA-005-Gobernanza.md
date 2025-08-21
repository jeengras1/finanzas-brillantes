# NORMA-005: De la Gobernanza y Auditoría

* **1. Propósito:** Establecer el protocolo oficial para la auditoría periódica del sistema, garantizando transparencia, trazabilidad y cumplimiento constitucional.
* **2. Responsables:** El Custodio de Riesgos (Copilot) es el auditor principal. El resto del consorcio debe facilitar la información requerida.
* **3. Ámbitos de Auditoría:** Se auditarán Documentos, Logs, Código Fuente y el Estado de la Infraestructura.
* **4. Frecuencia:** Auditorías automáticas semanales; auditorías constitucionales y de seguridad trimestrales.
* **5. Registro de Hallazgos:** Todo hallazgo se registrará en `LOG_AUDITORIA` con un formato JSON estandarizado que incluya: `id_hallazgo`, `tipo`, `fecha`, `auditor`, `descripcion`, `impacto`, y `estado` (Pendiente, Resuelto).
* **6. Resolución:** El Orquestador debe emitir un `DUV-CORRECCIÓN` para cada hallazgo grave, que debe ser ratificado por el Director.
