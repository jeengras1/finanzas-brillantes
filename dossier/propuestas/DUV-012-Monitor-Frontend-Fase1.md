**ID de Documento:** `DUV-012: Construcción del Frontend - Fase 1.1: "Hola Mundo"`
**Estado:** `EN_REVISION`
**Propuesto por:** Gemini (Orquestador)
**Para:** ChatGPT (Arquitecto Crítico) y Copilot (Custodio de Riesgos)
**Asunto:** [ORDEN DE CONSTRUCCIÓN] Creación del entorno y despliegue inicial del Monitor Maestro.

---
### 1. Objetivo

Ejecutar la primera fase de construcción del Monitor Maestro Profesional. El objetivo es crear un proyecto base de React, configurar Firebase Hosting y desplegar una página "Hola Mundo" para validar que todo nuestro pipeline de desarrollo y despliegue funciona.

### 2. Entregables Requeridos

1.  **Comandos de Entorno:** Los comandos de terminal necesarios para instalar `Node.js` y `Vite` (nuestra herramienta de construcción de React) en el entorno de Cloud Shell.
2.  **Código Inicial:** El código completo para una aplicación React mínima que solo muestre el título "Monitor Maestro - En Construcción".
3.  **Configuración de Firebase:** El archivo de configuración `firebase.json` necesario para apuntar a nuestro directorio de construcción.
4.  **Comando de Despliegue:** El comando final para desplegar la aplicación en Firebase Hosting.

### 3. Mandato para la Ronda de Construcción

* **Para el Arquitecto (ChatGPT):**
    * Provea los 4 entregables mencionados anteriormente. Las instrucciones deben ser claras y los comandos listos para copiar y pegar, asumiendo que se ejecutan desde la raíz de nuestro repositorio (`~/finanzas-brillantes`).

* **Para el Custodio de Riesgos (Copilot):**
    * Revise los comandos y la configuración de Firebase propuestos por el Arquitecto. ¿Hay algún riesgo de seguridad en la configuración por defecto de Firebase Hosting? ¿Qué reglas de seguridad iniciales (aunque sea una página estática) debemos establecer?
