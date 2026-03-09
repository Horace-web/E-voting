# 🗳️ E-Voting — Système de Vote Électronique Sécurisé

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Sanctum](https://img.shields.io/badge/Auth-Sanctum-00D8FF?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

> Plateforme de vote électronique sécurisée pour les élections internes universitaires, développée dans le cadre d'un projet académique à ESGIS.

---

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Captures d'écran](#-captures-décran)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [API Documentation](#-api-documentation)
- [Sécurité](#-sécurité)
- [Déploiement](#-déploiement)
- [Tests](#-tests)
- [Structure du projet](#-structure-du-projet)
- [Technologies utilisées](#-technologies-utilisées)
- [Auteurs](#-auteurs)
- [Licence](#-licence)

---

## 🎯 Vue d'ensemble

**E-Voting** est une plateforme complète de vote électronique conçue pour garantir la transparence, la sécurité et l'anonymat dans les processus électoraux universitaires. Le système permet de gérer l'ensemble du cycle de vie d'une élection, depuis la création jusqu'au dépouillement automatique.

### Pourquoi E-Voting ?

- ✅ **Transparence** : Processus électoral traçable et vérifiable
- ✅ **Sécurité** : Authentification forte et anonymisation des votes
- ✅ **Efficacité** : Dépouillement automatique et résultats instantanés
- ✅ **Accessibilité** : Vote depuis n'importe quel appareil connecté
- ✅ **Écologique** : Zéro papier, zéro déplacement

---

## ✨ Fonctionnalités

### 👤 Pour les Administrateurs

- 📝 **Gestion des élections** : Création, modification, publication, clôture
- 👥 **Gestion des utilisateurs** : Ajout d'électeurs avec vérification email
- 🎭 **Gestion des candidats** : Upload de photos, programmes détaillés
- 📊 **Tableau de bord** : Suivi en temps réel de la participation
- 📈 **Résultats détaillés** : Statistiques complètes avec graphiques
- 🔐 **Gestion des rôles** : Attribution de permissions granulaires

### 🗳️ Pour les Électeurs

- ✉️ **Activation de compte** : Vérification par email sécurisée
- 🔍 **Consultation des élections** : Vue des élections en cours
- 📄 **Programmes des candidats** : Consultation détaillée avant le vote
- ✅ **Vote sécurisé** : Un vote unique et anonyme par élection
- 📋 **Historique de participation** : Vérification de sa participation

### 🔍 Pour les Auditeurs

- 📊 **Consultation des résultats** : Accès en lecture seule
- 🕒 **Logs d'audit** : Traçabilité complète des actions *(à venir)*

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Admin      │  │   Voter      │  │   Auditor    │      │
│  │  Dashboard   │  │  Interface   │  │   Reports    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                   Axios HTTP Requests                        │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Laravel API)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Sanctum Auth │  │  Controllers │  │  Middleware  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Models     │  │  Validators  │  │   Mailable   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       MySQL DATABASE                         │
│  ┌─────────┐ ┌──────────┐ ┌────────────┐ ┌──────────┐     │
│  │  Users  │ │Elections │ │ Candidats  │ │  Votes   │     │
│  └─────────┘ └──────────┘ └────────────┘ └──────────┘     │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │Participation│ │     Roles    │ │Email Verif.  │        │
│  └─────────────┘ └──────────────┘ └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Flux d'authentification

```
1. Admin crée utilisateur → Email envoyé avec token (30 min)
2. Utilisateur clique lien → Définit son mot de passe
3. Compte activé → Token Sanctum généré
4. Connexions suivantes → Email + Password → Token Sanctum
```

### Flux de vote

```
1. Électeur se connecte → Consulte élections EnCours
2. Sélectionne candidat → Vote enregistré (hash anonyme)
3. Participation marquée → Impossible de revoter
4. Clôture automatique → Dépouillement instantané
```

---

## 📸 Captures d'écran

*(À ajouter : screenshots de l'interface)*

### Dashboard Admin
![Admin Dashboard](docs/screenshots/admin-dashboard.png)

### Interface de vote
![Voter Interface](docs/screenshots/voter-interface.png)

### Résultats en temps réel
![Results](docs/screenshots/results.png)

---

## 📦 Prérequis

### Backend

- **PHP** 8.2 ou supérieur
- **Composer** 2.x
- **MySQL** 8.0+
- **Extensions PHP** :
  ```
  pdo_mysql, mbstring, xml, bcmath, fileinfo, json, 
  openssl, tokenizer, ctype, gd
  ```

### Frontend

- **Node.js** 18 ou supérieur
- **npm** 9+ ou **yarn** 1.22+

### Optionnel

- **Redis** (pour les queues et cache en production)
- **Supervisor** (pour les workers de queue)

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Horace-web/E-voting.git
cd E-voting
```

### 2. Installation Backend

```bash
cd backend

# Installer les dépendances
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
# DB_DATABASE=e_voting
# DB_USERNAME=root
# DB_PASSWORD=

# Créer la base de données
mysql -u root -p -e "CREATE DATABASE e_voting CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Exécuter les migrations et seeders
php artisan migrate:fresh --seed --seeder=ProductionSeeder

# Créer le lien symbolique pour le stockage
php artisan storage:link

# Démarrer le serveur de développement
php artisan serve
```

Le backend sera accessible sur `http://localhost:8000`

### 3. Installation Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Configurer l'URL de l'API
# Créer un fichier .env
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

---

## ⚙️ Configuration

### Backend `.env`

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
MAIL_USERNAME=votre.email@gmail.com
MAIL_PASSWORD=votre_mot_de_passe_application
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=votre.email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:8000/api
```

### Configuration Email (Gmail)

1. Activer la validation en 2 étapes sur votre compte Google
2. Générer un mot de passe d'application :
   - Compte Google → Sécurité → Validation en 2 étapes
   - Mots de passe d'application → Créer
3. Utiliser ce mot de passe dans `MAIL_PASSWORD`

---

## 🎮 Utilisation

### Identifiants par défaut

Après le seeding, utilisez ces comptes de test :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Admin** | `admin@vote.bj` | `Admin@123` |
| **Électeur** | `akim.adjovi@universite.bj` | `Password123!` |
| **Auditeur** | `pascal.chabi@universite.bj` | `Auditor123!` |

> ⚠️ **Changez ces mots de passe en production !**

### Workflow complet

#### 1. Connexion Admin

```bash
POST /api/auth/login
{
  "email": "admin@vote.bj",
  "password": "Admin@123"
}
```

#### 2. Créer une élection

```bash
POST /api/elections
Authorization: Bearer {admin_token}
{
  "titre": "Élection du BDE 2026",
  "description": "...",
  "date_debut": "2026-03-15 08:00:00",
  "date_fin": "2026-03-15 18:00:00"
}
```

#### 3. Ajouter des candidats

```bash
POST /api/elections/{election_id}/candidats
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

nom: "Candidat 1"
programme: "Programme détaillé..."
photo: [fichier]
```

#### 4. Publier l'élection

```bash
POST /api/elections/{election_id}/publier
Authorization: Bearer {admin_token}
```

#### 5. Vote (Électeur)

```bash
POST /api/vote
Authorization: Bearer {voter_token}
{
  "election_id": "...",
  "candidat_id": "..."
}
```

#### 6. Consulter les résultats

```bash
GET /api/elections/{election_id}/resultats
Authorization: Bearer {admin_token}
```

---

## 📚 API Documentation

### Endpoints publics

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/login` | Connexion |
| `POST` | `/api/auth/verify-account` | Vérification compte |
| `GET` | `/api/roles` | Liste des rôles |

### Endpoints protégés (authentification requise)

| Méthode | Endpoint | Rôle | Description |
|---------|----------|------|-------------|
| `POST` | `/api/auth/logout` | Tous | Déconnexion |
| `GET` | `/api/auth/me` | Tous | Profil utilisateur |
| `GET` | `/api/elections` | Tous | Liste élections |
| `GET` | `/api/elections/{id}` | Tous | Détail élection |
| `GET` | `/api/elections/{id}/resultats` | Tous | Résultats |
| `POST` | `/api/users` | Admin | Créer utilisateur |
| `GET` | `/api/users` | Admin | Liste utilisateurs |
| `POST` | `/api/elections` | Admin | Créer élection |
| `PUT` | `/api/elections/{id}` | Admin | Modifier élection |
| `POST` | `/api/elections/{id}/publier` | Admin | Publier |
| `POST` | `/api/elections/{id}/cloturer` | Admin | Clôturer |
| `POST` | `/api/elections/{id}/candidats` | Admin | Ajouter candidat |
| `POST` | `/api/vote` | Voter | Voter |
| `GET` | `/api/mon-vote/{election_id}` | Voter | Vérifier participation |

**Documentation complète Swagger** : *(à venir)*

---

## 🔐 Sécurité

### Mesures implémentées

✅ **Authentification**
- Laravel Sanctum (tokens API stateless)
- Vérification email obligatoire
- Mot de passe hashé (bcrypt)

✅ **Autorisation**
- Middleware de rôles (Admin, Voter, Auditor)
- Vérification des permissions sur chaque route

✅ **Vote anonyme**
- Hash SHA-256 de l'identité de l'électeur
- Impossibilité de relier un vote à un utilisateur
- Vote unique par élection (table `participations`)

✅ **Protection des données**
- Validation stricte des entrées (FormRequests)
- Protection CSRF
- Sanitisation des données

✅ **Rate Limiting**
- 60 requêtes par minute (API globale)
- 3 tentatives de vérification OTP par minute

✅ **Headers de sécurité**
- HTTPS obligatoire en production
- CORS configuré

### Recommandations production

⚠️ **À activer en production :**

```env
APP_ENV=production
APP_DEBUG=false
SESSION_SECURE_COOKIE=true
```

```bash
# Optimiser les performances
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🌐 Déploiement

### Backend (serveur cPanel/VPS)

```bash
# 1. Uploader les fichiers via FTP/SSH
# 2. Installer les dépendances
composer install --optimize-autoloader --no-dev

# 3. Configurer .env pour la production
cp .env.example .env
nano .env  # Éditer les variables

# 4. Générer la clé
php artisan key:generate

# 5. Migrations + Seeders
php artisan migrate:fresh --seed --seeder=ProductionSeeder

# 6. Lien symbolique storage
php artisan storage:link

# 7. Optimiser
php artisan config:cache
php artisan route:cache
php artisan optimize

# 8. Permissions
chmod -R 775 storage bootstrap/cache
```

### Frontend (Netlify/Vercel)

```bash
# 1. Build de production
npm run build

# 2. Déployer le dossier dist/
# Sur Netlify : drag & drop du dossier dist/
# Sur Vercel : vercel --prod
```

### CRON (mise à jour automatique des statuts)

Ajouter dans crontab :

```bash
* * * * * cd /chemin/vers/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🧪 Tests

### Tests Backend

```bash
# Tests unitaires
php artisan test

# Tests spécifiques
php artisan test --filter ElectionTest

# Avec couverture
php artisan test --coverage
```

### Tests Frontend

```bash
# Tests Jest
npm run test

# Tests E2E Cypress
npm run cypress:open
```

### Tests manuels (Postman)

Importer la collection : `docs/postman/E-Voting.postman_collection.json`

---

## 📁 Structure du projet

```
E-voting/
│
├── backend/                          # API Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/      # AuthController, UserController...
│   │   │   ├── Middleware/           # CheckRole.php
│   │   │   └── Requests/             # FormRequests (validation)
│   │   ├── Models/                   # User, Election, Candidat, Vote...
│   │   └── Mail/                     # AccountVerificationMail
│   ├── database/
│   │   ├── migrations/               # Structure BDD
│   │   └── seeders/                  # ProductionSeeder, AdminSeeder...
│   ├── routes/api.php                # Toutes les routes API
│   ├── config/                       # Configurations Laravel
│   ├── resources/views/emails/       # Templates email (Blade)
│   └── storage/                      # Logs, uploads, cache
│
├── frontend/                         # Application React
│   ├── src/
│   │   ├── components/               # Composants réutilisables
│   │   ├── pages/                    # Pages principales
│   │   ├── services/                 # Appels API (axios)
│   │   ├── context/                  # Context API (auth)
│   │   └── utils/                    # Fonctions utilitaires
│   ├── public/                       # Assets statiques
│   └── vite.config.js                # Configuration Vite
│
├── docs/                             # Documentation
│   ├── api/                          # Documentation API
│   ├── screenshots/                  # Captures d'écran
│   └── deployment/                   # Guides de déploiement
│
├── README.md                         # Ce fichier
└── LICENSE                           # Licence MIT
```

---

## 🛠️ Technologies utilisées

### Backend

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Laravel** | 12 | Framework PHP |
| **Sanctum** | 4.x | Authentification API |
| **MySQL** | 8.0+ | Base de données |
| **Mailtrap/Gmail** | - | Envoi d'emails |
| **Carbon** | 2.x | Manipulation de dates |

### Frontend

| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 18 | Framework JavaScript |
| **Vite** | 5.x | Build tool |
| **Axios** | 1.x | Client HTTP |
| **React Router** | 6.x | Navigation |
| **TailwindCSS** | 3.x | Styles CSS |
| **Recharts** | 2.x | Graphiques |

### Outils de développement

- **Git** : Gestion de version
- **Postman** : Tests API
- **VS Code** : Éditeur de code
- **Tinker** : CLI Laravel
- **npm/Composer** : Gestionnaires de dépendances

---

## 👥 Auteurs

Ce projet a été développé dans le cadre d'un projet académique à **ESGIS (École Supérieure de Gestion d'Informatique et des Sciences)**.

| Développeur | Rôle | Responsabilité | Contact |
|-------------|------|----------------|---------|
| **Horace** | Backend Lead | Module Vote, Anonymisation, Sécurité , Élections, Candidats, Middleware  | [GitHub](https://github.com/Horace-web) |
| **Audrey** | Backend Developer & Documentation | Réalisations des diagrammes de documentation et intégration de Swagger | 
| **Jeffry** | Frontend Developer | Tout les interfaces du Front | 
| **Bryan** | Backend Developer | Module Audit et Traçabilité | - |

### Encadrement

- **Professeur** : Faiwaz MARCOS
- **Institution** : ESGIS Bénin
- **Année académique** : 2025-2026

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Règles de contribution

- Respecter les conventions de code (PSR-12 pour PHP)
- Écrire des tests pour les nouvelles fonctionnalités
- Documenter les changements dans le CHANGELOG
- Tester en local avant de push

---

## 📝 Changelog

### Version 1.0.0 (19 février 2026)

**Fonctionnalités**

- ✅ Authentification complète (Sanctum + Email verification)
- ✅ Gestion des élections (CRUD + Statuts automatiques)
- ✅ Gestion des candidats (Upload photos)
- ✅ Module de vote anonyme
- ✅ Dépouillement automatique
- ✅ Seeders de production
- ✅ Dashboard admin
- ✅ Interface électeur
- ✅ Emails transactionnels

**Améliorations à venir**

- 🔄 Module auditeur complet
- 🔄 Logs d'audit
- 🔄 Export PDF des résultats
- 🔄 Dashboard analytics
- 🔄 Notifications push
- 🔄 Mode hors-ligne (PWA)

---

## 📄 Licence

Ce projet est sous licence **MIT**.

```
MIT License

Copyright (c) 2026  - ESGIS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Remerciements

- **ESGIS** pour l'encadrement du projet
- **Communauté Laravel** pour la documentation exhaustive
- **Communauté React** pour les ressources pédagogiques
- Tous les contributeurs open-source dont les packages ont été utilisés

---

## 📞 Support

Pour toute question ou problème :

- 📧 **Email** : horaceodounlami2006@gmail.com
- 🐛 **Issues** : [GitHub Issues](https://github.com/Horace-web/E-voting/issues)
- 📖 **Documentation** : [Wiki du projet](https://github.com/Horace-web/E-voting/wiki)

---

## 🌟 Si ce projet vous a été utile

- ⭐ **Star** le projet sur GitHub
- 🐛 **Signaler** les bugs
- 💡 **Proposer** des améliorations
- 🤝 **Contribuer** au code

---

<div align="center">

**Développé avec ❤️ par Horace Odounlami & Ercias Audrey Dohou & Jeffry Houndeton & Bryan Sogoe**

**ESGIS Bénin — 2026**

[⬆ Retour en haut](#-e-voting--système-de-vote-électronique-sécurisé)

</div>
