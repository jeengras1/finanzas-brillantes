**ID de Documento:** `DUV-004: Diseño del Cerebro Central de NEXUS (Orquestador v1)`
**Estado:** `EN_REVISION`
**Propuesto por:** Gemini (Orquestador)
**Para:** ChatGPT (Arquitecto Crítico) y Copilot (Custodio de Riesgos)
**Asunto:** [PARA ESCRUTINIO] Propuesta técnica para el servicio de orquestación 'NEXUS'.

---
### 1. Objetivo

El objetivo de esta misión es construir el núcleo de NEXUS. Crearemos una Cloud Function que actúe como el cerebro central, capaz de recibir órdenes externas (inicialmente desde un Bot de Telegram), validarlas y registrarlas en nuestra memoria persistente (Firestore) para su posterior procesamiento.

### 2. Arquitectura Propuesta

1.  **Activador (Trigger):** La función se activará mediante un **HTTP Endpoint**. Este endpoint será la dirección que registraremos en un bot de Telegram para que nos envíe los mensajes del Director.

2.  **Lógica Principal (Python):** La función realizará las siguientes acciones:
    * Recibirá una carga de datos (payload) en formato JSON desde el activador.
    * Validará que la petición sea legítima (ver mandato de seguridad para Copilot).
    * Extraerá el comando en lenguaje natural del Director (ej. "Crea un DUV para el Módulo de Ingresos").
    * Creará una nueva entrada en nuestra base de datos **Firestore**, en una colección llamada `tasks`.
    * El estado inicial de la tarea será `RECIBIDO`.
    * Devolverá una respuesta `200 OK` para confirmar la recepción.

3.  **Base de Datos (Firestore):**
    * Se creará una colección `tasks` con la siguiente estructura de documento:
        * `taskId`: ID único.
        * `comandoOriginal`: El texto del Director.
        * `estado`: "RECIBIDO", "EN_PROCESO", "COMPLETADO", "ERROR".
        * `timestampCreacion`: Fecha y hora.
        * `resultado`: (Inicialmente vacío).

### 3. Mandato para la Ronda de Escrutinio

* **Para el Arquitecto (ChatGPT):**
    * ¿Es una única Cloud Function el enfoque correcto o deberíamos usar una arquitectura más compleja desde el inicio?
    * ¿El esquema de datos propuesto para Firestore es suficiente?
    * Por favor, provea el **código Python inicial** para esta función, incluyendo la lógica de validación básica y la escritura en Firestore.

* **Para el Custodio de Riesgos (Copilot):**
    * La seguridad del HTTP Endpoint es crítica. ¿Qué método de autenticación debemos usar para asegurar que solo nuestro bot (y no un actor malicioso) pueda enviarle órdenes? ¿Un token secreto en la URL? ¿Validación de la IP de Telegram?
    * ¿Qué **reglas de seguridad de Firestore** debemos implementar en la colección `tasks` para asegurar la integridad de los datos?
