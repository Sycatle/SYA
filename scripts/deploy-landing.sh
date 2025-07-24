#!/bin/bash

# Script pour déployer le site de landing page SYA
# Ce script build et déploie le site web de présentation

echo "🌐 Déploiement du site de landing page SYA..."

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

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "docker-compose.yml" ]; then
    print_error "Ce script doit être exécuté depuis la racine du projet SYA"
    exit 1
fi

# Aller dans le répertoire du site de landing
cd apps/landing

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Installer les dépendances
print_status "Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    print_error "Échec de l'installation des dépendances"
    exit 1
fi

print_success "Dépendances installées"

# Build du site
print_status "Build du site de landing page..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Échec du build du site"
    exit 1
fi

print_success "Site buildé avec succès"

# Créer le dossier de déploiement
DEPLOY_DIR="../../deploy/landing"
print_status "Création du dossier de déploiement: $DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copier les fichiers buildés
print_status "Copie des fichiers buildés..."
cp -r out/* "$DEPLOY_DIR/"

# Créer un dossier pour les téléchargements
DOWNLOADS_DIR="$DEPLOY_DIR/downloads"
mkdir -p "$DOWNLOADS_DIR"

# Créer des fichiers de placeholder pour les téléchargements
print_status "Création des fichiers de téléchargement..."
cat > "$DOWNLOADS_DIR/SYA-Windows-Installer.zip" << 'EOF'
# Placeholder pour l'installateur Windows
# Ce fichier sera remplacé par le vrai installateur lors du déploiement
EOF

cat > "$DOWNLOADS_DIR/SYA-Windows-App.zip" << 'EOF'
# Placeholder pour l'application Windows
# Ce fichier sera remplacé par la vraie application lors du déploiement
EOF

cat > "$DOWNLOADS_DIR/SYA-macOS-App.dmg" << 'EOF'
# Placeholder pour l'application macOS
# Ce fichier sera remplacé par la vraie application lors du déploiement
EOF

cat > "$DOWNLOADS_DIR/SYA-Package-macOS.tar.gz" << 'EOF'
# Placeholder pour le package macOS
# Ce fichier sera remplacé par le vrai package lors du déploiement
EOF

cat > "$DOWNLOADS_DIR/SYA-Package-Linux.tar.gz" << 'EOF'
# Placeholder pour le package Linux
# Ce fichier sera remplacé par le vrai package lors du déploiement
EOF

cat > "$DOWNLOADS_DIR/SYA-Source.tar.gz" << 'EOF'
# Placeholder pour le code source
# Ce fichier sera remplacé par le vrai code source lors du déploiement
EOF

print_success "Fichiers de téléchargement créés"

# Créer un fichier README pour le déploiement
cat > "$DEPLOY_DIR/README.md" << 'EOF'
# Site de Landing Page SYA

Ce dossier contient le site web de présentation de SYA.

## Structure

- `index.html` - Page d'accueil
- `downloads/` - Fichiers de téléchargement
- `assets/` - Ressources statiques (CSS, JS, images)

## Déploiement

### Option 1 : GitHub Pages
1. Créez un repository GitHub
2. Uploadez le contenu de ce dossier
3. Activez GitHub Pages dans les paramètres

### Option 2 : Netlify
1. Créez un compte Netlify
2. Uploadez le contenu de ce dossier
3. Configurez le domaine personnalisé

### Option 3 : Vercel
1. Créez un compte Vercel
2. Connectez votre repository GitHub
3. Déployez automatiquement

## Mise à jour des téléchargements

Remplacez les fichiers dans `downloads/` par les vrais packages :

- `SYA-Windows-Installer.zip` - Installateur Windows
- `SYA-Windows-App.zip` - Application Windows
- `SYA-macOS-App.dmg` - Application macOS
- `SYA-Package-macOS.tar.gz` - Package macOS
- `SYA-Package-Linux.tar.gz` - Package Linux
- `SYA-Source.tar.gz` - Code source

## Configuration requise

- Serveur web (Apache, Nginx, etc.)
- Support des fichiers statiques
- Redirection des erreurs 404 vers index.html (pour le routing SPA)
EOF

print_success "README créé"

# Retourner à la racine
cd ../..

print_success "Site de landing page déployé dans: $DEPLOY_DIR"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Uploadez le contenu de $DEPLOY_DIR sur votre hébergeur"
echo "2. Configurez votre domaine (ex: sya.ai, sya.com)"
echo "3. Remplacez les fichiers de téléchargement par les vrais packages"
echo "4. Testez tous les liens de téléchargement"
echo ""
echo "🌐 URLs recommandées :"
echo "   - sya.ai"
echo "   - sya.com"
echo "   - sya.app"
echo "   - sya.dev"
echo ""
echo "📦 Packages à créer et uploader :"
echo "   - SYA-Windows-Installer.zip"
echo "   - SYA-Windows-App.zip"
echo "   - SYA-macOS-App.dmg"
echo "   - SYA-Package-macOS.tar.gz"
echo "   - SYA-Package-Linux.tar.gz"
echo "   - SYA-Source.tar.gz" 