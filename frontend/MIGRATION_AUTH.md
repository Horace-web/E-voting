# Guide de Migration - Système d'Authentification

## Date : 6 Février 2026
## Version : 1.1 - Authentification par Mot de Passe

---

## 📋 Résumé des Changements

L'application a migré d'un système d'authentification par **OTP (One-Time Password)** vers un système d'authentification par **Email + Mot de Passe** avec confirmation d'inscription par lien email.

---

## 🔄 Ancien vs Nouveau Workflow

### ⚠️ ANCIEN SYSTÈME (OTP)

1. Utilisateur entre son email
2. Système envoie code OTP (6 chiffres) valide 10 minutes
3. Utilisateur saisit le code OTP
4. Connexion réussie → redirection

### ✅ NOUVEAU SYSTÈME (Email + Password)

#### **Étape 1 : Création par l'administrateur**
- Admin crée un compte (email, nom, prénom, rôle)
- Système génère automatiquement un **mot de passe aléatoire** (12 caractères)
- Statut utilisateur : **Inactif**
- **Email 1** envoyé : Lien de confirmation (valide **48 heures**)

#### **Étape 2 : Confirmation par l'utilisateur**
- L'utilisateur clique sur le lien : `/confirm/{token}`
- Système vérifie le token (validité + expiration)
- Statut passe de **Inactif** → **Actif**
- **Email 2** envoyé : Email + Mot de passe (affiché aussi sur la page de confirmation)

#### **Étape 3 : Première connexion**
- L'utilisateur se connecte avec **email + password**
- Vérification : `Hash::check(password, password_hash)`
- Génération token JWT (Laravel Sanctum)
- Redirection selon le rôle (Admin/Électeur)

#### **Étape 4 : Connexions suivantes**
- Email + Password → Vérification bcrypt → Session

---

## 📦 Fichiers Modifiés

### **Services**
- ✅ `src/services/auth.service.js`
  - ❌ Supprimé : `sendOTP()`, `verifyOTP()`, `resendOTP()`
  - ✅ Ajouté : `login(email, password)`, `confirmAccount(token)`, `resendConfirmationLink(email)`

### **Pages**
- ✅ `src/pages/Login.jsx` - **Complètement refactorisé**
  - Formulaire email + password (au lieu d'email uniquement)
  - Affichage/masquage du mot de passe (Eye icon)
  - Gestion erreurs : compte inactif (403), identifiants incorrects (401)
  
- ✅ `src/pages/ConfirmAccount.jsx` - **NOUVEAU**
  - Page de confirmation après clic sur lien email
  - Affiche les identifiants (email + password) après confirmation
  - Gestion états : loading, success, error
  - Redirection vers `/login` après confirmation

- ⚠️ `src/pages/Otp.jsx` - **À SUPPRIMER** (obsolète)

### **Routes**
- ✅ `src/routes/AppRoutes.jsx`
  - ❌ Supprimé : `<Route path="/otp" element={<Otp />} />`
  - ✅ Ajouté : `<Route path="/confirm/:token" element={<ConfirmAccount />} />`

### **Configuration**
- ✅ `src/config/app.config.js` - Inchangé (useMockData compatible)

---

## 🔐 Sécurité

### Hachage des Mots de Passe
- **Algorithme** : bcrypt (cost=10)
- **Framework** : Laravel `Hash::make()` et `Hash::check()`
- **Stockage** : Seulement le hash dans `users.password_hash`

### Stockage Temporaire
- Table dédiée : `passwords_temporary`
- Contient le **password en clair** (UNIQUEMENT pour l'envoi par email)
- **Durée de vie** : 48 heures max
- **Suppression** : Immédiate après envoi email 2
- **Cron job** : Nettoie les entrées expirées toutes les heures

### Tokens de Confirmation
- **Longueur** : 64 caractères (généré aléatoirement)
- **Expiration** : 48 heures
- **Unicité** : Contrainte UNIQUE sur `user_id`
- **Suppression** : Après confirmation réussie

### Protection Attaques
- **Rate limiting** : 5 tentatives / 15 min / IP
- **HTTPS** : Obligatoire (TLS 1.3)
- **CSRF** : Tokens Laravel automatiques
- **SQL Injection** : Eloquent ORM protège

---

## 🔌 API Endpoints (Backend)

### À Implémenter

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "electeur@universite.bj",
  "password": "TempPass123!"
}

Response 200 OK:
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "uuid",
    "email": "electeur@universite.bj",
    "nom": "Nom Complet",
    "role": "voter"
  }
}

Response 401 Unauthorized:
{
  "success": false,
  "message": "Email ou mot de passe incorrect"
}

Response 403 Forbidden:
{
  "success": false,
  "message": "Votre compte n'est pas encore activé"
}
```

```http
GET /api/auth/confirm/{token}

Response 200 OK:
{
  "success": true,
  "message": "Votre compte a été activé avec succès",
  "email": "electeur@universite.bj",
  "password": "TempPass123!"
}

