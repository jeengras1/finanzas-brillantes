# NORMA-008: De la Escalabilidad y Resiliencia

* **1. Propósito:** Establecer los principios de ingeniería que garantizan que todo componente del sistema sea escalable, resiliente y recuperable.
* **2. Requisitos de Escalabilidad:** Todo nuevo módulo debe ser desacoplado (ej. Cloud Run), configurable externamente (ej. Firestore) y versionado según `NORMA-001`.
* **3. Protocolo de Respaldo (Backups):** Se realizarán copias de seguridad semanales de Firestore y GitHub, validadas con checksum y registradas en `LOG_RESPALDOS`.
* **4. Plan de Recuperación ante Desastres:** En caso de fallo crítico, el Orquestador activará un `DUV-CRISIS`, se restaurará desde el último backup verificado y el Guardián validará la integridad antes de la reactivación.
* **5. Pruebas de Resiliencia:** Se realizarán simulaciones mensuales de fallo en un entorno de pruebas para validar los tiempos de recuperación.
