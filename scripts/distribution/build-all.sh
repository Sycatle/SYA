#!/bin/bash

# Script principal pour créer tous les packages de distribution SYA
# Ce script permet de créer facilement tous les packages pour toutes les plateformes

echo "🚀 SYA - Générateur de packages de distribution"
echo "================================================"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages avec couleur
print_header() {
    echo -e "${PURPLE}$1${NC}"
}

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

print_option() {
    echo -e "${CYAN}$1${NC}"
}

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "docker-compose.yml" ]; then
    print_error "Ce script doit être exécuté depuis la racine du projet SYA"
    exit 1
fi

# Fonction pour afficher le menu
show_menu() {
    echo ""
    print_header "📦 Options de distribution disponibles :"
    echo ""
    print_option "1. 🚀 Package d'installation (Linux/macOS)"
    print_option "2. 🍎 Application macOS native"
    print_option "3. 🪟 Application Windows complète"
    print_option "4. 🪟 Installateur Windows"
    print_option "5. 🎯 Créer TOUS les packages"
    print_option "6. 📋 Voir les packages existants"
    print_option "7. 🧹 Nettoyer les packages"
    print_option "8. ❓ Aide"
    print_option "9. 🚪 Quitter"
    echo ""
}

# Fonction pour créer le package d'installation
create_package() {
    print_header "📦 Création du package d'installation..."
    ./create-package.sh
    if [ $? -eq 0 ]; then
        print_success "Package d'installation créé avec succès !"
    else
        print_error "Échec de la création du package d'installation"
    fi
}

# Fonction pour créer l'application macOS
create_macos_app() {
    print_header "🍎 Création de l'application macOS..."
    ./create-macos-app.sh
    if [ $? -eq 0 ]; then
        print_success "Application macOS créée avec succès !"
    else
        print_error "Échec de la création de l'application macOS"
    fi
}

# Fonction pour créer l'application Windows
create_windows_app() {
    print_header "🪟 Création de l'application Windows..."
    ./create-windows-app.sh
    if [ $? -eq 0 ]; then
        print_success "Application Windows créée avec succès !"
    else
        print_error "Échec de la création de l'application Windows"
    fi
}

# Fonction pour créer l'installateur Windows
create_windows_installer() {
    print_header "🪟 Création de l'installateur Windows..."
    ./create-windows-installer.sh
    if [ $? -eq 0 ]; then
        print_success "Installateur Windows créé avec succès !"
    else
        print_error "Échec de la création de l'installateur Windows"
    fi
}

# Fonction pour créer tous les packages
create_all_packages() {
    print_header "🎯 Création de TOUS les packages..."
    echo ""
    
    print_status "1. Création du package d'installation..."
    create_package
    echo ""
    
    print_status "2. Création de l'application macOS..."
    create_macos_app
    echo ""
    
    print_status "3. Création de l'application Windows..."
    create_windows_app
    echo ""
    
    print_status "4. Création de l'installateur Windows..."
    create_windows_installer
    echo ""
    
    print_success "Tous les packages ont été créés !"
}

# Fonction pour lister les packages existants
list_packages() {
    print_header "📋 Packages existants :"
    echo ""
    
    if [ -d "SYA-Windows" ]; then
        print_success "✅ SYA-Windows/ (Application Windows)"
    fi
    
    if [ -d "SYA-Installer" ]; then
        print_success "✅ SYA-Installer/ (Installateur Windows)"
    fi
    
    if [ -d "SYA.app" ]; then
        print_success "✅ SYA.app/ (Application macOS)"
    fi
    
    if ls sya-package-*.tar.gz 1> /dev/null 2>&1; then
        print_success "✅ sya-package-*.tar.gz (Package d'installation)"
    fi
    
    if ls SYA-Windows.zip 1> /dev/null 2>&1; then
        print_success "✅ SYA-Windows.zip (Archive Windows)"
    fi
    
    if ls SYA-Installer.zip 1> /dev/null 2>&1; then
        print_success "✅ SYA-Installer.zip (Archive installateur)"
    fi
    
    echo ""
    print_status "Pour voir les détails : ls -la *.zip *.tar.gz SYA*"
}

# Fonction pour nettoyer les packages
clean_packages() {
    print_header "🧹 Nettoyage des packages..."
    echo ""
    
    print_status "Suppression des dossiers de packages..."
    rm -rf SYA-Windows SYA-Installer SYA.app 2>/dev/null
    
    print_status "Suppression des archives..."
    rm -f SYA-Windows.zip SYA-Installer.zip sya-package-*.tar.gz 2>/dev/null
    
    print_success "Nettoyage terminé !"
}

# Fonction pour afficher l'aide
show_help() {
    print_header "❓ Aide - SYA Distribution"
    echo ""
    echo "Ce script permet de créer des packages de distribution pour SYA."
    echo ""
    print_header "📦 Types de packages :"
    echo ""
    print_option "1. Package d'installation"
    echo "   - Pour Linux et macOS"
    echo "   - Archive .tar.gz avec tous les fichiers"
    echo "   - Scripts de démarrage automatiques"
    echo ""
    print_option "2. Application macOS"
    echo "   - Bundle .app natif macOS"
    echo "   - Double-clic pour démarrer"
    echo "   - Icône sur le bureau"
    echo ""
    print_option "3. Application Windows"
    echo "   - Dossier complet avec exécutable .exe"
    echo "   - Scripts .bat pour tout"
    echo "   - Archive .zip prête à distribuer"
    echo ""
    print_option "4. Installateur Windows"
    echo "   - Installateur automatique"
    echo "   - Raccourcis bureau et menu Démarrer"
    echo "   - Scripts de désinstallation"
    echo ""
    print_header "🚀 Utilisation :"
    echo ""
    echo "1. Choisissez l'option dans le menu"
    echo "2. Attendez la création du package"
    echo "3. Les packages seront créés dans le répertoire courant"
    echo ""
    print_header "📋 Prérequis :"
    echo ""
    echo "- Docker installé et démarré"
    echo "- Rust installé (pour la compilation)"
    echo "- Node.js installé (pour le frontend)"
    echo "- Espace disque suffisant (2-5 Go)"
    echo ""
}

# Boucle principale
while true; do
    show_menu
    read -p "Choisissez une option (1-9) : " choice
    
    case $choice in
        1)
            create_package
            ;;
        2)
            create_macos_app
            ;;
        3)
            create_windows_app
            ;;
        4)
            create_windows_installer
            ;;
        5)
            create_all_packages
            ;;
        6)
            list_packages
            ;;
        7)
            clean_packages
            ;;
        8)
            show_help
            ;;
        9)
            print_success "Au revoir ! 👋"
            exit 0
            ;;
        *)
            print_error "Option invalide. Veuillez choisir 1-9."
            ;;
    esac
    
    echo ""
    read -p "Appuyez sur Entrée pour continuer..."
done 