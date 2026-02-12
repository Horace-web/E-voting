# 🔐 GUIDE POSTMAN - MODULE AUTHENTIFICATION
## Documentation API complète pour le Frontend

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble du workflow](#vue-densemble-du-workflow)
2. [Configuration Postman](#configuration-postman)
3. [Endpoints Admin - Gestion Utilisateurs](#endpoints-admin---gestion-utilisateurs)
4. [Endpoints Utilisateur - Activation Compte](#endpoints-utilisateur---activation-compte)
5. [Endpoints Connexion](#endpoints-connexion)
6. [Endpoints Profil](#endpoints-profil)
7. [Gestion des erreurs](#gestion-des-erreurs)
8. [Collection Postman](#collection-postman)

---

## 🎯 VUE D'ENSEMBLE DU WORKFLOW

### Workflow complet d'authentification

```
1. ADMIN crée utilisateur
   └─> Système génère token confirmation + envoie Email 1
   
2. UTILISATEUR clique lien dans email
   └─> Redirigé vers page activation
   
3. UTILISATEUR saisit mot de passe
   └─> POST /auth/verify-account (token + password)
   └─> Compte activé + connexion automatique
   
4. CONNEXIONS SUIVANTES
   └─> POST /auth/login (email + password)
```

### États du compte utilisateur

| Statut | Description | Peut se connecter ? |
|--------|-------------|---------------------|
| **inactif** | Créé par admin, en attente confirmation | ❌ Non |
| **actif** | Confirmé par utilisateur, mot de passe défini | ✅ Oui |

---

## 🔧 CONFIGURATION POSTMAN

### Variables d'environnement

Créer un environnement **"E-Voting Auth"** avec ces variables :

| Variable | Initial Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost:8000/api` | URL de base API |
| `admin_token` | (vide) | Token admin (après login) |
| `user_token` | (vide) | Token utilisateur (après login) |
| `user_email` | `test@universite.bj` | Email de test |
| `verification_token` | (vide) | Token confirmation email |
| `user_id` | (vide) | ID utilisateur créé |

---

## 👨‍💼 ENDPOINTS ADMIN - GESTION UTILISATEURS

### 📌 ENDPOINT 1 : Créer un utilisateur (ADMIN)

**Workflow :** Admin crée compte → Système envoie email confirmation à l'utilisateur

**Méthode :** `POST`  
**URL :** `{{base_url}}/users`

**Headers :**
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {{admin_token}}
```

**Body (JSON) :**
```json
{
  "email": "nouveau@universite.bj",
  "nom": "Jean Dupont",
  "role_id": "uuid-du-role-voter"
}
```

**Paramètres requis :**
| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `email` | string | ✅ Oui | Email institutionnel unique |
| `nom` | string | ✅ Oui | Nom complet de l'utilisateur |
| `role_id` | UUID | ✅ Oui | ID du rôle (ADMIN, VOTER, AUDITOR) |

**Réponse succès (201 Created) :**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès. Un email de confirmation a été envoyé.",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "nouveau@universite.bj",
    "nom": "Jean Dupont",
    "statut": "inactif",
    "role": {
      "id": "uuid-role",
      "code": "VOTER",
      "nom": "Électeur"
    },
    "created_at": "2026-02-04T10:30:00.000000Z"
  }
}
```

**📧 Email envoyé automatiquement :**
```
Objet : Activez votre compte - Système de Vote Électronique

Bonjour Jean Dupont,

Un compte a été créé pour vous sur le système de vote électronique.

Pour activer votre compte, cliquez sur le lien ci-dessous :
https://vote.universite.bj/activation?token=abc123def456...

Ce lien expire dans 48 heures.

Si vous n'avez pas demandé ce compte, ignorez cet email.
```

**Réponses d'erreur :**

| Code | Message | Cause |
|------|---------|-------|
| 401 | Unauthenticated | Token manquant ou invalide |
| 403 | Accès non autorisé | L'utilisateur n'est pas ADMIN |
| 422 | Email déjà utilisé | Email existe déjà en base |
| 422 | role_id invalide | Le rôle n'existe pas |

**Exemple erreur (422) :**
```json
{
  "message": "The email has already been taken.",
  "errors": {
    "email": [
      "The email has already been taken."
    ]
  }
}
```

**✅ Script Post-request (sauvegarder user_id) :**
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("user_id", jsonData.data.id);
    pm.environment.set("user_email", jsonData.data.email);
    console.log("✅ User créé : " + jsonData.data.email);
}
```

---

### 📌 ENDPOINT 2 : Lister les utilisateurs (ADMIN)

**Méthode :** `GET`  
**URL :** `{{base_url}}/users`

**Headers :**
```
Authorization: Bearer {{admin_token}}
```

**Paramètres query optionnels :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `statut` | string | Filtrer par statut (actif/inactif) |
| `role` | string | Filtrer par code rôle (ADMIN/VOTER/AUDITOR) |
| `page` | int | Numéro de page (pagination) |

**Exemple URL avec filtres :**
```
{{base_url}}/users?statut=actif&role=VOTER&page=1
```

**Réponse succès (200 OK) :**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": "uuid",
        "email": "electeur1@universite.bj",
        "nom": "Marie Martin",
        "statut": "actif",
        "role": {
          "code": "VOTER",
          "nom": "Électeur"
        },
        "created_at": "2026-01-15T08:00:00.000000Z"
      },
      {
        "id": "uuid",
        "email": "nouveau@universite.bj",
        "nom": "Jean Dupont",
        "statut": "inactif",
        "role": {
          "code": "VOTER",
          "nom": "Électeur"
        },
        "created_at": "2026-02-04T10:30:00.000000Z"
      }
    ],
    "total": 15,
    "per_page": 20,
    "last_page": 1
  }
}
```

---

### 📌 ENDPOINT 3 : Modifier un utilisateur (ADMIN)

**Méthode :** `PUT`  
**URL :** `{{base_url}}/users/{{user_id}}`

**Headers :**
```
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```

**Body (JSON) :**
```json
{
  "nom": "Jean Dupont (Modifié)",
  "role_id": "uuid-nouveau-role",
  "statut": "actif"
}
```

**Note :** Tous les champs sont optionnels, seuls les champs fournis seront mis à jour.

**Réponse succès (200 OK) :**
```json
{
  "success": true,
  "message": "Utilisateur mis à jour avec succès",
  "data": {
    "id": "uuid",
    "email": "nouveau@universite.bj",
    "nom": "Jean Dupont (Modifié)",
    "statut": "actif",
    "role": {
      "code": "VOTER",
      "nom": "Électeur"
    }
  }
}
```

---

### 📌 ENDPOINT 4 : Désactiver un utilisateur (ADMIN)

**Méthode :** `DELETE`  
**URL :** `{{base_url}}/users/{{user_id}}`

**Headers :**
```
Authorization: Bearer {{admin_token}}
```

**Note :** Cette action ne supprime PAS l'utilisateur, elle passe juste son statut à "inactif" (soft delete).

**Réponse succès (200 OK) :**
```json
{
  "success": true,
  "message": "Utilisateur désactivé avec succès"
}
```

**Effet :** L'utilisateur ne peut plus se connecter (statut = inactif).

---

## 👤 ENDPOINTS UTILISATEUR - ACTIVATION COMPTE

### 📌 ENDPOINT 5 : Activer le compte (UTILISATEUR)

**Workflow :** 
1. Utilisateur clique lien dans email → Redirigé vers page activation
2. Frontend affiche formulaire "Choisir mot de passe"
3. Utilisateur saisit mot de passe → Appel API verify-account
4. Compte activé + connexion automatique

**Méthode :** `POST`  
**URL :** `{{base_url}}/auth/verify-account`

**Headers :**
```
Content-Type: application/json
Accept: application/json
```

**Body (JSON) :**
```json
{
  "token": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
  "password": "MonMotDePasse123!",
  "password_confirmation": "MonMotDePasse123!"
}
```

**Paramètres requis :**
| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `token` | string | ✅ Oui | Token reçu par email (64 caractères) |
| `password` | string | ✅ Oui | Mot de passe choisi (min 8 caractères) |
| `password_confirmation` | string | ✅ Oui | Confirmation du mot de passe |

**Règles de validation mot de passe :**
- Minimum 8 caractères
- Au moins 1 lettre majuscule
- Au moins 1 lettre minuscule
- Au moins 1 chiffre
- Au moins 1 caractère spécial (@$!%*?&#)

**Réponse succès (200 OK) :**
```json
{
  "success": true,
  "message": "Compte activé avec succès",
  "token": "2|xyz789abc456def123ghi890jkl567mno234pqr901",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "nouveau@universite.bj",
    "nom": "Jean Dupont",
    "role": "VOTER"
  }
}
```

**🔑 Important pour le Frontend :**
- Sauvegarder le `token` dans localStorage : `localStorage.setItem('auth_token', token)`
- Rediriger l'utilisateur vers son dashboard selon son rôle :
  - `ADMIN` → `/admin/dashboard`
  - `VOTER` → `/elections`
  - `AUDITOR` → `/audit`

**Réponses d'erreur :**

| Code | Message | Cause |
|------|---------|-------|
| 401 | Token invalide ou expiré | Token n'existe pas ou expiré (> 48h) |
| 422 | Validation failed | Mot de passe faible ou non conforme |
| 422 | Les mots de passe ne correspondent pas | password ≠ password_confirmation |

**Exemple erreur (422) :**
```json
{
  "message": "The password field must be at least 8 characters.",
  "errors": {
    "password": [
      "The password field must be at least 8 characters.",
      "The password field must contain at least one uppercase letter.",
      "The password field must contain at least one number."
    ]
  }
}
```

**✅ Script Post-request (connexion automatique) :**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("user_token", jsonData.token);
    console.log("✅ Compte activé et connecté : " + jsonData.user.email);
}
```

---

## 🔓 ENDPOINTS CONNEXION

### 📌 ENDPOINT 6 : Connexion classique (email + password)

**Workflow :** Utilisateur saisit email + mot de passe → Connexion si compte actif

**Méthode :** `POST`  
**URL :** `{{base_url}}/auth/login`

**Headers :**
```
Content-Type: application/json
Accept: application/json
```

**Body (JSON) :**
```json
{
  "email": "nouveau@universite.bj",
  "password": "MonMotDePasse123!"
}
```

**Paramètres requis :**
| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `email` | string | ✅ Oui | Email du compte |
| `password` | string | ✅ Oui | Mot de passe |

**Réponse succès (200 OK) :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "3|def456ghi789jkl012mno345pqr678stu901vwx234",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "nouveau@universite.bj",
    "nom": "Jean Dupont",
    "role": "VOTER"
  }
}
```

**🔑 Frontend - Actions après connexion :**
```javascript
// Sauvegarder token
localStorage.setItem('auth_token', response.token);

