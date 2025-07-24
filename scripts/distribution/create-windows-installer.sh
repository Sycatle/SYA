#!/bin/bash

# Script pour créer un installateur Windows de SYA
# Ce script crée un exécutable .exe avec un installateur

echo "🪟 Création de l'installateur Windows SYA..."

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

# Créer le dossier de l'installateur
INSTALLER_NAME="SYA-Installer"
INSTALLER_DIR="$INSTALLER_NAME"
print_status "Création du dossier de l'installateur: $INSTALLER_DIR"
mkdir -p "$INSTALLER_DIR"

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
cp target/x86_64-pc-windows-gnu/release/api.exe "../../$INSTALLER_DIR/sya-api.exe"
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
cp -r .next "../../$INSTALLER_DIR/frontend"
cp package.json "../../$INSTALLER_DIR/"
cd ../..

# Copier les fichiers de configuration
print_status "Copie des fichiers de configuration..."
cp docker-compose.yml "$INSTALLER_DIR/"
cp docker-compose.dev.yml "$INSTALLER_DIR/"

# Créer le script principal de l'application
cat > "$INSTALLER_DIR/sya-launcher.bat" << 'EOF'
@echo off
chcp 65001 >nul
title SYA - Simple Yet Advanced

REM Vérifier si Docker est installé
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERREUR: Docker n'est pas installé !
    echo.
    echo 📥 Veuillez installer Docker Desktop depuis:
    echo    https://www.docker.com/products/docker-desktop
    echo.
    echo 🔄 Après l'installation, redémarrez votre ordinateur.
    echo.
    pause
    exit /b 1
)

REM Vérifier si Docker Desktop est en cours d'exécution
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  ATTENTION: Docker Desktop n'est pas démarré !
    echo.
    echo 🚀 Veuillez démarrer Docker Desktop et réessayer.
    echo.
    pause
    exit /b 1
)

REM Créer les dossiers de données
if not exist "data\ollama" mkdir "data\ollama"
if not exist "data\db" mkdir "data\db"

echo.
echo 🚀 Démarrage de SYA...
echo.

REM Démarrer PostgreSQL et Ollama
echo 📊 Démarrage des services...
docker-compose up -d db ollama

REM Attendre que PostgreSQL soit prêt
echo ⏳ Initialisation de la base de données...
timeout /t 20 /nobreak >nul

REM Démarrer l'API Rust
echo 🔧 Démarrage de l'API...
start /B sya-api.exe

REM Attendre que l'API soit prête
timeout /t 8 /nobreak >nul

REM Démarrer le frontend
echo 🌐 Démarrage de l'interface...
cd frontend
start /B npm start

REM Attendre que le frontend soit prêt
timeout /t 15 /nobreak >nul

REM Ouvrir le navigateur
echo 🌍 Ouverture du navigateur...
start http://localhost:3000

echo.
echo ✅ SYA est maintenant en cours d'exécution !
echo.
echo 📱 Interface: http://localhost:3000
echo 🔧 API: http://localhost:3001
echo 🗄️  Base de données: localhost:5432
echo 🤖 Ollama: http://localhost:11434
echo.
echo 💡 Première utilisation:
echo    1. Créez un compte via http://localhost:3000/register
echo    2. Connectez-vous et commencez à utiliser SYA !
echo.
echo ⚠️  Pour arrêter SYA, fermez cette fenêtre.
echo.
pause
EOF

# Créer le script d'arrêt
cat > "$INSTALLER_DIR/sya-stop.bat" << 'EOF'
@echo off
chcp 65001 >nul
title SYA - Arrêt

echo.
echo 🛑 Arrêt de SYA...
echo.

REM Arrêter les processus
echo 🔄 Arrêt des processus...
taskkill /f /im sya-api.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1

REM Arrêter les conteneurs Docker
echo 🐳 Arrêt des services Docker...
docker-compose down

echo.
echo ✅ SYA a été arrêté avec succès !
echo.
echo 📋 Services arrêtés:
echo   - API Rust
echo   - Interface web
echo   - Base de données
echo   - Ollama
echo.
echo 🚀 Pour redémarrer: sya-launcher.bat
echo.
pause
EOF

# Créer le script d'installation
cat > "$INSTALLER_DIR/install-sya.bat" << 'EOF'
@echo off
chcp 65001 >nul
title SYA - Installation

echo.
echo 📦 Installation de SYA...
echo.

REM Vérifier si Docker est installé
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERREUR: Docker n'est pas installé !
    echo.
    echo 📥 Veuillez installer Docker Desktop depuis:
    echo    https://www.docker.com/products/docker-desktop
    echo.
    echo 🔄 Après l'installation, redémarrez votre ordinateur.
    echo.
    pause
    exit /b 1
)

REM Créer le dossier d'installation
set INSTALL_DIR=%USERPROFILE%\SYA
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

REM Copier les fichiers
echo 📁 Copie des fichiers...
xcopy /s /e /y "sya-api.exe" "%INSTALL_DIR%\"
xcopy /s /e /y "frontend" "%INSTALL_DIR%\"
xcopy /s /e /y "docker-compose.yml" "%INSTALL_DIR%\"
xcopy /s /e /y "sya-launcher.bat" "%INSTALL_DIR%\"
xcopy /s /e /y "sya-stop.bat" "%INSTALL_DIR%\"

REM Créer un raccourci sur le bureau
echo 🖥️  Création du raccourci...
powershell "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\SYA.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\sya-launcher.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'SYA - Simple Yet Advanced'; $Shortcut.Save()"

