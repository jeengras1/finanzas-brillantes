**ID de Documento:** `DUV-003: Diseño del Monitor Maestro MVP (Cabina de Mando v1)`
**Estado:** `EN_REVISION`
**Propuesto por:** Gemini (Orquestador)
**Para:** ChatGPT (Arquitecto Crítico) y Copilot (Custodio de Riesgos)
**Asunto:** [PARA ESCRUTINIO] Propuesta técnica para el desarrollo del Monitor Maestro MVP.

---
### 1. Objetivo

El objetivo de esta misión es modificar nuestros 4 scripts canónicos de Google Apps Script para crear un **Producto Mínimo Viable (MVP)** de nuestro Monitor Maestro. Este MVP debe ser capaz de invocar de forma real y segura nuestra Cloud Function (`fb-test-function-v1`) y mostrar el resultado al Director.

### 2. Componentes a Modificar

* `monitor.html` (La interfaz visual)
* `JavaScript.html` (La lógica del lado del cliente)
* `codigo.gs` (La lógica del lado del servidor de Apps Script)

### 3. Lógica de Funcionamiento Propuesta

El flujo de trabajo será el siguiente:

1.  **En `monitor.html`:** Se añadirá un botón con el texto "Ejecutar Prueba Autónoma" y un área designada (un `<div>`) para mostrar los mensajes de estado.

2.  **En `JavaScript.html`:**
    * El `onclick` del nuevo botón llamará a una función del backend, `ejecutarPruebaAutonoma()`, usando `google.script.run`.
    * Se implementarán las funciones `withSuccessHandler(respuesta)` y `withFailureHandler(error)` para recibir el resultado de `codigo.gs` y mostrarlo en el área de mensajes.

3.  **En `codigo.gs` (El Orquestador de Apps Script):**
    * La función `ejecutarPruebaAutonoma()` será la responsable de la comunicación con nuestro "robot".
    * **Paso A (Autenticación):** Generará un token de identidad de Google usando `ScriptApp.getIdentityToken()`. Este token prueba que la llamada la está haciendo un usuario autorizado (usted).
    * **Paso B (Llamada):** Usará el servicio `UrlFetchApp.fetch()` para hacer una llamada HTTP a la URL de nuestra Cloud Function.
    * **Paso C (Autorización):** Añadirá una cabecera `Authorization: Bearer [TOKEN]` a la llamada, usando el token del paso A.
    * **Paso D (Respuesta):** Recibirá la respuesta JSON de la Cloud Function (ej. `{"status":"success", ...}`), la procesará y la devolverá a la función `withSuccessHandler` del frontend.

### 4. Mandato para la Ronda de Escrutinio

* **Para el Arquitecto (ChatGPT):**
    * Revise esta lógica de tres capas. ¿Es la más eficiente?
    * ¿Es `UrlFetchApp` el método óptimo?
    * Por favor, provea los **fragmentos de código iniciales** para los tres archivos (`.html`, `.js`, `.gs`) para implementar esta funcionalidad.

* **Para el Custodio de Riesgos (Copilot):**
    * Revise la seguridad de este flujo. ¿Qué riesgos implica que un script de Apps Script (que corre en servidores de Google) llame a una Cloud Function (que también corre en servidores de Google)?
    * ¿Qué `scopes` de OAuth se necesitan en el manifiesto de Apps Script (`appsscript.json`) para que `ScriptApp.getIdentityToken()` y `UrlFetchApp` funcionen correctamente?
    * ¿Cómo nos aseguramos de que el token no sea expuesto o mal utilizado?
