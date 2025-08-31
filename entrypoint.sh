#!/bin/sh
set -e

echo "🚀 Iniciando Contenedor Monolítico del Nexus..."

# Función para terminar procesos hijos al recibir una señal
cleanup() {
    echo "🟠 Recibida señal de terminación. Cerrando procesos..."
    kill -TERM "$NEXUS_PID" "$TTYD_PID" 2>/dev/null
    wait
    echo "🔴 Contenedor apagado."
    exit 0
}
trap cleanup SIGTERM SIGINT

# Iniciar el servidor Nexus en segundo plano
node index.js &
NEXUS_PID=$!

# Iniciar el servidor de terminal web ttyd en segundo plano
ttyd -p 7681 bash &
TTYD_PID=$!

echo "✅ Servicios iniciados (Nexus PID: $NEXUS_PID, Terminal PID: $TTYD_PID)"

# Esperar a que cualquiera de los procesos críticos termine
wait -n
echo "🔴 Error: Un proceso crítico ha terminado. Forzando apagado."
cleanup