Response 404 Not Found:
{
  "success": false,
  "message": "Lien de confirmation invalide ou expiré"
}
```

```http
POST /api/auth/resend-confirmation
Content-Type: application/json

{
  "email": "electeur@universite.bj"
}

Response 200 OK:
{
  "success": true,
  "message": "Un nouveau lien de confirmation a été envoyé"
}
```

---

## 📊 Base de Données

### Tables Modifiées/Ajoutées

#### **users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nom VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- bcrypt hash
  role_id UUID NOT NULL,
  statut ENUM('Inactif', 'Actif') DEFAULT 'Inactif',
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

#### **tokens_confirmation** (NOUVELLE)
```sql
CREATE TABLE tokens_confirmation (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL, -- Contrainte UNIQUE
  token VARCHAR(64) UNIQUE NOT NULL,
  expire_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### **passwords_temporary** (NOUVELLE)
```sql
CREATE TABLE passwords_temporary (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL, -- Contrainte UNIQUE
  password_plain TEXT NOT NULL, -- Mot de passe CLAIR (temporaire)
  expire_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### **codes_otp** - ⚠️ **À SUPPRIMER** (obsolète)

---

## 📧 Emails à Configurer

### Email 1 : Confirmation d'Inscription
**Sujet** : Confirmez votre inscription - E-Vote

**Corps** :
```
Bonjour,

Votre compte E-Vote a été créé par l'administrateur.

Pour activer votre compte, cliquez sur le lien ci-dessous :
https://evote.universite.bj/confirm/{TOKEN}

⚠️ Ce lien expire dans 48 heures.

Cordialement,
L'équipe E-Vote
```

### Email 2 : Identifiants de Connexion
**Sujet** : Vos identifiants de connexion - E-Vote

**Corps** :
```
Bonjour,

Votre compte a été activé avec succès !

Vos identifiants de connexion :
📧 Email : {EMAIL}
🔐 Mot de passe : {PASSWORD}

Vous pouvez maintenant vous connecter sur :
https://evote.universite.bj/login

Cordialement,
L'équipe E-Vote
```

---

## ✅ Checklist Migration Backend

- [ ] Créer migration `create_tokens_confirmation_table`
- [ ] Créer migration `create_passwords_temporary_table`
- [ ] Modifier migration `users` : ajouter `password_hash`, `statut`
- [ ] Supprimer migration `create_codes_otp_table`
- [ ] Implémenter `POST /api/auth/login`
- [ ] Implémenter `GET /api/auth/confirm/{token}`
- [ ] Implémenter `POST /api/auth/resend-confirmation`
- [ ] Configurer génération mot de passe aléatoire (12 caractères)
- [ ] Configurer envoi Email 1 (confirmation)
- [ ] Configurer envoi Email 2 (identifiants)
- [ ] Créer Cron job nettoyage tokens/passwords expirés
- [ ] Tester workflow complet en local
- [ ] Configurer rate limiting (5 tentatives/15min)
- [ ] Activer HTTPS en production

---

## 🧪 Tests Frontend (Mode Mock)

Le frontend fonctionne en mode **mock** (simulation) par défaut : Activer/désactiver via `src/config/app.config.js` :

```javascript
useMockData: true  // true = mode simulation, false = appels API réels
```

### Test Workflow Complet

1. **Login avec compte inactif** (simulé) :
   - Email : `test@universite.bj`
   - Password : `password123`
   - **Attendu** : Erreur 403 "Compte non activé"

2. **Confirmation** :
   - Ouvrir : `http://localhost:5173/confirm/fake-token-12345`
   - **Attendu** : Affichage identifiants simulés

3. **Login après confirmation** :
   - Email : `electeur@universite.bj`
   - Password : `TempPass123!`
   - **Attendu** : Redirection `/electeur`

4. **Login Admin** :
   - Email : `admin@universite.bj`
   - Password : `AdminPass123!`
   - **Attendu** : Redirection `/admin`

---

## 📝 Notes Importantes

1. ⚠️ **Sécurité** : Le mot de passe en clair existe temporairement dans `passwords_temporary`. C'est un compromis accepté car :
   - Durée de vie limitée (48h max)
   - Table dédiée séparée
   - Suppression automatique
   - Nécessaire pour envoyer les identifiants par email

2. ✅ **Workflow standard** : Ce système suit les bonnes pratiques des plateformes modernes (confirmation email + password).

3. 🔒 **Hash bcrypt** : Tous les passwords sont hachés avec bcrypt avant stockage dans `users.password_hash`.

4. ⏰ **Expiration** : Tokens et passwords temporaires sont nettoyés automatiquement par cron job.

---

## 🚀 Prochaines Étapes

1. Backend Laravel : Implémenter les endpoints selon cette doc
2. Configurer service SMTP pour envoi emails
3. Tester workflow complet en environnement de dev
4. Déployer en production avec HTTPS activé

---

**Équipe E-Vote** | Février 2026
