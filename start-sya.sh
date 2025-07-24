#!/bin/bash

# Script de démarrage pour SYA (Simple Yet Advanced)
# Ce script lance tous les services nécessaires pour faire fonctionner l'application

echo "🚀 Démarrage de SYA..."

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

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Vérifier si docker-compose est disponible
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose n'est pas installé. Veuillez installer docker-compose d'abord."
    exit 1
fi

# Créer les dossiers de données si ils n'existent pas
print_status "Création des dossiers de données..."
mkdir -p data/ollama
mkdir -p data/db

# Démarrer PostgreSQL
print_status "Démarrage de PostgreSQL..."
docker-compose up -d db

# Attendre que PostgreSQL soit prêt
print_status "Attente que PostgreSQL soit prêt..."
sleep 10

# Vérifier que PostgreSQL est en cours d'exécution
if ! docker-compose ps db | grep -q "Up"; then
    print_error "PostgreSQL n'a pas pu démarrer"
    exit 1
fi

print_success "PostgreSQL est prêt"

# Démarrer Ollama
print_status "Démarrage d'Ollama..."
docker-compose up -d ollama

# Attendre qu'Ollama soit prêt
print_status "Attente qu'Ollama soit prêt..."
sleep 15

# Vérifier qu'Ollama est en cours d'exécution
if ! docker-compose ps ollama | grep -q "Up"; then
    print_warning "Ollama n'a pas pu démarrer, mais l'application peut continuer"
else
    print_success "Ollama est prêt"
fi

# Démarrer l'API Rust
print_status "Démarrage de l'API Rust..."
cd apps/api

# Vérifier si l'exécutable existe
if [ ! -f "target/release/api" ]; then
    print_status "Compilation de l'API Rust..."
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sya_db" cargo build --release
fi

# Démarrer l'API en arrière-plan
print_status "Lancement de l'API Rust..."
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sya_db" ./target/release/api &
API_PID=$!

# Attendre que l'API soit prête
print_status "Attente que l'API soit prête..."
sleep 5

# Vérifier que l'API répond
if curl -s http://localhost:3001/api/health > /dev/null; then
    print_success "API Rust est prête"
else
    print_error "L'API Rust n'a pas pu démarrer"
    kill $API_PID 2>/dev/null
    exit 1
fi

# Démarrer le frontend Next.js
print_status "Démarrage du frontend Next.js..."
cd ../web

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    print_status "Installation des dépendances..."
    npm install
fi

# Démarrer le frontend en arrière-plan
print_status "Lancement du frontend Next.js..."
npm run dev &
WEB_PID=$!

# Attendre que le frontend soit prêt
print_status "Attente que le frontend soit prêt..."
sleep 10

# Vérifier que le frontend répond
if curl -s http://localhost:3000 > /dev/null 2>&1 || curl -s http://localhost:3001 > /dev/null 2>&1 || curl -s http://localhost:3002 > /dev/null 2>&1 || curl -s http://localhost:3003 > /dev/null 2>&1; then
    print_success "Frontend Next.js est prêt"
else
    print_warning "Le frontend peut prendre plus de temps à démarrer"
fi

# Afficher les informations de connexion
echo ""
echo "🎉 SYA est maintenant en cours d'exécution !"
echo ""
echo "📱 Frontend: http://localhost:3000 (ou 3001, 3002, 3003)"
echo "🔧 API: http://localhost:3001"
echo "🗄️  Base de données: localhost:5432"
echo "🤖 Ollama: http://localhost:11434"
echo ""
echo "📋 Commandes utiles:"
echo "  - Arrêter l'application: ./stop-sya.sh"
echo "  - Voir les logs: docker-compose logs -f"
echo "  - Redémarrer: ./stop-sya.sh && ./start-sya.sh"
echo ""
echo "⚠️  Pour arrêter l'application, utilisez: ./stop-sya.sh"
echo ""

# Sauvegarder les PIDs pour pouvoir arrêter les processus
echo $API_PID > /tmp/sya-api.pid
echo $WEB_PID > /tmp/sya-web.pid

print_success "SYA est prêt à être utilisé !" 