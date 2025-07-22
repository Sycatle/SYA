# Contribuer à SYA (Simplify Your Assistant)

Merci de votre intérêt pour SYA ! Ce projet est un assistant personnel open-source, auto-hébergé et respectueux de la vie privée. Vos contributions sont les bienvenues pour l'améliorer.

---

## 🚀 Comment contribuer

### 1. Fork du dépôt

Créez un fork du repo GitHub sur votre compte pour débuter vos modifications.

### 2. Créer une branche

Créez une branche descriptive pour votre modification :

```bash
git checkout -b fix/api-timeout
```

### 3. Faire vos modifications

* Respectez le style de code existant (Rust + Next.js)
* Commentez les parties complexes ou importantes
* Utilisez des commits clairs et précis :

  ```
  feat(auth): add email validation on signup
  fix(chat): prevent crash on empty message
  ```

### 4. Tests et validation

* Testez vos modifications localement
* Assurez-vous que `docker compose up --build` fonctionne sans erreur
* Exécutez les migrations si nécessaire avec :

  ```bash
  cd apps/api && sqlx migrate run
  ```

### 5. Push et Pull Request

* Poussez votre branche :

  ```bash
  git push origin fix/api-timeout
  ```
* Ouvrez une *Pull Request* sur le dépôt d'origine avec une description claire

---

## 🔍 Ce que vous pouvez améliorer

* ✨ Interface Next.js (améliorations UI/UX, accessibilité)
* 📊 Mémoire contextuelle (historique, embeddings, filtrage)
* 🔧 Backend Rust (performances, gestion des erreurs, modules)
* ⚡️ Intégration d'agents (Whisper, recherche web, domotique, etc.)
* 💳 Gestion des tokens et quota utilisateurs

---

## 🚫 Ce qu'on évite

* Aucune intégration cloud tierce sans mode déconnecté possible
* Aucune fonctionnalité qui collecte des données personnelles sans consentement explicite

---

## 📖 Bonnes pratiques

* Lisez le fichier [README.md](./README.md) pour comprendre le projet
* Consultez la [roadmap](./ROADMAP.md) pour éviter les doublons
* Créez une *issue* avant une refonte majeure ou une fonctionnalité importante

---

## 🙏 Merci !

Votre aide fait avancer ce projet. Que ce soit pour une ligne de code, un correctif de faute ou une idée géniale, chaque contribution compte.

N'oubliez pas d'ajouter une étoile ⭐ sur le repo si vous aimez SYA !
