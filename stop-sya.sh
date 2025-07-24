#!/bin/bash

# Script d'arrêt pour SYA (Simple Yet Advanced)
# Ce script arrête tous les services proprement

echo "🛑 Arrêt de SYA..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages avec couleur
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Arrêter les processus de l'API et du frontend
print_status "Arrêt des processus..."

# Arrêter l'API Rust
if [ -f "/tmp/sya-api.pid" ]; then
    API_PID=$(cat /tmp/sya-api.pid)
    if kill -0 $API_PID 2>/dev/null; then
        print_status "Arrêt de l'API Rust (PID: $API_PID)..."
        kill $API_PID
        sleep 2
        if kill -0 $API_PID 2>/dev/null; then
            print_warning "L'API Rust ne répond pas, arrêt forcé..."
            kill -9 $API_PID
        fi
        print_success "API Rust arrêtée"
    else
        print_warning "L'API Rust n'était pas en cours d'exécution"
    fi
    rm -f /tmp/sya-api.pid
else
    print_warning "Fichier PID de l'API non trouvé"
fi

# Arrêter le frontend Next.js
if [ -f "/tmp/sya-web.pid" ]; then
    WEB_PID=$(cat /tmp/sya-web.pid)
    if kill -0 $WEB_PID 2>/dev/null; then
        print_status "Arrêt du frontend Next.js (PID: $WEB_PID)..."
        kill $WEB_PID
        sleep 2
        if kill -0 $WEB_PID 2>/dev/null; then
            print_warning "Le frontend Next.js ne répond pas, arrêt forcé..."
            kill -9 $WEB_PID
        fi
        print_success "Frontend Next.js arrêté"
    else
        print_warning "Le frontend Next.js n'était pas en cours d'exécution"
    fi
    rm -f /tmp/sya-web.pid
else
    print_warning "Fichier PID du frontend non trouvé"
fi

# Arrêter les processus Next.js restants
print_status "Nettoyage des processus Next.js..."
pkill -f "next dev" 2>/dev/null || true

# Arrêter les conteneurs Docker
print_status "Arrêt des conteneurs Docker..."
docker-compose down

print_success "SYA a été arrêté avec succès !"
echo ""
echo "📋 Services arrêtés:"
echo "  - API Rust"
echo "  - Frontend Next.js"
echo "  - PostgreSQL"
echo "  - Ollama"
echo ""
echo "🚀 Pour redémarrer: ./start-sya.sh" 