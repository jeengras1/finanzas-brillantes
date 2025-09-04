#!/bin/bash
set -e
TITULO=$1
FECHA=$(date +%Y-%m-%d)
FECHA_ID=$(date +%Y%m%d)
if [ -z "$TITULO" ]; then echo "Uso: ./crear-acta.sh \"Título del Acta\""; exit 1; fi
ARCHIVO="dossier/actas/ACTA-$FECHA_ID-$(echo "$TITULO" | tr '[:upper:]' '[:lower:]' | tr ' ' '-').md"
sed -e "s/{{FECHA}}/$FECHA/g" -e "s/{{FECHA_ID}}/$FECHA_ID/g" -e "s/Acta de la Decisión Tomada/$TITULO/g" dossier/_plantillas/NUEVA_ACTA.md > "$ARCHIVO"
echo "✅ Acta creada en: $ARCHIVO"
