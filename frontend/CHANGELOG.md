# Changelog - E-Vote Frontend

Toutes les modifications notables du projet sont documentées dans ce fichier.

---

## [1.1.0] - 2026-02-06

### 🔄 CHANGEMENT MAJEUR : Migration Authentification

**OTP → Email + Password avec Confirmation**

#### ✅ Ajouté
- **Page `ConfirmAccount.jsx`** : Page de confirmation d'inscription après clic sur lien email
  - Affichage identifiants (email + password) après activation
  - Gestion états : loading, success, error
  - Design professionnel avec dégradés navy/amber
  - Animations et feedback utilisateur

- **Service d'authentification** :
  - `authService.login(email, password)` : Connexion classique
  - `authService.confirmAccount(token)` : Confirmation via token email
  - `authService.resendConfirmationLink(email)` : Renvoyer lien confirmation

- **Route** : `/confirm/:token` pour confirmation d'inscription

- **Guide de migration** : `MIGRATION_AUTH.md` avec documentation complète

#### 🔨 Modifié
- **Login.jsx** : Refonte complète
  - Formulaire email + password (au lieu d'email seul)
  - Toggle affichage/masquage mot de passe (Eye/EyeOff)
  - Gestion erreurs distinctes :
    - 403 : Compte non activé
    - 401 : Identifiants incorrects
  - Design modernisé avec dégradés
  - Redirection intelligente après login

- **AppRoutes.jsx** :
  - Ajout route `/confirm/:token`
  - Suppression route `/otp`

#### ❌ Supprimé/Obsolète
- **OTP System** :
  - `authService.sendOTP()`
  - `authService.verifyOTP()`
  - `authService.resendOTP()`
- Route `/otp` (à supprimer : `Otp.jsx` toujours présent mais non utilisé)

#### 🔐 Sécurité
- Hachage bcrypt des mots de passe (cost=10)
- Tokens confirmation 64 caractères (expire 48h)
- Stockage temporaire sécurisé passwords (table dédiée)
- Rate limiting : 5 tentatives / 15 min / IP
- HTTPS obligatoire en production

#### 📋 Workflow Utilisateur
1. **Admin crée compte** → Email 1 (lien confirmation 48h)
2. **User clique lien** → Activation compte + Email 2 (identifiants)
3. **User se connecte** → email + password → Dashboard

---

## [1.0.0] - 2026-02-04

### ✅ Initial Release

#### Fonctionnalités principales
- **Design System** : Palette professionnelle (Navy #1e3a5f + Amber #f59e0b)
- **Landing Page** : Hero section, features, footer
- **Authentication** : Système OTP par email (remplacé en v1.1)
- **Dashboard Électeur** :
  - Vue d'ensemble élections
  - Page vote avec sélection candidats
  - Consultation résultats
  - Historique participations
- **Dashboard Admin** :
  - Statistiques temps réel
  - Gestion élections
  - Gestion candidats
  - Gestion utilisateurs
  - Journal d'audit
  - Export PDF/CSV
- **Layouts** :
  - ElecteurLayout avec sidebar navy/amber
  - AdminLayout avec sidebar professionnelle
- **Navigation** :
  - Routes protégées par rôle
  - Redirection intelligente selon authentification
  - Liens actifs dans menus

#### Technologies
- React 19.2.0
- Vite 7.3.0
- Tailwind CSS 3.4.19
- React Router DOM 7.1.1
- Lucide React (icons)
- Axios (HTTP client)

#### Architecture
- **Services** : auth, election, vote, result, audit, candidate, user
- **Context** : AuthContext pour gestion état utilisateur
- **Routes** : AppRoutes avec ProtectedRoute
- **Config** : Mode mock pour développement sans backend

---

## Format

- **[Version]** - Date (YYYY-MM-DD)
- Types de changements :
  - `✅ Ajouté` : Nouvelles fonctionnalités
  - `🔨 Modifié` : Modifications fonctionnalités existantes
  - `🐛 Corrigé` : Corrections de bugs
  - `❌ Supprimé` : Fonctionnalités supprimées
  - `🔐 Sécurité` : Améliorations sécurité
  - `🔄 Changement majeur` : Breaking changes

---

**Équipe E-Vote** | 2026
