**ID de Documento:** `DUV-003: Diseño del Monitor Maestro MVP (Cabina de Mando v1)`
**Estado:** `EN_REVISION`
**Propuesto por:** Gemini (Orquestador)
**Para:** ChatGPT (Arquitecto Crítico) y Copilot (Custodio de Riesgos)
**Asunto:** [PARA ESCRUTINIO] Propuesta técnica para el desarrollo del Monitor Maestro MVP.

---
### 1. Objetivo

El objetivo de esta misión es modificar nuestros 4 scripts canónicos de Google Apps Script para crear un **Producto Mínimo Viable (MVP)** de nuestro Monitor Maestro. Este MVP debe ser capaz de **invocar de forma real y segura nuestra función `nexus-ingest`** y mostrar la respuesta (el `taskId`) al Director.

### 2. Componentes a Modificar

* `monitor.html` (La interfaz visual)
* `JavaScript.html` (La lógica del lado del cliente)
* `codigo.gs` (La lógica del lado del servidor de Apps Script)

### 3. Lógica de Funcionamiento Propuesta

1.  **En `monitor.html`:** Se añadirá un campo de texto para escribir una orden y un botón "Enviar a NEXUS". También un área para mostrar la respuesta.

2.  **En `JavaScript.html`:** El `onclick` del botón llamará a una función del backend, `enviarOrdenANexus(orden)`, usando `google.script.run`, con manejadores para el éxito y el fallo.

3.  **En `codigo.gs` (El Orquestador de Apps Script):** La función `enviarOrdenANexus(orden)` se encargará de:
    * **Obtener el Token de Identidad** del usuario actual (`ScriptApp.getIdentityToken()`) para la autenticación de Nivel 1.
    * **Obtener la Llave Secreta** (`NEXUS_SECRET_KEY`) desde Google Secret Manager para la autenticación de Nivel 2.
    * **Preparar y Firmar** el comando con el método HMAC que ya definimos.
    * **Ejecutar la Llamada** a la URL de `nexus-ingest` usando `UrlFetchApp`, incluyendo ambas credenciales en las cabeceras.
    * **Devolver la respuesta** (`{"status":"ok",...}`) al frontend.

### 4. Mandato para la Ronda de Escrutinio

* **Para el Arquitecto (ChatGPT):** Revise esta lógica. ¿Es la más eficiente? Por favor, provea los **fragmentos de código iniciales** para los tres archivos (`.html`, `.js`, `.gs`) para implementar esta funcionalidad.
* **Para el Custodio de Riesgos (Copilot):** Revise la seguridad. ¿Qué **OAuth scopes** se necesitan en el manifiesto de Apps Script (`appsscript.json`) para que `ScriptApp.getIdentityToken()` y el acceso a Secret Manager funcionen? ¿Cómo garantizamos que la llave secreta se maneje de forma segura en el entorno de Apps Script?
