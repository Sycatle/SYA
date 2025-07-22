# 🗺️ Roadmap – SYA (Simplify Your Assistant)

Ce fichier présente la feuille de route du projet SYA, un assistant personnel auto-hébergé, développé en Rust, utilisant Ollama en local pour l'inférence LLM.

---

## ✅ Phase 1 – Base fonctionnelle (terminée)
- Authentification (signup / login)
- Structure PostgreSQL (users, conversations, messages)
- Création, listing et envoi de messages
- Génération automatique de titre (5-6 mots max)
- Mémoire persistante par conversation
- Interface Next.js en chat
- Déploiement local via Docker Compose

---

## 🚧 Phase 2 – IA contextuelle (en cours)
- Requêtes vectorielles (embeddings) pour résumé de contexte
- Système d’injection de mémoire contextuelle dans le prompt
- Ajout automatique d'informations pertinentes en contexte
- Affinage du schéma `user_memory`
- Injection dynamique dans les appels Ollama
- Préparation à la limitation mensuelle de tokens par utilisateur

---

## 🔜 Phase 3 – Assistant intelligent et modulaire
- Mémorisation longue durée d’informations jugées importantes (métier, préférences, style, etc.)
- Détection automatique de ces infos par parsing de messages
- Développement des **premiers modules intelligents** :
  - 📅 **Calendrier** (lecture/synchro CalDAV)
  - ☀️ **Météo** (API open source)
  - ₿ **Crypto** (prix temps réel, portfolio simple)
- Préparation du système de permission d’accès aux modules

---

## 💡 Idées futures
- Assistant vocal local (Whisper + Piper)
- Dashboard personnel
- Version mobile (React Native)
- Connexion domotique (MQTT / Home Assistant)
- Chiffrement des données sensibles
- Multi-utilisateur
- Notifications intelligentes
- Système de plugins étendu (bash, réseaux sociaux, import messages, etc.)
- Import de données personnelles (Discord, WhatsApp, SMS, calendrier…)
- Support d'autres LLM (Gemma, Phi, Mixtral…)
