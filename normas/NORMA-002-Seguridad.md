# NORMA-002: De la Seguridad Operativa

**1. Propósito:** Establecer los protocolos para proteger secretos, controlar accesos y garantizar despliegues seguros.
**2. Manejo de Secretos:** Queda prohibido almacenar secretos en el repositorio. Deben gestionarse vía Google Secret Manager. Todo acceso a secretos debe ser registrado.
**3. Roles de Acceso (IAM):** El acceso se rige por el principio de mínimo privilegio, según los roles definidos en la Ley Tercera. Los permisos serán auditados semanalmente.
**4. Seguridad en Despliegues:** Todo despliegue debe realizarse por script y requerir validación previa de al menos dos miembros del consorcio.
