#!/bin/bash
set -e
ID=$1
TITULO=$2
FECHA=$(date +%Y-%m-%d)
if [ -z "$ID" ] || [ -z "$TITULO" ]; then echo "Uso: ./crear-ley.sh LEY-XX \"Título de la Ley\""; exit 1; fi
ARCHIVO="dossier/constitucion/$ID-$(echo "$TITULO" | tr '[:upper:]' '[:lower:]' | tr ' ' '-').md"
sed -e "s/{{FECHA}}/$FECHA/g" -e "s/LEY-XX/$ID/g" -e "s/Título de la Nueva Ley/$TITULO/g" dossier/_plantillas/NUEVA_LEY.md > "$ARCHIVO"
echo "✅ Ley creada en: $ARCHIVO"
