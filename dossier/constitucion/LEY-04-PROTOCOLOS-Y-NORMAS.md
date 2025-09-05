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


--- (Contenido de LEY-06 fusionado) ---


## Ley Sexta: De las Normas y Estándares Técnicos

**Artículo 31 (Creación de Normas Operativas):** La Constitución delega la creación de reglas técnicas detalladas a documentos secundarios denominados "Normas Operativas" (`NORMA-XXX`). Cada norma debe incluir autor, fecha de vigor e historial de versiones.

**Artículo 32 (Ámbito de las Normas):** Las Normas Operativas regularán, como mínimo: Nomenclaturas, Versionado y Formatos de todos los artefactos del sistema.

**Artículo 33 (Proceso de Aprobación de Normas):**
* **33.1.** Las Normas Operativas generales serán aprobadas por mayoría simple (2 de 3 votos), con el Director reteniendo poder de veto.
* **33.2.** Las Normas Operativas que afecten directamente a la seguridad, la gobernanza o la arquitectura fundamental requerirán **voto unánime** del consorcio para su aprobación.

**Artículo 34 (Repositorio de Normas):** Todas las Normas Operativas vigentes serán archivadas en una carpeta `/normas` en el repositorio oficial de GitHub.