// Sauvegarder infos user
localStorage.setItem('user', JSON.stringify(response.user));

// Redirection selon rôle
if (response.user.role === 'ADMIN') {
  router.push('/admin/dashboard');
} else if (response.user.role === 'VOTER') {
  router.push('/elections');
} else if (response.user.role === 'AUDITOR') {
  router.push('/audit');
}
```

**Réponses d'erreur :**

| Code | Message | Cause |
|------|---------|-------|
| 401 | Identifiants incorrects | Email ou mot de passe invalide |
| 403 | Compte non activé ou désactivé | Statut ≠ actif |

**Exemple erreur (401) :**
```json
{
  "success": false,
  "message": "Identifiants incorrects"
}
```

**Exemple erreur (403) :**
```json
{
  "success": false,
  "message": "Compte non activé ou désactivé"
}
```

**⚠️ Protection anti-brute-force :**
- Maximum 5 tentatives échouées par 15 minutes
- Au-delà : erreur 429 (Too Many Requests)

**✅ Script Post-request :**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("user_token", jsonData.token);
    console.log("✅ Connecté : " + jsonData.user.email + " (" + jsonData.user.role + ")");
}
```

---

## 👨‍💻 ENDPOINTS PROFIL

### 📌 ENDPOINT 7 : Récupérer infos utilisateur connecté

