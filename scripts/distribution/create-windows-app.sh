#!/bin/bash

# Script pour créer une application Windows complète de SYA
# Ce script crée un dossier avec tous les fichiers nécessaires et un exécutable

echo "🪟 Création de l'application Windows SYA..."

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

# Créer le dossier de l'application Windows
APP_NAME="SYA-Windows"
APP_DIR="$APP_NAME"
print_status "Création du dossier de l'application: $APP_DIR"
mkdir -p "$APP_DIR"

# Compiler l'API Rust pour Windows
print_status "Compilation de l'API Rust pour Windows..."
cd apps/api

# Vérifier si rustup target est disponible
if ! rustup target list | grep -q "x86_64-pc-windows-gnu"; then
    print_status "Installation du target Windows..."
    rustup target add x86_64-pc-windows-gnu
fi

# Compiler pour Windows
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sya_db" cargo build --release --target x86_64-pc-windows-gnu

if [ $? -ne 0 ]; then
    print_error "Échec de la compilation de l'API Rust pour Windows"
    exit 1
fi

print_success "API Rust compilée pour Windows"

# Copier l'exécutable de l'API
print_status "Copie de l'exécutable de l'API..."
cp target/x86_64-pc-windows-gnu/release/api.exe "../../$APP_DIR/sya-api.exe"
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
cp -r .next "../../$APP_DIR/frontend"
cp package.json "../../$APP_DIR/"
cd ../..

# Copier les fichiers de configuration
print_status "Copie des fichiers de configuration..."
cp docker-compose.yml "$APP_DIR/"
cp docker-compose.dev.yml "$APP_DIR/"
cp start-sya.sh "$APP_DIR/"
cp stop-sya.sh "$APP_DIR/"
cp README.md "$APP_DIR/"

# Créer le script principal de l'application Windows
cat > "$APP_DIR/start-sya.bat" << 'EOF'
@echo off
chcp 65001 >nul
echo 🚀 Démarrage de SYA...

REM Vérifier si Docker est installé
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker n'est pas installé. Veuillez installer Docker d'abord.
    echo 📥 Téléchargez Docker depuis: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Créer les dossiers de données
echo 📁 Création des dossiers de données...
if not exist "data\ollama" mkdir "data\ollama"
if not exist "data\db" mkdir "data\db"

REM Démarrer PostgreSQL et Ollama
echo 🐳 Démarrage des services Docker...
docker-compose up -d db ollama

REM Attendre que PostgreSQL soit prêt
echo ⏳ Attente que PostgreSQL soit prêt...
timeout /t 15 /nobreak >nul

REM Démarrer l'API Rust
echo 🔧 Démarrage de l'API Rust...
start /B sya-api.exe

REM Attendre que l'API soit prête
timeout /t 5 /nobreak >nul

REM Démarrer le frontend
echo 🌐 Démarrage du frontend...
cd frontend
start /B npm start

REM Sauvegarder les PIDs
echo %time% > temp\api-pid.txt
echo %time% > temp\web-pid.txt

REM Attendre que le frontend soit prêt
timeout /t 10 /nobreak >nul

REM Ouvrir le navigateur
echo 🌍 Ouverture du navigateur...
start http://localhost:3000

echo ✅ SYA est maintenant en cours d'exécution !
echo 📱 Frontend: http://localhost:3000
echo 🔧 API: http://localhost:3001
echo.
echo ⚠️  Pour arrêter l'application, fermez cette fenêtre ou exécutez stop-sya.bat
echo.
pause
EOF

# Créer le script d'arrêt
cat > "$APP_DIR/stop-sya.bat" << 'EOF'
@echo off
chcp 65001 >nul
echo 🛑 Arrêt de SYA...

REM Arrêter les processus
echo 🔄 Arrêt des processus...
taskkill /f /im sya-api.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1

REM Arrêter les conteneurs Docker
echo 🐳 Arrêt des conteneurs Docker...
docker-compose down

echo ✅ SYA a été arrêté avec succès !
echo.
echo 📋 Services arrêtés:
echo   - API Rust
echo   - Frontend Next.js
echo   - PostgreSQL
echo   - Ollama
echo.
echo 🚀 Pour redémarrer: start-sya.bat
pause
EOF

# Créer un script d'installation
cat > "$APP_DIR/install-sya.bat" << 'EOF'
@echo off
chcp 65001 >nul
echo 📦 Installation de SYA...

REM Vérifier si Docker est installé
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker n'est pas installé. Veuillez installer Docker d'abord.
    echo 📥 Téléchargez Docker depuis: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Créer un raccourci sur le bureau
echo 🖥️  Création d'un raccourci sur le bureau...
powershell "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\SYA.lnk'); $Shortcut.TargetPath = '%~dp0start-sya.bat'; $Shortcut.WorkingDirectory = '%~dp0'; $Shortcut.Save()"

