# SYA – Simplify Your Assistant

> Assistant personnel local, éthique et évolutif – votre Jarvis open-source, conçu pour le respect de la vie privée.

[![GitHub stars](https://img.shields.io/github/stars/Sycatle/SYA?style=social)](https://github.com/Sycatle/SYA/stargazers)
[![License](https://img.shields.io/badge/license-BSL%201.1-blue)](LICENSE)
[![Rust](https://img.shields.io/badge/rust-1.75+-orange)](https://www.rust-lang.org)
![Non Commercial Use Only](https://img.shields.io/badge/usage-non--commercial-red)

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

## Installation rapide

### Prérequis

* [Docker](https://www.docker.com/) (obligatoire)
* [pnpm](https://pnpm.io/) (installé automatiquement si manquant)

### 🚀 Démarrage en une commande

```bash
git clone https://github.com/Sycatle/SYA.git
cd SYA
chmod +x start.sh stop.sh
./start.sh
```

> Le script vérifie automatiquement les prérequis, installe les dépendances et démarre tous les services !

### Services démarrés

* `ollama` (LLM local) - [http://localhost:11434](http://localhost:11434)
* `sya-api` (API Rust) - [http://localhost:3001](http://localhost:3001)
* `sya-db` (PostgreSQL) - [localhost:5432](localhost:5432)
* `sya-web` (Next.js) - [http://localhost:3000](http://localhost:3000) ⭐ **Interface principale**

### Commandes utiles

```bash
# Démarrer SYA
./start.sh

# Arrêter SYA
./stop.sh

# Voir les logs
docker-compose logs -f

# Redémarrer
docker-compose restart

# Supprimer toutes les données
docker-compose down -v
```

---

## Première utilisation

1. **Ouvrez** [http://localhost:3000](http://localhost:3000)
2. **Créez un compte** avec votre email
3. **Connectez-vous** et commencez à discuter !
4. **Téléchargez un modèle** via l'interface (ex: llama3, mistral, etc.)

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

## Mots-clés

*Assistant IA local, Rust, Ollama, Actix, Docker, PostgreSQL, self-hosted AI, privacy-first, LLM, chatbot open-source, Jarvis local, domotique, automation, extension, plugins, Next.js, GPT alternative.*