**Méthode :** `GET`  
**URL :** `{{base_url}}/auth/me`

**Headers :**
```
Authorization: Bearer {{user_token}}
Accept: application/json
```

**Réponse succès (200 OK) :**
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "nouveau@universite.bj",
    "nom": "Jean Dupont",
    "role": "VOTER",
    "statut": "actif"
  }
}
```

**🔑 Frontend - Utilisation :**
```javascript
// Récupérer les infos au chargement de l'app
async function fetchCurrentUser() {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('http://localhost:8000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.ok) {
    const data = await response.json();
    // Mettre à jour le state global
    setUser(data.user);
  } else {
    // Token invalide → déconnexion
    logout();
  }
}
```

**Réponses d'erreur :**

| Code | Message | Cause |
|------|---------|-------|
| 401 | Unauthenticated | Token manquant, invalide ou expiré |

---

### 📌 ENDPOINT 8 : Déconnexion

**Méthode :** `POST`  
**URL :** `{{base_url}}/auth/logout`

**Headers :**
```
Authorization: Bearer {{user_token}}
Accept: application/json
```

**Réponse succès (200 OK) :**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

**🔑 Frontend - Actions après déconnexion :**
```javascript
// Supprimer le token
localStorage.removeItem('auth_token');
localStorage.removeItem('user');

