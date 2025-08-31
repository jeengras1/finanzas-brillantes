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