REM Créer un raccourci dans le menu Démarrer
set START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs\SYA
if not exist "%START_MENU%" mkdir "%START_MENU%"
powershell "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\SYA.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\sya-launcher.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'SYA - Simple Yet Advanced'; $Shortcut.Save()"

echo.
echo ✅ SYA a été installé avec succès !
echo.
echo 📍 Installation: %INSTALL_DIR%
echo 🖥️  Raccourci: Bureau et Menu Démarrer
echo.
echo 🚀 Pour démarrer SYA:
echo   - Double-cliquez sur l'icône SYA sur le bureau
echo   - Ou utilisez le menu Démarrer
echo.
echo ⚠️  Assurez-vous que Docker Desktop est en cours d'exécution
echo.
pause
EOF

# Créer le script de désinstallation
cat > "$INSTALLER_DIR/uninstall-sya.bat" << 'EOF'
@echo off
chcp 65001 >nul
title SYA - Désinstallation

echo.
echo 🗑️  Désinstallation de SYA...
echo.

REM Arrêter SYA s'il est en cours d'exécution
call sya-stop.bat

REM Supprimer le dossier d'installation
set INSTALL_DIR=%USERPROFILE%\SYA
if exist "%INSTALL_DIR%" (
    echo 📁 Suppression des fichiers...
    rmdir /s /q "%INSTALL_DIR%"
)

REM Supprimer les raccourcis
echo 🖥️  Suppression des raccourcis...
if exist "%USERPROFILE%\Desktop\SYA.lnk" del "%USERPROFILE%\Desktop\SYA.lnk"
if exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\SYA" rmdir /s /q "%APPDATA%\Microsoft\Windows\Start Menu\Programs\SYA"

REM Nettoyer Docker
echo 🐳 Nettoyage Docker...
docker-compose down -v >nul 2>&1
docker system prune -f >nul 2>&1

echo.
echo ✅ SYA a été désinstallé avec succès !
echo.
echo 📝 Tous les fichiers et données ont été supprimés.
echo.
pause
EOF

# Créer un fichier README pour l'installateur
cat > "$INSTALLER_DIR/README-INSTALLER.md" << 'EOF'
# SYA - Installateur Windows

Ce dossier contient l'installateur Windows de SYA.

## Installation

### Prérequis
- **Windows 10/11** (64-bit)
- **Docker Desktop** : [Télécharger](https://www.docker.com/products/docker-desktop)

### Étapes d'installation

1. **Installer Docker Desktop**
   - Téléchargez depuis https://www.docker.com/products/docker-desktop
   - Installez et redémarrez votre ordinateur

2. **Installer SYA**
   - Double-cliquez sur `install-sya.bat`
   - Suivez les instructions à l'écran

3. **Démarrer SYA**
   - Double-cliquez sur l'icône SYA sur le bureau
   - Ou utilisez le menu Démarrer

## Utilisation

### Démarrage
- **Raccourci bureau** : Double-cliquez sur l'icône SYA
- **Menu Démarrer** : Recherchez "SYA" dans le menu Démarrer
- **Manuel** : Exécutez `sya-launcher.bat`

### Arrêt
- Fermez la fenêtre de l'application
- Ou exécutez `sya-stop.bat`

### Désinstallation
- Exécutez `uninstall-sya.bat`
- Ou utilisez le Panneau de configuration Windows

## Services

- **Interface web** : http://localhost:3000
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
- Attendez que l'icône soit verte

### Ports déjà utilisés
- Fermez les autres applications
- Ou redémarrez votre ordinateur

### Erreur de permission
- Exécutez en tant qu'administrateur
- Ou désactivez temporairement l'antivirus

## Support

Pour toute question ou problème :
- Consultez le README principal
- Ouvrez une issue sur GitHub
- Vérifiez que Docker Desktop fonctionne

---

**Bonne utilisation de SYA ! 🚀**
EOF

# Créer un script de vérification
cat > "$INSTALLER_DIR/check-sya.bat" << 'EOF'
@echo off
chcp 65001 >nul
title SYA - Vérification

echo.
echo 🔍 Vérification de SYA...
echo.

echo 📊 Docker:
docker --version
if %errorlevel% equ 0 (
    echo ✅ Docker: Installé
) else (
    echo ❌ Docker: Non installé
)

echo.
echo 🐳 Services Docker:
docker-compose ps

echo.
echo 🌐 Test de l'API:
curl -s http://localhost:3001/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ API: En cours d'exécution
) else (
    echo ❌ API: Arrêtée
)

echo 🌍 Test de l'interface:
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Interface: En cours d'exécution
) else (
    echo ❌ Interface: Arrêtée
)

echo.
echo 📋 URLs:
echo   Interface: http://localhost:3000
echo   API: http://localhost:3001
echo   Ollama: http://localhost:11434
echo.
pause
EOF

# Créer un fichier .zip de l'installateur
print_status "Création de l'archive de l'installateur..."
zip -r "$INSTALLER_DIR.zip" "$INSTALLER_DIR"

print_success "Installateur Windows créé avec succès !"
echo ""
echo "🪟 Installateur: $INSTALLER_DIR"
echo "📦 Archive: $INSTALLER_DIR.zip"
echo ""
echo "🚀 Pour distribuer l'installateur:"
echo "  1. Partagez le fichier $INSTALLER_DIR.zip"
echo "  2. Les utilisateurs décompressent et exécutent install-sya.bat"
echo "  3. Ils double-cliquent sur l'icône SYA sur le bureau"
echo ""
echo "✅ L'installateur Windows est prêt !" 