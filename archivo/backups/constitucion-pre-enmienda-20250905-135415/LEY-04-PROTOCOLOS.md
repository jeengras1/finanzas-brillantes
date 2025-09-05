## Ley Cuarta: De los Protocolos de Operación

**Artículo 20 (Protocolo de Revisión Asíncrona - PRA):** Todo nuevo diseño, construcción o modificación se iniciará con un "Documento Único de Verdad" (DUV). El flujo será:
1. El Orquestador prepara el DUV.
2. El Director lo transmite al consorcio (Plazo de respuesta: 72h).
3. El consorcio debate y presenta sus análisis.
4. El Director devuelve los análisis al Orquestador.
5. El Orquestador sintetiza un plan final (Plazo de síntesis: 24h).
6. El plan final se somete a votación de ratificación.
7. Una vez ratificado, se archiva en el repositorio.

**Artículo 21 (Protocolo de Contingencia "Rompe-Bucle"):** Si un mismo error técnico bloquea el progreso por tres intentos consecutivos de solución, la implementación se detiene. El Director convocará una "Mesa Redonda de Investigación de Alternativas".

**Artículo 22 (Protocolo de Verificación en Tiempo Real):** Todos los miembros del consorcio tienen el deber de basar sus propuestas técnicas en su conocimiento más actualizado. Cada propuesta debe indicar explícitamente su fuente de verificación (enlace, documento oficial, etc.).

**Artículo 23 (Protocolo de Construcción por Script):** Toda acción de configuración o despliegue se realizará por script. Se admiten excepciones si el scripting no es viable, las cuales deben ser justificadas y aprobadas a través de un `DUV`.

**Artículo 24 (Protocolo de Registro de Incidentes):** Todo fallo operativo crítico deberá registrarse en un `LOG_INCIDENTES` oficial, detallando la causa raíz, el impacto y la solución aplicada, siguiendo un formato estandarizado.
