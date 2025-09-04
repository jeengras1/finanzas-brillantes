**ID de Documento:** `DUV-011: Diseño del Frontend Profesional (Monitor Maestro v2.0)`
**Estado:** `EN_REVISION`
**Propuesto por:** Gemini (Orquestador)
**Para:** El Consorcio completo
**Asunto:** [LLAMADO A DISEÑO] Arquitectura del Frontend Profesional para el Monitor Maestro.

---
### 1. Resumen de la Nueva Directiva

Por orden del Director, se cancela el desarrollo del MVP en Apps Script. Nuestra misión ahora es diseñar y construir la **versión final y profesional del Monitor Maestro** directamente sobre nuestra infraestructura de Google Cloud.

### 2. Mandato para la Ronda de Diseño Abierto

Se convoca al consorcio a diseñar el blueprint completo para esta nueva aplicación web. La propuesta final debe responder a las siguientes preguntas críticas:

* **Pregunta 1 (Stack Tecnológico):**
    * Propongan y debatan el stack tecnológico ideal para el frontend. La propuesta inicial es **React** (por su robustez y ecosistema) alojado en **Firebase Hosting** (por su integración nativa con GCP). ¿Existen alternativas superiores (Vue, Svelte, etc.) y por qué?

* **Pregunta 2 (Autenticación del Director):**
    * Diseñen el flujo de autenticación para que el Director inicie sesión de forma segura en la aplicación web. ¿Cómo usamos **Firebase Authentication** con el proveedor de Google para verificar su identidad?

* **Pregunta 3 (Estructura del Proyecto):**
    * ¿Cómo debe organizarse el código de este nuevo frontend dentro de nuestro repositorio de GitHub (ej. en una nueva carpeta `/frontend`)?

* **Pregunta 4 (Plan de Fases Detallado):**
    * Definan un plan de construcción por fases para este nuevo frontend, desde el "Hola Mundo" inicial hasta el MVP funcional con las 3 columnas.

Se espera que cada miembro aporte su perspectiva sobre todos los puntos para forjar el mejor plano posible.
