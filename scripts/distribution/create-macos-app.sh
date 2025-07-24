#!/bin/bash

# Script pour créer une application macOS native de SYA
# Ce script crée un bundle .app avec tous les services intégrés

echo "🍎 Création de l'application macOS SYA..."

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

# Vérifier si nous sommes sur macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "Ce script est conçu pour macOS uniquement"
    exit 1
fi

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Créer le bundle .app
APP_NAME="SYA.app"
APP_DIR="$APP_NAME/Contents"
print_status "Création du bundle .app: $APP_NAME"

# Créer la structure du bundle
mkdir -p "$APP_DIR/MacOS"
mkdir -p "$APP_DIR/Resources"
mkdir -p "$APP_DIR/Frameworks"

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
cp target/release/api "../../$APP_DIR/MacOS/sya-api"
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
cp -r .next "../../$APP_DIR/Resources/frontend"
cp package.json "../../$APP_DIR/Resources/"
cd ../..

# Copier les fichiers de configuration
print_status "Copie des fichiers de configuration..."
cp docker-compose.yml "$APP_DIR/Resources/"
cp docker-compose.dev.yml "$APP_DIR/Resources/"
cp start-sya.sh "$APP_DIR/Resources/"
cp stop-sya.sh "$APP_DIR/Resources/"
cp README.md "$APP_DIR/Resources/"

# Créer le script principal de l'application
cat > "$APP_DIR/MacOS/SYA" << 'EOF'
#!/bin/bash

# Script principal de l'application SYA
# Ce script démarre l'application et ouvre le navigateur

# Obtenir le chemin du bundle
BUNDLE_PATH="$(cd "$(dirname "$0")/.." && pwd)"
RESOURCES_PATH="$BUNDLE_PATH/Resources"

# Fonction pour afficher les messages
print_status() {
    echo "[SYA] $1"
}

print_error() {
    echo "[SYA ERROR] $1"
}

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé. Veuillez installer Docker d'abord."
    osascript -e 'display dialog "Docker n'\''est pas installé. Veuillez installer Docker d'\''abord." buttons {"OK"} default button "OK" with icon stop'
    exit 1
fi

# Créer les dossiers de données
print_status "Création des dossiers de données..."
mkdir -p ~/Library/Application\ Support/SYA/data/ollama
mkdir -p ~/Library/Application\ Support/SYA/data/db

# Aller dans le dossier des ressources
cd "$RESOURCES_PATH"

# Démarrer PostgreSQL et Ollama
print_status "Démarrage des services Docker..."
docker-compose up -d postgres ollama

# Attendre que PostgreSQL soit prêt
print_status "Attente que PostgreSQL soit prêt..."
sleep 15

# Démarrer l'API Rust
print_status "Démarrage de l'API Rust..."
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sya_db" "$BUNDLE_PATH/MacOS/sya-api" &
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

# Attendre que le frontend soit prêt
sleep 10

# Ouvrir le navigateur
print_status "Ouverture du navigateur..."
open http://localhost:3000

print_status "SYA est maintenant en cours d'exécution !"
print_status "Frontend: http://localhost:3000"
print_status "API: http://localhost:3001"

# Garder l'application en cours d'exécution
wait
EOF

chmod +x "$APP_DIR/MacOS/SYA"

# Créer le fichier Info.plist
cat > "$APP_DIR/Info.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>SYA</string>
    <key>CFBundleIdentifier</key>
    <string>com.sya.app</string>
    <key>CFBundleName</key>
    <string>SYA</string>
    <key>CFBundleDisplayName</key>
    <string>SYA - Simple Yet Advanced</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.15</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>LSApplicationCategoryType</key>
    <string>public.app-category.productivity</string>
    <key>CFBundleDocumentTypes</key>
    <array>
        <dict>
            <key>CFBundleTypeName</key>
            <string>SYA Document</string>
            <key>CFBundleTypeExtensions</key>
            <array>
                <string>sya</string>
            </array>
            <key>CFBundleTypeRole</key>
            <string>Viewer</string>
        </dict>
    </array>
</dict>
</plist>
EOF

# Créer le fichier PkgInfo
echo "APPL????" > "$APP_DIR/PkgInfo"

# Créer un script d'arrêt
cat > "$APP_DIR/MacOS/stop-sya" << 'EOF'
#!/bin/bash

# Script d'arrêt pour l'application SYA

echo "[SYA] Arrêt de l'application..."

# Arrêter l'API Rust
if [ -f "/tmp/sya-api.pid" ]; then
    API_PID=$(cat /tmp/sya-api.pid)
    if kill -0 $API_PID 2>/dev/null; then
        echo "[SYA] Arrêt de l'API Rust..."
        kill $API_PID
        sleep 2
        if kill -0 $API_PID 2>/dev/null; then
            kill -9 $API_PID
        fi
    fi
    rm -f /tmp/sya-api.pid
fi

# Arrêter le frontend
if [ -f "/tmp/sya-web.pid" ]; then
    WEB_PID=$(cat /tmp/sya-web.pid)
    if kill -0 $WEB_PID 2>/dev/null; then
        echo "[SYA] Arrêt du frontend..."
        kill $WEB_PID
        sleep 2
        if kill -0 $WEB_PID 2>/dev/null; then
            kill -9 $WEB_PID
        fi
    fi
    rm -f /tmp/sya-web.pid
fi

# Arrêter les conteneurs Docker
echo "[SYA] Arrêt des conteneurs Docker..."
docker-compose down

echo "[SYA] Application arrêtée"
EOF

chmod +x "$APP_DIR/MacOS/stop-sya"

# Créer un script d'installation
cat > "install-sya.sh" << 'EOF'
#!/bin/bash

# Script d'installation pour l'application SYA

echo "🍎 Installation de SYA..."

# Vérifier si nous sommes sur macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Ce script est conçu pour macOS uniquement"
    exit 1
fi

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    echo "📥 Téléchargez Docker depuis: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Copier l'application dans Applications
echo "📦 Installation de SYA.app..."
cp -R "SYA.app" "/Applications/"

# Créer un alias sur le bureau
echo "🖥️  Création d'un alias sur le bureau..."
ln -sf "/Applications/SYA.app" ~/Desktop/SYA

echo "✅ SYA a été installé avec succès !"
echo ""
echo "🚀 Pour démarrer SYA:"
echo "   - Double-cliquez sur l'icône SYA sur le bureau"
echo "   - Ou ouvrez SYA depuis le dossier Applications"
echo ""
echo "⚠️  Assurez-vous que Docker Desktop est en cours d'exécution"
EOF

chmod +x "install-sya.sh"

print_success "Application macOS créée avec succès !"
echo ""
echo "🍎 Application: $APP_NAME"
echo "📦 Script d'installation: install-sya.sh"
echo ""
echo "🚀 Pour installer l'application:"
echo "  1. ./install-sya.sh"
echo "  2. Double-cliquez sur l'icône SYA sur le bureau"
echo ""
echo "✅ L'application macOS est prête !" 