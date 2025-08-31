#!/bin/bash
set -euo pipefail
log() { echo -e "\033[0;32m[$(date '+%H:%M:%S')]\033[0m $1"; }
info() { echo -e "\033[0;34m[INFO]\033[0m $1"; }
log "Iniciando instalación del Taller Soberano..."
log "Instalando dependencias: git, curl, jq, npm, openssh..."
sudo apt-get update -y > /dev/null 2>&1
sudo apt-get install -y git curl jq npm openssh-client > /dev/null 2>&1
log "Instalando Railway CLI..."
if ! command -v railway &> /dev/null; then
    npm install -g @railway/cli > /dev/null 2>&1
fi
REPO_URL="git@github.com:jeengras1/finanzas-brillantes.git"
INSTALL_DIR="$HOME/finanzas-brillantes"
SSH_DIR="$HOME/.ssh"
SSH_KEY="$SSH_DIR/id_ed25519_nexus"
log "Configurando SSH para GitHub..."
mkdir -p "$SSH_DIR"
chmod 700 "$SSH_DIR"
if [ ! -f "$SSH_KEY" ]; then
    ssh-keygen -t ed25519 -C "nexus-terminal@replit" -f "$SSH_KEY" -N "" > /dev/null 2>&1
    log "Nueva llave SSH generada en $SSH_KEY"
fi
if ! grep -q "Host github.com" "$SSH_DIR/config" 2>/dev/null; then
  cat >> "$SSH_DIR/config" << EOD
Host github.com
    HostName github.com
    User git
    IdentityFile 
    IdentitiesOnly yes
EOD
  chmod 600 "$SSH_DIR/config"
  log "Configuración SSH para GitHub creada."
fi
info "CLAVE PÚBLICA SSH GENERADA:"
"================================================================================"
cat "${SSH_KEY}.pub"
"================================================================================"
info "Por favor, copie la clave de arriba y añádala como Deploy Key en su repositorio de GitHub."
read -p "Presione Enter una vez que haya añadido la clave a GitHub para continuar..."
log "Clonando/actualizando la Memoria Soberana..."
if [ -d "$INSTALL_DIR" ]; then
    cd "$INSTALL_DIR" && git pull origin main
else
    git clone "$REPO_URL" "$INSTALL_DIR"
fi
info "TALLER SOBERANO CONFIGURADO EXITOSAMENTE EN REPLIT"
