#!/data/data/com.termux/files/usr/bin/bash

echo "🚀 CONFIGURACIÓN INTERACTIVA DE FASE 1"
echo "======================================"

# Pedir email de GitHub
read -p "📧 Ingresa tu email de GitHub: " github_email

# Pedir nombre de GitHub
read -p "👤 Ingresa tu nombre de GitHub: " github_name

# Pedir URL del repositorio
echo ""
echo "🔗 Ejemplo de URL: https://github.com/tu-usuario/tu-repositorio.git"
read -p "Ingresa la URL de tu repositorio GitHub: " repo_url

echo ""
echo "🔧 Configurando Git con tus credenciales..."
git config --global user.email "$github_email"
git config --global user.name "$github_name"

echo "📁 Inicializando repositorio local..."
cd ~/proyecto-financiero
git init
git add .
git commit -m "feat: Acta001 - Inicio oficial de construcción"

echo "🔗 Conectando a tu repositorio GitHub..."
git remote add origin "$repo_url"
git branch -M main

echo "📦 Instalando dependencias ligeras..."
pip install requests python-dotenv ccxt

echo ""
echo "✅ FASE 1 COMPLETADA"
echo "==================="
echo "• Git configurado con: $github_email / $github_name"
echo "• Repositorio conectado a: $repo_url"
echo "• Dependencias instaladas: requests, python-dotenv, ccxt"
echo ""
echo "📤 Para subir los cambios, ejecuta:"
echo "   git push -u origin main"