echo ✅ SYA a été installé avec succès !
echo.
echo 🚀 Pour démarrer SYA:
echo   - Double-cliquez sur l'icône SYA sur le bureau
echo   - Ou exécutez start-sya.bat dans ce dossier
echo.
echo ⚠️  Assurez-vous que Docker Desktop est en cours d'exécution
pause
EOF

# Créer un fichier README pour Windows
cat > "$APP_DIR/README-WINDOWS.md" << 'EOF'
# SYA - Application Windows

Ce dossier contient une version complète de SYA pour Windows.

## Prérequis

- **Docker Desktop** : [Télécharger](https://www.docker.com/products/docker-desktop)
- **Windows 10/11** (64-bit)

## Installation

1. **Installer Docker Desktop** et le démarrer
2. **Exécuter** `install-sya.bat` pour créer un raccourci sur le bureau
3. **Double-cliquer** sur l'icône SYA sur le bureau pour démarrer

## Utilisation

### Démarrage rapide
- Double-cliquez sur `start-sya.bat`
- Ou double-cliquez sur l'icône SYA sur le bureau

### Arrêt
- Fermez la fenêtre de l'application
- Ou exécutez `stop-sya.bat`

### Redémarrage
- Exécutez `stop-sya.bat` puis `start-sya.bat`

## Services

- **Frontend** : http://localhost:3000
- **API** : http://localhost:3001
- **Base de données** : localhost:5432
- **Ollama** : http://localhost:11434

## Première utilisation

1. Créez un compte via http://localhost:3000/register
2. Connectez-vous via http://localhost:3000/login
3. Commencez à utiliser l'application !

## Dépannage

### Docker n'est pas démarré
- Ouvrez Docker Desktop
- Attendez que Docker soit prêt (icône verte)

### Ports déjà utilisés
- Fermez les autres applications qui utilisent les ports 3000, 3001, 5432, 11434
- Ou redémarrez votre ordinateur

### Erreur de permission
- Exécutez en tant qu'administrateur
- Ou désactivez temporairement l'antivirus

## Structure du dossier

```
SYA-Windows/
├── sya-api.exe           # Exécutable de l'API Rust
├── frontend/             # Frontend Next.js buildé
├── docker-compose.yml    # Configuration Docker
├── start-sya.bat         # Script de démarrage
├── stop-sya.bat          # Script d'arrêt
├── install-sya.bat       # Script d'installation
└── README-WINDOWS.md     # Ce fichier
```

## Support

Pour toute question ou problème :
- Consultez le README principal
- Ouvrez une issue sur GitHub
- Vérifiez que Docker Desktop fonctionne

---

**Bonne utilisation de SYA ! 🚀**
EOF

# Créer un dossier temp pour les PIDs
mkdir -p "$APP_DIR/temp"

# Créer un script de vérification
cat > "$APP_DIR/check-status.bat" << 'EOF'
@echo off
chcp 65001 >nul
echo 🔍 Vérification du statut de SYA...
echo.

echo 📊 Services Docker:
docker-compose ps
echo.

echo 🌐 Test de l'API:
curl -s http://localhost:3001/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ API Rust: En cours d'exécution
) else (
    echo ❌ API Rust: Arrêtée
)

echo 🌍 Test du frontend:
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend: En cours d'exécution
) else (
    echo ❌ Frontend: Arrêté
)

echo 🗄️  Test de la base de données:
docker-compose exec db pg_isready -U postgres >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Base de données: En cours d'exécution
) else (
    echo ❌ Base de données: Arrêtée
)

echo 🤖 Test d'Ollama:
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Ollama: En cours d'exécution
) else (
    echo ❌ Ollama: Arrêté
)

echo.
echo 📋 URLs:
echo   Frontend: http://localhost:3000
echo   API: http://localhost:3001
echo   Ollama: http://localhost:11434
echo.
pause
EOF

# Créer un script de nettoyage
cat > "$APP_DIR/clean-sya.bat" << 'EOF'
@echo off
chcp 65001 >nul
echo 🧹 Nettoyage de SYA...

echo 🛑 Arrêt des services...
call stop-sya.bat

echo 🗑️  Suppression des données...
if exist "data" rmdir /s /q "data"

echo 🐳 Nettoyage Docker...
docker-compose down -v
docker system prune -f

echo ✅ Nettoyage terminé !
echo.
echo 📝 Toutes les données ont été supprimées.
echo 🚀 Pour redémarrer: start-sya.bat
pause
EOF

# Créer un fichier .zip de l'application
print_status "Création de l'archive..."
zip -r "$APP_DIR.zip" "$APP_DIR"

print_success "Application Windows créée avec succès !"
echo ""
echo "🪟 Application: $APP_DIR"
echo "📦 Archive: $APP_DIR.zip"
echo ""
echo "🚀 Pour distribuer l'application:"
echo "  1. Partagez le fichier $APP_DIR.zip"
echo "  2. Les utilisateurs décompressent et exécutent install-sya.bat"
echo "  3. Ils double-cliquent sur l'icône SYA sur le bureau"
echo ""
echo "✅ L'application Windows est prête !" 