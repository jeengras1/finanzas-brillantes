#!/bin/bash
set -e
echo "--- Protocolo de Verificación de Veredictos (Blindado v2) ---"

# --- VERIFICACIÓN DE HERRAMIENTAS ---
echo "-> Verificando herramientas necesarias..."
if ! command -v jq &> /dev/null; then
    echo "-> Herramienta 'jq' no encontrada. Instalando..."
    sudo apt-get update && sudo apt-get install -y jq
    echo "-> 'jq' instalado."
else
    echo "-> Herramienta 'jq' ya está disponible."
fi

# --- PROTOCOLO DE VERIFICACIÓN ---
echo "-> Sincronizando con la Oficina Central..."
git pull
ULTIMO_COMMIT_SHA=$(git log -1 --pretty=format:%H -- ORDENES.md 2>/dev/null)

if [ -z "$ULTIMO_COMMIT_SHA" ]; then
    echo "-> No se encontraron órdenes recientes en el historial."
    exit 0
fi

echo "-> Buscando veredicto para la última orden (Commit ${ULTIMO_COMMIT_SHA:0:7})..."
# Usamos gh api con error handling para que no falle si no hay comentarios
COMENTARIOS=$(gh api "repos/{owner}/{repo}/commits/${ULTIMO_COMMIT_SHA}/comments" --jq '.[].body' 2>/dev/null || true)

if [ -z "$COMENTARIOS" ]; then
    echo "-> ⏳ Aún no hay un veredicto. La Corte Suprema podría estar procesando la orden, o la ejecución falló."
    echo "-> Puedes revisar el estado de la ejecución en la pestaña 'Actions' de GitHub."
else
    echo "========================================="
    echo "✅ VEREDICTO DE LA CORTE SUPREMA:"
    echo "$COMENTARIOS"
    echo "========================================="
fi
