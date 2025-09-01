FROM node:18-alpine
RUN apk add --no-cache git curl jq tini ttyd
RUN addgroup -S nexus && adduser -S nexus -G nexus
WORKDIR /home/nexus/app
RUN chown -R nexus:nexus /home/nexus/app
USER nexus
COPY --chown=nexus:nexus package*.json ./
RUN npm ci --only=production
COPY --chown=nexus:nexus . .
COPY --chown=nexus:nexus entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
EXPOSE 3000 7681
CMD ["/sbin/tini", "--", "/usr/local/bin/entrypoint.sh"]
# --- INICIO: Instalación de la IA Soberana (Ollama) ---
# Instalar herramientas necesarias como curl y gnupg
RUN apt-get update && apt-get install -y curl gnupg

# Descargar e instalar Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh
# Descargar (pull) un modelo de IA ligero y potente.
RUN ollama pull llama3
# --- FIN: Instalación de la IA Soberana ---
