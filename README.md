# 🗳️ E-Voting System — Plateforme de Vote Électronique Sécurisé

![Laravel](https://img.shields.io/badge/Laravel-12-red)
![React](https://img.shields.io/badge/React-18-blue)
![MySQL](https://img.shields.io/badge/MySQL-8%2B-orange)
![Sanctum](https://img.shields.io/badge/Auth-Sanctum-green)
![License](https://img.shields.io/badge/license-MIT-green)

Système de vote électronique sécurisé pour les élections internes, développé dans le cadre d'un projet universitaire.

---

## 📋 Table des matières

- [Description](#-description)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Structure du projet](#-structure-du-projet)
- [Authentification & Workflow](#-authentification--workflow)
- [Routes API](#-routes-api)
- [Rôles & Permissions](#-rôles--permissions)
- [Scripts disponibles](#-scripts-disponibles)
- [Déploiement](#-déploiement)
- [Dépannage](#-dépannage)
- [Auteurs](#-auteurs)

---

## 📖 Description

E-Voting est une plateforme de vote électronique sécurisée permettant :

- La **gestion des élections** (création, publication, clôture)
- La **gestion des candidats** avec photo
- Le **vote anonyme** et sécurisé (hash anonyme)
- Le **dépouillement automatique** avec statistiques
- La **vérification de compte** par email
- La **consultation des résultats** en temps réel

---

## 🏗️ Architecture

| Couche | Technologie |
|--------|-------------|
| **Backend** | Laravel 12 (API REST) |
| **Frontend** | React 18 + Vite |
| **Base de données** | MySQL 8+ |
| **Authentification** | Laravel Sanctum |
| **Email** | SMTP Gmail |
| **Stockage fichiers** | Laravel Storage (photos candidats) |

---

## 📦 Prérequis

- **PHP** 8.2+
- **Composer**
- **Node.js** 18+
- **MySQL** 8+
- **npm** ou **yarn**

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Horace-web/E-voting
cd e-voting
```

### 2. Installer les dépendances backend

```bash
cd backend
composer install
```

### 3. Installer les dépendances frontend

```bash
cd frontend
npm install
```

### 4. Configurer l'environnement

```bash
cd backend
cp .env.example .env
php artisan key:generate
```

### 5. Lancer les migrations et seeders

```bash
php artisan migrate --seed
```

### 6. Créer le lien symbolique pour le stockage

```bash
php artisan storage:link
```

### 7. Démarrer les serveurs

```bash
# Backend
php artisan serve

# Frontend (dans un autre terminal)
cd frontend
npm run dev
```

---

## ⚙️ Configuration

### Fichier `.env` (backend)

```env
# Application
APP_NAME="E-Voting"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# Base de données
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=e_voting
DB_USERNAME=root
DB_PASSWORD=

# Email (Gmail SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=votre-mot-de-passe-application
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=votre-email@gmail.com
MAIL_FROM_NAME="E-Voting"
```

> ⚠️ Pour Gmail, utilisez un **mot de passe d'application** (pas votre mot de passe personnel). Activez la validation en 2 étapes puis générez un mot de passe d'application dans votre compte Google.

---

## 📁 Structure du projet

```
e-voting/
│
├── backend/                        # API Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/    # AuthController, UserController, ElectionController...
│   │   │   ├── Middleware/         # CheckRole.php
│   │   │   └── Requests/          # FormRequests (validation)
│   │   ├── Models/                 # User, Election, Candidat, Vote, Participation...
│   │   └── Mail/                   # AccountVerificationMail
│   ├── database/
│   │   ├── migrations/             # Tables : users, elections, candidats, votes...
│   │   └── seeders/               # RolesSeeder, AdminSeeder, ElectionSeeder
│   ├── resources/views/emails/     # Templates email (Blade)
│   └── routes/api.php             # Toutes les routes API
│
└── frontend/                       # Application React
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── services/               # Appels API
    └── vite.config.js
```

---

## 🔐 Authentification & Workflow

Le système utilise un workflow d'authentification en **4 étapes** :

### Étape 1 — Création de l'utilisateur (Admin)

```
POST /api/users
→ Génère un token de vérification (valide 30 min)
→ Envoie un email avec le lien d'activation
→ Statut utilisateur : "en_attente"
```

### Étape 2 — Vérification du compte (Utilisateur)

```
POST /api/auth/verify-account
Body: { token, password, password_confirmation }
→ Active le compte
→ Définit le mot de passe
→ Retourne un token Sanctum (connexion automatique)
→ Statut utilisateur : "actif"
```

### Étape 3 — Connexion classique

```
POST /api/auth/login
Body: { email, password }
→ Retourne un token Sanctum
```

### Étape 4 — Utilisation de l'API

```
Toutes les routes protégées nécessitent :
Authorization: Bearer {token}
Accept: application/json
```

---

## 🛣️ Routes API

### Publiques (sans authentification)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/login` | Connexion |
| `POST` | `/api/auth/verify-account` | Vérification compte + définition mot de passe |
| `GET` | `/api/roles` | Liste des rôles |

### Protégées (authentification requise)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/logout` | Déconnexion |
| `GET` | `/api/auth/me` | Profil utilisateur connecté |
| `GET` | `/api/elections` | Liste des élections |
| `GET` | `/api/elections/{id}` | Détail d'une élection |
| `GET` | `/api/elections/{id}/resultats` | Résultats d'une élection |

### Admin uniquement

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/users` | Liste des utilisateurs |
| `POST` | `/api/users` | Créer un utilisateur |
| `GET` | `/api/users/{id}` | Détail d'un utilisateur |
| `PUT` | `/api/users/{id}` | Modifier un utilisateur |
| `DELETE` | `/api/users/{id}` | Désactiver un utilisateur |
| `POST` | `/api/elections` | Créer une élection |
| `PUT` | `/api/elections/{id}` | Modifier une élection |
| `DELETE` | `/api/elections/{id}` | Supprimer une élection |
| `POST` | `/api/elections/{id}/publier` | Publier une élection |
| `POST` | `/api/elections/{id}/cloturer` | Clôturer une élection |
| `POST` | `/api/elections/{id}/candidats` | Ajouter un candidat |
| `GET` | `/api/elections/{id}/candidats` | Liste des candidats |
| `GET` | `/api/candidats/{id}` | Détail d'un candidat |
| `PUT` | `/api/candidats/{id}` | Modifier un candidat |
| `DELETE` | `/api/candidats/{id}` | Supprimer un candidat |

### Électeur uniquement

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/vote` | Voter pour un candidat |
| `GET` | `/api/mon-vote/{election_id}` | Vérifier sa participation |

---

## 👥 Rôles & Permissions

| Rôle | Code | Permissions |
|------|------|-------------|
| Administrateur | `ADMIN` | Gestion complète (utilisateurs, élections, candidats) |
| Électeur | `VOTER` | Consulter les élections en cours, voter, vérifier sa participation |
| Auditeur | `AUDITOR` | Consultation des résultats et logs *(à venir)* |

---

## 🔄 Cycle de vie d'une élection

```
Brouillon → Publiée → EnCours → Clôturée
```

| Statut | Description | Actions possibles |
|--------|-------------|-------------------|
| `Brouillon` | Création initiale | Modifier, ajouter candidats, publier, supprimer |
| `Publiée` | Visible mais pas encore ouverte | Modifier (min. 2 candidats requis pour publier) |
| `EnCours` | Vote ouvert | Voter (électeurs), clôturer (admin) |
| `Clôturée` | Vote terminé | Consulter les résultats uniquement |

> Le passage de `Publiée` → `EnCours` et `EnCours` → `Clôturée` est automatisé via un **CRON** basé sur `date_debut` et `date_fin`.

---

## 📜 Scripts disponibles

### Backend

```bash
php artisan migrate --seed          # Migrations + données initiales
php artisan db:seed --class=AdminSeeder   # Créer l'admin uniquement
php artisan storage:link            # Lien symbolique storage
php artisan queue:work              # Démarrer les queues (envoi emails)
php artisan schedule:run            # Lancer le scheduler (cron)
```

### Frontend

```bash
npm run dev       # Serveur de développement
npm run build     # Build de production
npm run preview   # Prévisualiser le build
```

---

## 🌐 Déploiement

### 1. Variables d'environnement en production

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com
FRONTEND_URL=https://e-voting-esgis.netlify.app
```

### 2. Optimisation du cache

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### 3. Configuration du CRON (mise à jour automatique des statuts)

Ajoutez cette ligne dans votre crontab :

```bash
* * * * * cd /var/www/e-voting/backend && php artisan schedule:run >> /dev/null 2>&1
```

### 4. Vider les caches après déploiement

```bash
php artisan optimize:clear
php artisan config:cache
php artisan queue:restart
```

---

## 🔧 Dépannage

### Erreur : "Target class [protected] does not exist"

**Cause :** Middleware `protected` non enregistré.
**Solution :** Remplacer par `auth:sanctum` dans `routes/api.php`.

### Erreur 500 : "Route [login] not defined"

**Cause :** API pure sans route web `login`.
**Solution :** Dans `app/Exceptions/Handler.php` :

```php
protected function unauthenticated($request, AuthenticationException $exception)
{
    return response()->json([
        'success' => false,
        'message' => 'Non authentifié.'
    ], 401);
}
```

### Lien email pointe vers localhost en production

**Cause :** Variable `FRONTEND_URL` absente ou cache de config non vidé.
**Solution :**
```bash
# Ajouter dans .env
FRONTEND_URL=https://e-voting-esgis.netlify.app

# Vider le cache
php artisan config:clear
php artisan config:cache
```

### Réponse 200 sans body dans VS Code REST Client

**Cause :** Header `Accept` manquant.
**Solution :** Ajouter dans chaque requête :
```
Accept: application/json
```

### Validation échoue silencieusement (status 200, rien en base)

**Causes possibles :**
- Champ absent du `$fillable` du modèle
- Validation `integer` sur un champ `UUID`
- `password_confirmation` nommé `confirm_password`

---

## 👨‍💻 Auteurs

Développé dans le cadre d'un projet universitaire — ESGIS

| Développeur | Responsabilité |
|-------------|---------------|
A mettre à jour ...
---

## 📝 Licence

MIT License — Copyright (c) 2026

---

*Dernière mise à jour : 17 février 2026*
