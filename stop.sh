#!/bin/bash

# SYA - Script d'arrêt

set -e

echo "🛑 Arrêt de SYA - Simplify Your Assistant"
echo "=========================================="

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_status "Arrêt des services Docker..."
docker-compose down

print_success "SYA a été arrêté avec succès !"
echo ""
echo "📋 Pour redémarrer : ./start.sh"
echo "🗑️  Pour supprimer les données : docker-compose down -v" 