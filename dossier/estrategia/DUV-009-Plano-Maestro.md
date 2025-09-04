**ID de Documento:** `DUV-009: Plano Maestro Fundacional`
**Estado:** `BORRADOR` (Pendiente de Ratificación por el Consorcio)
**Fecha:** 13 de agosto de 2025

---
## 1. Filosofía y Principios Rectores (Las Leyes del Terreno)

* **1.1. Objetivo Final:** Alcanzar la libertad financiera a través de un sistema de gestión e inversión autónomo.
* **1.2. Principios Constitucionales:**
    * **Real, No Simulado:** Todas las operaciones y flujos de trabajo deben ser técnicamente factibles y ejecutables.
    * **Mínima Carga para el Director:** El sistema debe maximizar la autonomía, relegando al Director a un rol de supervisor y aprobador estratégico.
    * **Validación por Consorcio:** Ninguna decisión o componente crítico se implementa sin la revisión y el consenso del consorcio de IAs (Gemini, ChatGPT, Copilot).
    * **Documentación Primero:** Todo plan se documenta y se archiva antes de iniciar la construcción.

## 2. La Infraestructura Base (Los Cimientos)

* **2.1. El Terreno:** Un único proyecto en **Google Cloud Platform** (`finanzasbrillantes-prod`) alberga todos nuestros recursos en la nube.
* **2.2. La Oficina de Planos:** Un **repositorio privado en GitHub** (`jeengras1/finanzas-brillantes`) actúa como nuestra única fuente de verdad para el código, la documentación y las decisiones.
* **2.3. La Memoria Central:** Una base de datos **Firestore** actúa como el cerebro persistente del sistema, curando la amnesia.
* **2.4. Los Agentes Autónomos:** Un conjunto de funciones "serverless" (Cloud Functions/Run) que actúan como nuestros "robots" trabajadores.

## 3. Arquitectura del Sistema (El Edificio)

* **3.1. El Cerebro (NEXUS):** Es el agente orquestador central. No es una IA conversacional, sino un servicio de backend que recibe órdenes, las traduce en tareas, se comunica con las otras IAs y servicios vía API, y gestiona el estado de las operaciones.
* **3.2. La Cabina de Mando (Monitor Maestro):** Es la interfaz de usuario final, un **dashboard en Google Apps Script** accesible desde el iPad del Director. Es la "ventana" para visualizar el estado del sistema y el "panel de control" para dar órdenes a NEXUS.
* **3.3. Protocolo de Trabajo:** La colaboración se rige por el **Protocolo de Revisión Asíncrona (PRA)**, utilizando "Tickets de Discusión" (Issues) en GitHub, donde se presenta y debate el contenido completo de cada propuesta (`DUV`).

## 4. Plan de Construcción por Fases

* **Fase 1: La Planta Baja (MVP)**
    * **Objetivo:** Construir una "Cabina de Mando" visual e interactiva.
    * **Entregables:** Una interfaz de 3 columnas en Apps Script que pueda: 1) Enviar una orden de texto a NEXUS. 2) Recibir y mostrar la confirmación. 3) Visualizar el contenido del `inventario.json` ya guardado en GitHub.

* **Fase 2: Pisos Intermedios (Módulos de Legado e Inteligencia)**
    * **Objetivo:** Migrar la lógica del sistema antiguo y empezar a generar valor.
    * **Entregables:** 1) Robots de migración que extraen y refactorizan el código de los Módulos (`Modulo Ganancias`, etc.). 2) El Monitor Maestro integra paneles para visualizar los datos y resultados de estos módulos.

* **Fase 3: El Ático (Autonomía Avanzada)**
    * **Objetivo:** Lograr que el sistema opere de forma proactiva.
    * **Entregables:** 1) NEXUS es capaz de iniciar misiones por sí mismo basado en triggers (ej. "Generar informe diario"). 2) El consorcio de IAs puede proponer nuevas estrategias a través de NEXUS. 3) Se integran los primeros módulos de ejecución financiera (órdenes simuladas).

## 5. Mejoras Futuras y Escalabilidad (Anexos y Pisos Adicionales)

El diseño debe permanecer abierto para la expansión futura, incluyendo:
* **El Sótano (Data Warehouse):** Integración con BigQuery para análisis de datos a gran escala.
* **Anexo de I+D:** Espacio para integrar y probar nuevas IAs o modelos predictivos.
* **Anexo de Comunicaciones:** Conexión con más servicios externos (APIs de noticias, otros brokers, etc.).
