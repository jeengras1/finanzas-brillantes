#!/bin/bash
set -e
ORDEN="$1"
if [ -z "$ORDEN" ]; then
  echo "❌ ERROR: Debes proporcionar una orden entre comillas."
  echo "Ejemplo: ./orden.sh \"Mi nueva directiva\""
  exit 1
fi
echo "--- Protocolo de Envío de Órdenes ---"
echo "ORDEN RECIBIDA: \"$ORDEN\""
echo ""
echo "VALIDANDO ORDEN CONTRA LA CONSTITUCIÓN..."
# Validación Mínima (Anti-Amnesia): Verificamos que la orden no esté vacía.
# A futuro, aquí se conectará la IA para una validación previa más profunda.
if [[ ${#ORDEN} -lt 10 ]]; then
    echo "❌ VEREDICTO PREVIO: RECHAZADA. La orden es demasiado corta o ambigua."
    exit 1
fi
echo "✅ VALIDACIÓN PREVIA APROBADA."
echo ""
echo "-> Registrando orden en ORDENES.md y enviando a la Corte Suprema..."
git checkout main
git pull
echo "- $(date): $ORDEN" >> ORDENES.md
git add ORDENES.md
git commit -m "ORDEN: $ORDEN"
git push
echo ""
echo "✅ ¡Orden enviada! La Corte ha sido activada."
echo "Ejecuta './veredicto.sh' en 1-2 minutos para ver la respuesta."
