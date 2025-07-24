#!/bin/bash

# Script pour créer un package d'installation de SYA
# Ce script compile l'application et crée un package prêt à l'emploi

echo "📦 Création du package SYA..."

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

# Créer le dossier de package
PACKAGE_DIR="sya-package-$(date +%Y%m%d-%H%M%S)"
print_status "Création du dossier de package: $PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

# Compiler l'API Rust
print_status "Compilation de l'API Rust..."
cd apps/api
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sya_db" cargo build --release

if [ $? -ne 0 ]; then
    print_error "Échec de la compilation de l'API Rust"
    exit 1
fi

print_success "API Rust compilée"

# Copier l'exécutable de l'API
print_status "Copie de l'exécutable de l'API..."
cp target/release/api "../../$PACKAGE_DIR/sya-api"
cd ../..

# Installer les dépendances du frontend
print_status "Installation des dépendances du frontend..."
cd apps/web
npm install --production

if [ $? -ne 0 ]; then
    print_error "Échec de l'installation des dépendances du frontend"
    exit 1
fi

# Build du frontend
print_status "Build du frontend..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Échec du build du frontend"
    exit 1
fi

print_success "Frontend buildé"

# Copier le frontend buildé
print_status "Copie du frontend..."
cp -r .next "../../$PACKAGE_DIR/frontend"
cp package.json "../../$PACKAGE_DIR/"
cd ../..

# Copier les fichiers de configuration
print_status "Copie des fichiers de configuration..."
cp docker-compose.yml "$PACKAGE_DIR/"
cp docker-compose.dev.yml "$PACKAGE_DIR/"
cp start-sya.sh "$PACKAGE_DIR/"
cp stop-sya.sh "$PACKAGE_DIR/"
cp README.md "$PACKAGE_DIR/"

# Créer un script de démarrage pour le package
cat > "$PACKAGE_DIR/run-sya.sh" << 'EOF'
#!/bin/bash

# Script de démarrage pour le package SYA
# Ce script démarre l'application à partir du package

echo "🚀 Démarrage de SYA depuis le package..."

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Créer les dossiers de données
print_status "Création des dossiers de données..."
mkdir -p data/ollama
mkdir -p data/db

# Démarrer PostgreSQL et Ollama
print_status "Démarrage des services Docker..."
docker-compose up -d postgres ollama

# Attendre que PostgreSQL soit prêt
print_status "Attente que PostgreSQL soit prêt..."
sleep 15

# Démarrer l'API Rust
print_status "Démarrage de l'API Rust..."
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sya_db" ./sya-api &
API_PID=$!

# Attendre que l'API soit prête
sleep 5

# Démarrer le frontend
print_status "Démarrage du frontend..."
cd frontend
npm start &
WEB_PID=$!

# Sauvegarder les PIDs
echo $API_PID > /tmp/sya-api.pid
echo $WEB_PID > /tmp/sya-web.pid

print_success "SYA est maintenant en cours d'exécution !"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 API: http://localhost:3001"
echo ""
echo "⚠️  Pour arrêter: ./stop-sya.sh"
EOF

chmod +x "$PACKAGE_DIR/run-sya.sh"

# Créer un fichier README pour le package
cat > "$PACKAGE_DIR/README-PACKAGE.md" << 'EOF'
# SYA - Package d'installation

Ce package contient une version compilée de SYA prête à l'emploi.

## Prérequis

- Docker et docker-compose installés
- Node.js 18+ installé

## Installation

1. Décompressez le package
2. Ouvrez un terminal dans le dossier
3. Exécutez: `./run-sya.sh`

## Utilisation

- **Démarrer**: `./run-sya.sh`
- **Arrêter**: `./stop-sya.sh`
- **Redémarrer**: `./stop-sya.sh && ./run-sya.sh`

## Services

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **Base de données**: localhost:5432
- **Ollama**: http://localhost:11434

## Structure du package

```
sya-package/
├── sya-api              # Exécutable de l'API Rust
├── frontend/            # Frontend Next.js buildé
├── docker-compose.yml   # Configuration Docker
├── run-sya.sh          # Script de démarrage
├── stop-sya.sh         # Script d'arrêt
└── README-PACKAGE.md   # Ce fichier
```

## Première utilisation

1. Créez un compte via http://localhost:3000/register
2. Connectez-vous via http://localhost:3000/login
3. Commencez à utiliser l'application !

## Support

Pour toute question ou problème, consultez le README principal ou ouvrez une issue sur GitHub.
EOF

# Créer un fichier .tar.gz du package
print_status "Création de l'archive..."
tar -czf "$PACKAGE_DIR.tar.gz" "$PACKAGE_DIR"

print_success "Package créé avec succès !"
echo ""
echo "📦 Package: $PACKAGE_DIR.tar.gz"
echo "📁 Dossier: $PACKAGE_DIR"
echo ""
echo "🚀 Pour utiliser le package:"
echo "  1. tar -xzf $PACKAGE_DIR.tar.gz"
echo "  2. cd $PACKAGE_DIR"
echo "  3. ./run-sya.sh"
echo ""
echo "✅ Le package est prêt à être distribué !" 