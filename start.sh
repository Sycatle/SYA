#!/bin/bash

# SYA - Simplify Your Assistant
# Script de démarrage automatique

set -e

echo "🚀 Démarrage de SYA - Simplify Your Assistant"
echo "=============================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
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

# Vérifier les prérequis
print_status "Vérification des prérequis..."

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé. Veuillez l'installer depuis https://www.docker.com/"
    exit 1
fi

# Vérifier Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose n'est pas disponible. Veuillez l'installer."
    exit 1
fi

# Vérifier pnpm (optionnel)
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm n'est pas installé. Installation automatique..."
    npm install -g pnpm
fi

print_success "Tous les prérequis sont satisfaits !"

# Créer les dossiers de données si ils n'existent pas
print_status "Création des dossiers de données..."
mkdir -p data/ollama
mkdir -p data/db

# Installer les dépendances
print_status "Installation des dépendances..."
pnpm install

# Démarrer les services
print_status "Démarrage des services..."
docker-compose up --build -d

# Attendre que les services soient prêts
print_status "Attente du démarrage des services..."
sleep 15

# Vérifier que les services sont en cours d'exécution
print_status "Vérification des services..."

if docker-compose ps | grep -q "Up"; then
    print_success "Tous les services sont démarrés !"
else
    print_error "Certains services n'ont pas démarré correctement."
    print_status "Logs des services :"
    docker-compose logs
    exit 1
fi

# Afficher les URLs
echo ""
echo "🎉 SYA est maintenant prêt !"
echo "=========================="
echo ""
echo "📱 Interface web : http://localhost:3000"
echo "🔧 API backend  : http://localhost:3001"
echo "🗄️  Base de données : localhost:5432"
echo "🤖 Ollama LLM   : http://localhost:11434"
echo ""
echo "📋 Première utilisation :"
echo "  1. Ouvrez http://localhost:3000"
echo "  2. Créez un compte avec votre email"
echo "  3. Connectez-vous et commencez à discuter !"
echo "  4. Téléchargez un modèle via l'interface (ex: llama3)"
echo ""
echo "📋 Commandes utiles :"
echo "  • Voir les logs : docker-compose logs -f"
echo "  • Arrêter SYA  : ./stop.sh"
echo "  • Redémarrer   : docker-compose restart"
echo ""
echo "🔒 Sécurité :"
echo "  • Toutes les données restent sur votre machine"
echo "  • Aucune connexion internet requise"
echo "  • Assistant IA 100% local"
echo ""
print_success "Bon assistant ! 🤖" 