// Rediriger vers login
router.push('/login');
```

---

## ❌ GESTION DES ERREURS

### Codes HTTP et signification

| Code | Nom | Signification | Action Frontend |
|------|-----|---------------|-----------------|
| 200 | OK | Requête réussie | Afficher succès |
| 201 | Created | Ressource créée | Afficher succès |
| 401 | Unauthorized | Non authentifié | Rediriger vers login |
| 403 | Forbidden | Accès refusé (rôle) | Afficher erreur + bloquer action |
| 404 | Not Found | Ressource inexistante | Afficher "introuvable" |
| 422 | Unprocessable Entity | Validation échouée | Afficher erreurs champs |
| 429 | Too Many Requests | Rate limit dépassé | Afficher "trop de tentatives" |
| 500 | Server Error | Erreur serveur | Afficher "erreur serveur" |

### Structure erreurs de validation (422)

```json
{
  "message": "The email has already been taken. (and 1 more error)",
  "errors": {
    "email": [
      "The email has already been taken."
    ],
    "password": [
      "The password field must be at least 8 characters."
    ]
  }
}
```

**🔑 Frontend - Affichage erreurs :**
```javascript
if (response.status === 422) {
  const data = await response.json();
  
  // Afficher erreurs par champ
  Object.keys(data.errors).forEach(field => {
    const messages = data.errors[field];
    displayFieldError(field, messages[0]); // Première erreur
  });
}
```

---

## 📦 COLLECTION POSTMAN COMPLÈTE

### Structure de la collection

```
E-Voting Auth
├── 1. Admin - Gestion Users
│   ├── 1.1 Login Admin
│   ├── 1.2 Créer utilisateur
│   ├── 1.3 Lister utilisateurs
│   ├── 1.4 Modifier utilisateur
│   └── 1.5 Désactiver utilisateur
│
├── 2. Activation Compte
│   └── 2.1 Activer compte (verify-account)
│
├── 3. Connexion
│   ├── 3.1 Login (email + password)
│   └── 3.2 Login (erreur identifiants)
│
└── 4. Profil
    ├── 4.1 Récupérer infos (/me)
    └── 4.2 Déconnexion (/logout)
```

### Variables à configurer

```json
{
  "base_url": "http://localhost:8000/api",
  "admin_token": "",
  "user_token": "",
  "user_id": "",
  "user_email": "test@universite.bj",
  "verification_token": ""
}
```

---

## 🧪 SCÉNARIO DE TEST COMPLET

### Test 1 : Création utilisateur par admin

```
1. POST /auth/login (admin)
   → Sauvegarder admin_token

2. POST /users
   Headers: Authorization: Bearer {{admin_token}}
   Body: { email, nom, role_id }
   → Sauvegarder user_id
   → ✅ Vérifier email reçu (Mailtrap)
   → Copier token de l'email
```

---

### Test 2 : Activation compte utilisateur

```
3. POST /auth/verify-account
   Body: { 
     token: "...", 
     password: "Test1234!", 
     password_confirmation: "Test1234!" 
   }
   → Sauvegarder user_token
   → ✅ Vérifier statut = actif
   → ✅ Vérifier token retourné
```

---

### Test 3 : Connexion utilisateur

```
4. POST /auth/login
   Body: { 
     email: "test@universite.bj", 
     password: "Test1234!" 
   }
   → ✅ Vérifier token retourné
   → ✅ Vérifier user.role correct
```

---

### Test 4 : Vérifier profil

```
5. GET /auth/me
   Headers: Authorization: Bearer {{user_token}}
   → ✅ Vérifier infos user retournées
```

---

### Test 5 : Déconnexion

```
6. POST /auth/logout
   Headers: Authorization: Bearer {{user_token}}
   → ✅ Vérifier message succès

7. GET /auth/me (avec ancien token)
   → ✅ Doit retourner 401 (token révoqué)
```

---

## 🔑 CHECKLIST INTÉGRATION FRONTEND

### Page Activation Compte

- [ ] Extraire token de l'URL (`?token=...`)
- [ ] Afficher formulaire : 2 champs password + bouton
- [ ] Validation client : min 8 car, 1 maj, 1 min, 1 chiffre, 1 spécial
- [ ] Appel POST `/auth/verify-account`
- [ ] Si succès : sauvegarder token + rediriger dashboard
- [ ] Si erreur : afficher message + rester sur page

### Page Login

- [ ] Formulaire : email + password
- [ ] Appel POST `/auth/login`
- [ ] Si succès : sauvegarder token + rediriger selon rôle
- [ ] Si 401 : afficher "Identifiants incorrects"
- [ ] Si 403 : afficher "Compte non activé"
- [ ] Limiter à 5 tentatives (gérer 429)

### Axios Interceptor

```javascript
// Ajouter token automatiquement
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gérer 401 global (déconnexion auto)
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Protection Routes

```javascript
// Route guard (React Router exemple)
function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('auth_token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" />;
  }
  
  return children;
}
```

---

## 📞 SUPPORT & DEBUGGING

### Vérifier token JWT

```javascript
// Décoder token (sans vérifier signature)
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')
  );
  return JSON.parse(jsonPayload);
}

const decoded = parseJwt(token);
console.log('User ID:', decoded.sub);
console.log('Expire:', new Date(decoded.exp * 1000));
```

### Logs backend utiles

```bash
# Voir logs Laravel
tail -f storage/logs/laravel.log

# Voir requêtes SQL
DB::enableQueryLog();
// ... requêtes
dd(DB::getQueryLog());
```

---

**Document généré par Claude**  
**Date : 04 février 2026**  
**Version : 1.0 - Module Auth avec workflow mot de passe**
