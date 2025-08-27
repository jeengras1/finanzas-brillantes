# ===============================
# Dockerfile para PocketBase en Render (Free Tier)
# Versión: F2.DOCKER.PB.R1
# ===============================

# Imagen base mínima y gratuita
FROM alpine:3.20

# Establecer variables de entorno
ENV PB_VERSION=0.22.14

# Crear usuario no root por seguridad
RUN addgroup -S pbgroup && adduser -S pbuser -G pbgroup

# Instalar dependencias necesarias y descargar PocketBase
RUN apk add --no-cache curl unzip \
    && curl -L -o /tmp/pb.zip "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" \
    && unzip /tmp/pb.zip -d /pb \
    && rm /tmp/pb.zip

# Crear directorio de datos con permisos adecuados
RUN mkdir -p /pb/pb_data && chown -R pbuser:pbgroup /pb /pb/pb_data

# Cambiar a usuario no privilegiado
USER pbuser

# Directorio de trabajo
WORKDIR /pb

# Exponer el puerto por defecto de PocketBase
EXPOSE 8090

# Definir el comando de inicio
CMD ["./pocketbase", "serve", "--http", "0.0.0.0:8090", "--dir", "/pb/pb_data"]
