---
tipo: norma
id: NORMA-009
titulo: "Del Manejo de Secretos y Tokens por Script"
version: 1.0
estado: vigente
---
## Reglas
1.  **Custodia:** Los secretos (API Keys, Tokens) nunca deben escribirse en texto plano en el repositorio o en los logs.
2.  **Solicitud:** Los scripts deben obtener los secretos únicamente de la bóveda de GitHub Secrets.
3.  **Ciclo de Vida:** Los secretos deben ser cargados en memoria solo para su uso inmediato y descartados al finalizar la operación.
