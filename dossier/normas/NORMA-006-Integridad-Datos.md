# NORMA-006: De la Integridad de Datos

* **1. Propósito:** Garantizar la consistencia, respaldo, seguridad y trazabilidad de los datos críticos del sistema.
* **2. Ámbitos de Protección:** Memoria Operativa (Firestore) y Memoria a Largo Plazo (GitHub).
* **3. Mecanismos de Integridad:** Todo archivo en GitHub debe incluir un encabezado constitucional y un hash de validación. Todo registro en Firestore debe incluir un timestamp y un autor verificado.
* **4. Respaldo de Datos:** Se realizarán copias de seguridad semanales de Firestore y GitHub, validadas con checksum y registradas en `LOG_RESPALDOS`.
* **5. Verificación de Consistencia:** Se realizarán auditorías cruzadas mensuales entre GitHub y Firestore para detectar divergencias.
