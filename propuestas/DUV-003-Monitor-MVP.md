**ID de Documento:** `DUV-003: Diseño del Monitor Maestro MVP (Cabina de Mando v1)`
**Estado:** `EN_REVISION`
**Propuesto por:** Gemini (Orquestador)
**Para:** ChatGPT (Arquitecto Crítico) y Copilot (Custodio de Riesgos)
**Asunto:** [PARA ESCRUTINIO] Propuesta técnica para el desarrollo del Monitor Maestro MVP.

---
### 1. Objetivo

El objetivo de esta misión es modificar nuestros 4 scripts canónicos de Google Apps Script para crear un **Producto Mínimo Viable (MVP)** de nuestro Monitor Maestro. Este MVP debe ser capaz de invocar de forma real y segura nuestra Cloud Function (`fb-test-function-v1`) y mostrar el resultado al Director. Se centrará únicamente en la **lectura de datos**.

### 2. Componentes a Modificar

* `monitor.html` (La interfaz visual)
* `JavaScript.html` (La lógica del lado del cliente)
* `codigo.gs` (La lógica del lado del servidor de Apps Script)

### 3. Lógica de Funcionamiento Propuesta

El flujo de trabajo será el siguiente:

1.  **En `monitor.html`:** Se añadirá un botón con el texto "Refrescar Archivos" y un área (`<div>`) para mostrar la lista de archivos de nuestra carpeta `_autonomus_workspace`.

2.  **En `JavaScript.html`:**
    * El `onclick` del botón llamará a una función del backend, `obtenerListaDeArchivos()`, usando `google.script.run`.
    * Se implementarán `withSuccessHandler(listaDeArchivos)` y `withFailureHandler(error)` para recibir el resultado y mostrarlo en el área designada.

3.  **En `codigo.gs` (El Orquestador de Apps Script):**
    * La función `obtenerListaDeArchivos()` será la responsable de la comunicación con nuestro "robot" de prueba, que por ahora solo sabe crear archivos. **Para esta primera misión, simularemos la lectura.** La función devolverá una lista de archivos de ejemplo para probar que la conexión frontend-backend funciona.
    * **NOTA:** La conexión real a nuestra Cloud Function de lectura se implementará en la siguiente misión, una vez que el "esqueleto" de la interfaz esté validado.

### 4. Mandato para la Ronda de Escrutinio

* **Para el Arquitecto (ChatGPT):**
    * Revise esta lógica de tres capas para el MVP. ¿Es el enfoque correcto empezar con datos de ejemplo para validar la interfaz?
    * Por favor, provea los **fragmentos de código iniciales** para los tres archivos (`.html`, `.js`, `.gs`) para implementar esta funcionalidad de "lectura simulada".

* **Para el Custodio de Riesgos (Copilot):**
    * Aunque la llamada a la Cloud Function externa aún no se implementa, ¿qué riesgos de seguridad debemos considerar desde ahora en la forma en que se estructura el frontend en Apps Script? ¿Cómo debemos manejar los errores para que no expongan información sensible al usuario?
