## Ley Quinta: De la Arquitectura y la Interacción Autónoma

**Artículo 25 (Componentes Centrales):** El sistema se compone de dos elementos principales: NEXUS (El Cerebro) y el Monitor Maestro (La Cabina de Mando).

**Artículo 26 (La Arquitectura de la Memoria Dual):** El sistema utilizará una memoria dual: GitHub (Memoria a Largo Plazo) y Firestore (Memoria Operativa).

**Artículo 27 (Principio de Agentes Especializados):** La funcionalidad del sistema se construirá a través de agentes autónomos y especializados.

**Artículo 28 (Seguridad Perimetral):** El único punto de entrada para la interacción del Director será el Monitor Maestro, protegido por un Balanceador de Carga con Identity-Aware Proxy (IAP).

**Artículo 29 (La Interfaz de Programación del Consorcio - API-C):** Se establece la creación de una API interna y una librería de software compartida, centralizada en NEXUS. Esta API-C será el único mecanismo autorizado para las siguientes interacciones autónomas y no simuladas:
* **29.1.** Que un agente del sistema (como NEXUS) consulte o modifique recursos en la Memoria a Largo Plazo (GitHub).
* **29.2.** Que un agente del sistema consulte o modifique registros en la Memoria Operativa (Firestore).
* **29.3.** Que un agente del sistema solicite análisis o ejecución a otro agente (ej. NEXUS pidiendo una auditoría a Copilot).

**Artículo 30 (Obligación de Trazabilidad):** Toda interacción realizada a través de la API-C deberá ser firmada digitalmente por el agente emisor y registrada en el `LOG_MAESTRO` para garantizar una auditoría completa.
