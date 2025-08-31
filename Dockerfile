# Usa una imagen base oficial de Node.js Alpine, segura y minimalista
FROM node:18-alpine

# Instala todas las dependencias del sistema: git, curl, jq, y ttyd (terminal web)
RUN apk add --no-cache git curl jq ttyd tini

# Crea un usuario y grupo no-root para ejecutar la aplicación
RUN addgroup -S nexus && adduser -S nexus -G nexus

# Crea el directorio de la aplicación y establece la propiedad
WORKDIR /home/nexus/app
RUN chown -R nexus:nexus /home/nexus/app

# Cambia al usuario no-root
USER nexus

# Copia los archivos de definición de paquetes y instala las dependencias de Node.js
COPY --chown=nexus:nexus package*.json ./
RUN npm ci --only=production

# Copia el código fuente y el entrypoint
COPY --chown=nexus:nexus . .
COPY --chown=nexus:nexus entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expone los puertos: 3000 para el Nexus API y 7681 para la terminal web ttyd
EXPOSE 3000 7681

# Usa tini para manejar procesos zombis y define el punto de entrada
ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/entrypoint.sh"]
