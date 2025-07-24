# SYA – Simplify Your Assistant

> Assistant personnel local, éthique et évolutif – votre Jarvis open-source, conçu pour le respect de la vie privée.

[![GitHub stars](https://img.shields.io/github/stars/Sycatle/SYA?style=social)](https://github.com/Sycatle/SYA/stargazers)
[![License](https://img.shields.io/badge/license-BSL%201.1-blue)](LICENSE)
[![Rust](https://img.shields.io/badge/rust-1.75+-orange)](https://www.rust-lang.org)
![Non Commercial Use Only](https://img.shields.io/badge/usage-non--commercial-red)

## 🚀 Liens rapides

- **[🌐 Site officiel](http://localhost:3000)** - Télécharger et essayer SYA
- **[📥 Téléchargements](http://localhost:3000/#download)** - Windows, macOS, Linux
- **[🔐 Confidentialité](http://localhost:3000/privacy)** - Politique de protection des données
- **[📚 Documentation](http://localhost:3000/docs/)** - Guides et tutoriels
- **[💬 Essayer SYA](http://localhost:3000/chat)** - Interface de chat en ligne

---

## Aperçu

SYA est un assistant IA local, auto-hébergé, développé en Rust. Il fonctionne **100% en local**, sans cloud, pour préserver vos données et votre vie privée. Pensé comme un "Jarvis" open-source, il utilise [Ollama](https://ollama.com) pour l'inférence LLM, stocke toutes les conversations dans **PostgreSQL** et propose une interface moderne en **Next.js**.

> 💡 **Objectif** : Offrir une base solide, privée et extensible pour tous ceux qui rêvent d'un assistant personnel intelligent à la maison, sans compromis sur la confidentialité.

---

## Fonctionnalités principales

* 🔒 **Confidentialité totale** : fonctionne sans internet, rien ne quitte votre machine.
* 🤖 **Assistant conversationnel IA** : prompt via une interface web moderne.
* 🗃️ **Persistance PostgreSQL** : historique, conversations et gestion multi-utilisateur.
* 🧠 **Mémoire conversationnelle** : chaque conversation a son propre contexte.
* 🔌 **Extensible** : architecture pensée pour les plugins, scripts, domotique et intégrations futures.
* 🐳 **Déploiement facile** : Docker Compose, support GPU prêt à l'emploi.
* ⚡ **API REST moderne** : backend Rust (Actix Web), rapide et sécurisé.
* 🛡️ **Sécurité renforcée** : validation stricte, CORS sécurisé, JWT courts.

---

## Structure du projet

```
apps/
  api/                 Backend Rust (Actix)
  web/                 Frontend Next.js
packages/
  ui/                  Composants partagés
  eslint-config/       Config ESLint
  typescript-config/   Config TypeScript
docker-compose.yml     Orchestration des services
start.sh              Script de démarrage automatique
stop.sh               Script d'arrêt
```

---

## 📥 Téléchargement et Installation

### 🚀 **Installation en 3 étapes simples :**

1. **📥 Téléchargez** depuis notre [site officiel](http://localhost:3000)
2. **⚙️ Installez** selon votre système d'exploitation
3. **🎯 Utilisez** SYA en local !

### 🌐 **Site officiel avec téléchargements directs :**

**[Visitez notre site officiel](http://localhost:3000)** pour télécharger SYA :

- **🪟 Windows** : Installateur automatique + application portable
- **🍎 macOS** : Application native + package d'installation  
- **🐧 Linux** : Package d'installation + code source

### 📚 **Documentation complète :**
- **[Guide d'installation détaillé](http://localhost:3000/docs/installation.md)** : Instructions pas à pas
- **[Politique de confidentialité](http://localhost:3000/privacy)** : Protection de vos données
- **[Documentation complète](http://localhost:3000/docs/)** : Guides et tutoriels

---

## ⚙️ Installation rapide (Développement)

> 💡 **Pour les utilisateurs finaux** : Utilisez plutôt notre [site officiel](http://localhost:3000) pour télécharger SYA.

### Prérequis (Développement)

* [Docker](https://www.docker.com/) (obligatoire)
* [Node.js](https://nodejs.org/) 18+ (pour le développement)
* [Rust](https://rust-lang.org/) (pour la compilation)

### 🚀 Démarrage rapide (Développement)

```bash
git clone https://github.com/Sycatle/SYA.git
cd SYA
./start.sh
```

### 📦 Création de packages (Développement)

```bash
# Créer tous les packages d'installation
./build-packages.sh

# Ou créer des packages spécifiques
./scripts/distribution/create-package.sh      # Package générique
./scripts/distribution/create-macos-app.sh    # Application macOS
./scripts/distribution/create-windows-app.sh  # Application Windows
```

### Services démarrés

* `ollama` (LLM local) - [http://localhost:11434](http://localhost:11434)
* `sya-api` (API Rust) - [http://localhost:3001](http://localhost:3001)
* `sya-db` (PostgreSQL) - [localhost:5432](localhost:5432)
* `sya-web` (Next.js) - [http://localhost:3000](http://localhost:3000) ⭐ **Interface principale**

### Commandes utiles

```bash
# Démarrer SYA
./start-sya.sh
# ou simplement
./start.sh

# Arrêter SYA
./stop-sya.sh
# ou simplement
./stop.sh

# Voir les logs
docker-compose logs -f

# Redémarrer
docker-compose restart

# Supprimer toutes les données
docker-compose down -v
```

---

## 🎯 Première utilisation

### 🌐 **1. Essayer SYA en ligne (Recommandé)**
Visitez **[http://localhost:3000](http://localhost:3000)** pour tester SYA directement dans votre navigateur !

### 📦 **2. Installation locale complète**

#### **Étape 1 : Téléchargement**
- Visitez notre **[site officiel](http://localhost:3000)**
- Choisissez votre système d'exploitation (Windows/macOS/Linux)
- Téléchargez le package d'installation

#### **Étape 2 : Installation**
- **Windows** : Exécutez l'installateur ou décompressez l'application portable
- **macOS** : Installez l'application native ou utilisez le package
- **Linux** : Suivez les instructions du package d'installation

#### **Étape 3 : Configuration**
1. **Lancez SYA** selon votre méthode d'installation
2. **Ouvrez** [http://localhost:3000](http://localhost:3000)
3. **Créez un compte** avec votre email
4. **Connectez-vous** et commencez à discuter !
5. **Téléchargez un modèle** via l'interface (ex: llama3, mistral, etc.)

> 💡 **Conseil** : Commencez avec `llama3` qui est rapide et efficace pour la plupart des tâches.

---

## Configuration de production

Pour déployer SYA en production, configurez les variables d'environnement suivantes :

```bash
# Sécurité
RUST_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here-minimum-16-chars

# CORS - Liste des domaines autorisés séparés par des virgules
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW=900
RATE_LIMIT_MAX_REQUESTS=100
```

> 🔒 **Sécurité** : 
> - En production, le CORS est strict et n'autorise que les domaines spécifiés dans `ALLOWED_ORIGINS`
> - La clé JWT doit faire au minimum 16 caractères
> - Si `JWT_SECRET` n'est pas défini ou est trop courte, une clé aléatoire de 32 caractères sera générée

---

## Cas d'usage

* **Assistant personnel privé** : prise de notes, rappels, gestion de tâches.
* **Base pour domotique** : scripts maison, pilotage MQTT/Home Assistant (bientôt).
* **Plateforme évolutive** : expérimentation LLM, plugins, extensions mobiles ou vocales.

---

## Roadmap

| Phase   | Avancement   | Fonctionnalités clés                                              |
| ------- | ------------ | ----------------------------------------------------------------- |
| Phase 1 | ✅            | Auth, conversations, IA via Ollama, stockage PostgreSQL           |
| Phase 2 | 🛠️ En cours | Mémoire conversationnelle avancée, refonte backend, persistance   |
| Phase 3 | ⏳ Bientôt    | Plugins, assistant vocal local, dashboard, domotique, chiffrement |

**Voir la [Roadmap détaillée](ROADMAP.md) pour le suivi complet.**

---

## Contribuer

Envie de participer ? Toutes les contributions sont bienvenues !

1. **Forkez** ce repo et créez votre branche : `git checkout -b ma-feature`
2. **Développez**, puis **proposez une PR**.
3. **Signalez bugs ou idées** via [Issues](https://github.com/Sycatle/SYA/issues) ou lancez une [Discussion](https://github.com/Sycatle/SYA/discussions).

👉 Priorité aux sujets frontend, intégration de nouveaux modèles, mémoire, expérience utilisateur, plugins.

> Veuillez lire notre [code de conduite](CODE_OF_CONDUCT.md) *(à créer si besoin)*.

---

## Communauté et contact

* Discussions : [GitHub Discussions](https://github.com/Sycatle/SYA/discussions)
* Twitter/X : [@sycatle](https://twitter.com/sycatle) *(à compléter si besoin)*
* Email : contact via Issues/Discussions

---

## Licence

**Business Source License 1.1**
Usage **strictement non commercial** jusqu'au **1er janvier 2028**, puis conversion automatique en [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).
Voir [LICENSE](LICENSE) pour les détails.

---

## 👨‍💻 Crédits

### **Création et développement**
- **SYA** : Assistant IA local développé par [@sycatle](https://github.com/Sycatle)
- **Site web** : Interface moderne Next.js avec design responsive
- **Backend** : API Rust (Actix Web) pour performance et sécurité
- **Base de données** : PostgreSQL pour persistance des conversations

### **Technologies utilisées**
- **Frontend** : Next.js, React, Tailwind CSS, TypeScript
- **Backend** : Rust, Actix Web, PostgreSQL, Docker
- **IA** : Ollama pour l'inférence LLM locale
- **Design** : Interface moderne avec glassmorphism et gradients

### **Contributeurs**
Merci à tous les contributeurs qui participent au développement de SYA !
Voir la liste complète sur [GitHub](https://github.com/Sycatle/SYA/graphs/contributors).

---

## Mots-clés

*Assistant IA local, Rust, Ollama, Actix, Docker, PostgreSQL, self-hosted AI, privacy-first, LLM, chatbot open-source, Jarvis local, domotique, automation, extension, plugins, Next.js, GPT alternative.*
