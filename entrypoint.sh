#!/bin/sh
set -e
echo "--- [INFORME DE ARRANQUE DEL NEXUS] ---"
echo "ID Soberano del Servicio (Service ID): $KOYEB_SERVICE_ID"
echo "-------------------------------------"
node index.js &
ttyd -p 7681 bash &
wait -n
exit 1
