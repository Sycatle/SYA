# SYA 🧠 – Self Your Assistant

SYA est un assistant personnel **open-source**, **modulaire** et **auto-hébergé**, conçu pour tourner localement sans dépendre d’un cloud tiers.  
C’est votre **Jarvis** personnel, tournant à la maison, basé sur des modèles IA puissants comme LLaMA 3, Mistral, etc.

Ce monorepo est géré avec [Turborepo](https://turbo.build/) et [pnpm](https://pnpm.io/), et regroupe tous les services de l’écosystème SYA : le moteur IA, l’API, l’interface utilisateur et les composants partagés.

---

## ✨ Fonctionnalités

- 🔒 100 % local, sécurisé et respectueux de la vie privée
- 🧠 Serveur IA Ollama (support GPU)
- ⚙️ API REST en Rust avec Actix Web
- 💬 Interface de chat moderne en Next.js + TailwindCSS
- 🔄 Communication API REST, WebSocket (à venir)
- 🧩 Architecture modulaire avec Turborepo
- 📦 Librairie de composants UI partagés

---

## 🗂️ Arborescence

```
apps/
  api/        - API Rust (Actix Web)
  web/        - Frontend Next.js avec App Router

packages/
  ui/                 - Librairie de composants React
  eslint-config/      - Configuration ESLint partagée
  typescript-config/  - Configuration TypeScript partagée

.husky/               - Hooks Git (commit et lint)
package.json          - Scripts et dépendances globales
pnpm-workspace.yaml   - Définition du monorepo pnpm
turbo.json            - Configuration Turborepo
docker-compose.yml    - Orchestration des services Docker
data/ (ignoré)        - Volume pour les modèles Ollama
```

---

## 🛠️ Commandes

Exécutables depuis la racine du projet :

```bash
pnpm dev           # Démarre tous les services en mode dev
pnpm lint          # Lint sur tous les packages
pnpm check-types   # Vérification des types TypeScript
pnpm build         # Build complet des apps et packages
```

Pour l'API Rust uniquement :

```bash
cd apps/api
cargo run
```

---

## 🐳 Docker

L’environnement de dev est orchestré avec Docker :

```bash
docker compose up -d --build
```

### Services inclus

- `ollama` : moteur IA (avec GPU si disponible)
- `sya-api` : API Rust connectée à Ollama
- `sya-db` : base de données PostgreSQL

Les modèles sont persistés dans `./data/ollama` et les données PostgreSQL dans `./data/db`.

Les migrations SQL sont appliquées automatiquement au démarrage de l'API ou manuellement avec :

```bash
cd apps/api
sqlx migrate run
```

---

## 📅 Roadmap (v0.x)

- ✅ Base monorepo avec API + Web + Ollama
- 🧠 Intégration LLaMA 3 localement
- 🧪 API REST stateless pour communication front/back
- ⏳ WebSocket temps réel
- ⏳ Authentification et sessions utilisateurs
- ⏳ Gestion de mémoire longue (contexte + souvenirs)
- ⏳ Intégrations IA : calendrier, domotique, clipboard, etc.
- ⏳ Interface conversationnelle contextuelle (multi-agents)

---

## 🛡️ Licence

MIT – Utilisation libre pour usage personnel et professionnel.  
Mention du projet recommandée en cas d’intégration commerciale.

---

## 🤝 Contribuer

Le projet est encore jeune. Toutes suggestions, PR ou retours sont les bienvenus.  
📫 Contact : [sycatle@pm.me](mailto:sycatle@pm.me)

---

## 🔗 Liens utiles

- [Ollama](https://ollama.com)
- [Actix Web](https://actix.rs/)
- [Turborepo](https://turbo.build/)
- [pnpm](https://pnpm.io/)
- [Next.js](https://nextjs.org/)
