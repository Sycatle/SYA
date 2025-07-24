#!/bin/bash

# Script de démarrage pour les outils de distribution SYA
# Ce script redirige vers le générateur de packages

echo "🚀 SYA - Outils de distribution"
echo "================================"

# Vérifier si le script de distribution existe
if [ ! -f "scripts/distribution/build-all.sh" ]; then
    echo "❌ Erreur: Scripts de distribution non trouvés"
    echo "Vérifiez que vous êtes dans le répertoire racine de SYA"
    exit 1
fi

# Aller dans le répertoire des scripts de distribution
cd scripts/distribution

# Exécuter le script principal
./build-all.sh 