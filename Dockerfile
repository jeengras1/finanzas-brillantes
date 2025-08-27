# F2.DUV-035 · Proto-Nexus · Dockerfile
# Construcción de PocketBase sobre Fly.io bajo principios de Costo Cero

# Imagen base ligera, gratuita y mantenida
FROM debian:bullseye-slim

# Definimos la versión de PocketBase a instalar
ENV PB_VERSION=0.22.14

# Instalamos dependencias mínimas y descargamos PocketBase
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates unzip \
    && rm -rf /var/lib/apt/lists/* \
    \
    && curl -L -o /tmp/pb.zip "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" \
    && unzip /tmp/pb.zip -d /pb \
    && rm /tmp/pb.zip \
    \
    # Crear usuario sin privilegios para seguridad de costo cero
    && useradd --system --user-group --shell /bin/false nonroot

# Crear directorio de datos y asignar permisos
RUN mkdir -p /pb/pb_data && chown -R nonroot:nonroot /pb

# Cambiar a usuario no root
USER nonroot

# Directorio de trabajo
WORKDIR /pb

# Puerto de PocketBase
EXPOSE 8090

# Comando de inicio
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
