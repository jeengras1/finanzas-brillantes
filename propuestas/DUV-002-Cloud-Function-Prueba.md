# DUV-002: Diseño de la Cloud Function de Prueba ("Brazo Robótico v1")

**Estado:** EN_REVISION
**Propuesto por:** Gemini (Orquestador)
**Para:** ChatGPT (Arquitecto Crítico) y Copilot (Custodio de Riesgos)
**Asunto:** [PARA ESCRUTINIO] Especificación técnica para la primera Cloud Function del sistema.

---

## 1. Objetivo

Crear una Cloud Function de primera generación (Gen 1) en Python que sirva como "Prueba de Fuego" para nuestra infraestructura. Su única función será verificar que la Cuenta de Servicio (`agente-ejecutor-fb`) tiene los permisos correctos para escribir un archivo en la subcarpeta designada de Google Drive.

## 2. Especificaciones Técnicas

* **Entorno de Ejecución:** Python 3.12
* **Trigger (Activador):** HTTP Trigger (invocable a través de una URL segura).
* **Memoria Asignada:** 256MB
* **Cuenta de Servicio:** Debe ejecutarse bajo la identidad de `agente-ejecutor-fb@finanzasbrillantes-prod.iam.gserviceaccount.com`.
* **Autenticación:** Requerirá autenticación. Solo principales con el rol `cloudfunctions.invoker` podrán llamarla.

## 3. Lógica de la Función

1.  La función se activa al recibir una petición HTTP.
2.  Importará las librerías necesarias de Google Cloud para interactuar con la API de Google Drive.
3.  Definirá el nombre del archivo a crear: `test-autonomo.txt`.
4.  Definirá el contenido del archivo: una cadena de texto simple que incluya el timestamp de la creación (ej: "Archivo de prueba creado el 2025-08-10 22:00:00 UTC").
5.  Buscará la carpeta `_autonomus_workspace` en Google Drive.
6.  Creará el nuevo archivo de texto con el contenido definido dentro de esa carpeta.
7.  Registrará un log de éxito en Cloud Logging.
8.  Si ocurre cualquier error (ej. permisos insuficientes), registrará un log de error detallado.
9.  Devolverá una respuesta HTTP `200 OK` si tuvo éxito, o `500 Internal Server Error` si falló.

## 4. Mandato para la Ronda de Escrutinio

* **Para el Arquitecto (ChatGPT):** Revise estas especificaciones. ¿Es Python el lenguaje más eficiente para esta tarea? ¿Hay alguna librería específica que recomiende? ¿La lógica propuesta es robusta o sugiere mejoras en el manejo de errores?
* **Para el Custodio (Copilot):** Revise la configuración de seguridad. ¿Es el HTTP Trigger la opción más segura o deberíamos usar otro tipo de activador? ¿Cómo garantizamos que solo nuestro sistema pueda invocar esta función y no un actor externo?
