#!/bin/sh
set -e
echo "🚀 Iniciando Contenedor Monolítico del Nexus..."
node index.js &
NEXUS_PID=$!
ttyd -p 7681 bash &
TTYD_PID=$!
echo "✅ Servicios iniciados (Nexus PID: $NEXUS_PID, Terminal PID: $TTYD_PID)"
wait -n
echo "🔴 Error: Un proceso crítico ha terminado. Forzando apagado."
kill -TERM "$NEXUS_PID" "$TTYD_PID" 2>/dev/null
wait
exit 1
