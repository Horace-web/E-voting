# Spécification API Backend - E-Vote

## 📋 Vue d'ensemble

Ce document spécifie **tous les endpoints API** que le backend Laravel doit implémenter pour l'intégration avec le frontend React.

**Base URL** : `http://localhost:8000/api` (développement)  
**Production** : À définir (ex: `https://evote.universite.bj/api`)

---

## 🔐 Authentification

Toutes les routes protégées nécessitent un token JWT dans le header :
```
Authorization: Bearer {token}
```

### Middleware Laravel requis :
- `auth:sanctum` : Routes authentifiées
- `role:admin` : Routes admin uniquement
- `role:voter` : Routes électeur uniquement
- `role:auditor` : Routes auditeur uniquement

---

## 📡 Endpoints API

### 1️⃣ AUTHENTIFICATION

#### `POST /api/auth/login`
**Connexion avec email + mot de passe**

**Request Body** :
```json
{
  "email": "electeur@universite.bj",
  "password": "TempPass123!"
}
```

**Response 200 OK** :
```json
{
  "success": true,
  "token": "1|abc123...",
  "user": {
    "id": "uuid",
    "email": "electeur@universite.bj",
    "nom": "Dupont Jean",
    "role": "voter",
    "statut": "Actif"
  }
}
```

**Erreurs** :
- `401 Unauthorized` : Email/password incorrect
- `403 Forbidden` : Compte inactif (non confirmé)
- `429 Too Many Requests` : Rate limit dépassé (5 tentatives/15min)

---

#### `GET /api/auth/confirm/{token}`
**Confirmation d'inscription via lien email**

**Paramètres** :
- `token` : Token 64 caractères (expire 48h)

**Response 200 OK** :
```json
{
  "success": true,
  "message": "Votre compte a été activé avec succès",
  "email": "electeur@universite.bj",
  "password": "TempPass123!"
}
```

**Logique backend** :
1. Vérifier token existe et non expiré (`expire_at > now()`)
2. Récupérer `user_id` depuis `tokens_confirmation`
3. Changer `users.statut` : `Inactif` → `Actif`
4. Récupérer password depuis `passwords_temporary`
5. Envoyer **Email 2** (identifiants)
6. **Supprimer** entrées `tokens_confirmation` + `passwords_temporary`
7. Retourner email + password

**Erreurs** :
- `404 Not Found` : Token invalide ou expiré

---

#### `POST /api/auth/logout`
**Déconnexion**

**Headers** : `Authorization: Bearer {token}`

**Response 200 OK** :
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

**Logique backend** :
- Invalider le token Sanctum actuel

---

#### `POST /api/auth/resend-confirmation`
**Renvoyer le lien de confirmation**

**Request Body** :
```json
{
  "email": "electeur@universite.bj"
}
```

**Response 200 OK** :
```json
{
  "success": true,
  "message": "Un nouveau lien de confirmation a été envoyé"
}
```

**Logique backend** :
1. Vérifier email existe et statut = `Inactif`
2. Générer nouveau token (supprimer ancien si existe)
3. Renvoyer Email 1 (confirmation)

---

### 2️⃣ UTILISATEURS (Admin)

#### `POST /api/users`
**Créer un utilisateur**

**Headers** : `Authorization: Bearer {token}` (Admin)

**Request Body** :
```json
{
  "email": "nouveau@universite.bj",
  "nom": "Nom Complet",
  "prenom": "Prénom",
  "role_id": "uuid-role-voter"
}
```

**Logique backend (WORKFLOW COMPLET)** :
1. Générer password aléatoire 12 caractères (majuscules, minuscules, chiffres, spéciaux)
2. Hasher avec `bcrypt` : `$password_hash = Hash::make($password)`
3. **TRANSACTION** :
   - `INSERT users` : email, nom, `password_hash`, role_id, statut=`Inactif`
   - `INSERT tokens_confirmation` : user_id, token (64 chars), expire_at (+48h)
   - `INSERT passwords_temporary` : user_id, `password_plain`, expire_at (+48h)
4. Envoyer **Email 1** : Lien confirmation `https://evote.app/confirm/{token}`
5. **COMMIT**

**Response 201 Created** :
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "nouveau@universite.bj",
    "nom": "Nom Complet",
    "role": "voter",
    "statut": "Inactif"
  },
  "message": "Utilisateur créé. Email de confirmation envoyé."
}
```

---

#### `GET /api/users`
**Liste des utilisateurs (avec pagination)**

**Headers** : `Authorization: Bearer {token}` (Admin)

**Query Params** :
```
?page=1&limit=20&search=dupont&role=voter&statut=Actif
```

**Response 200 OK** :
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@universite.bj",
      "nom": "Dupont Jean",
      "role": "voter",
      "statut": "Actif",
      "created_at": "2026-01-15T10:00:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

---

### 3️⃣ ÉLECTIONS

#### `POST /api/elections`
**Créer une élection**

**Headers** : `Authorization: Bearer {token}` (Admin)

**Request Body** :
```json
{
  "titre": "Délégué de Classe L3 Info",
  "description": "Élection du délégué...",
  "date_ouverture": "2026-02-10T08:00:00Z",
  "date_cloture": "2026-02-15T18:00:00Z"
}
```

**Validations** :
- `date_cloture` > `date_ouverture`
- Dates futures (optionnel)

**Response 201 Created** :
```json
{
  "success": true,
  "election": {
    "id": "uuid",
    "titre": "Délégué de Classe L3 Info",
    "statut": "Brouillon",
    "date_ouverture": "2026-02-10T08:00:00Z",
    "date_cloture": "2026-02-15T18:00:00Z"
  }
}
```

---

#### `GET /api/elections`
**Liste des élections**

**Headers** : `Authorization: Bearer {token}`

**Filtrage selon rôle** :
- **Admin** : Toutes les élections
- **Électeur** : Seulement `statut IN (Publiée, EnCours, Clôturée)`

**Query Params** : `?statut=EnCours&page=1&limit=20`

**Response 200 OK** :
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "titre": "Délégué de Classe L3 Info",
      "description": "...",
      "statut": "EnCours",
      "date_ouverture": "2026-02-10T08:00:00Z",
      "date_cloture": "2026-02-15T18:00:00Z",
      "total_votes": 156,
      "total_candidats": 4,
      "has_voted": false
    }
  ],
  "total": 12
}
```

**Note** : `has_voted` = vérifier dans `participations` si `user_id` + `election_id` existe

---

#### `POST /api/elections/{id}/publish`
**Publier une élection**

**Headers** : `Authorization: Bearer {token}` (Admin)

**Validations** :
- Statut actuel = `Brouillon`
- Au moins 2 candidats

**Response 200 OK** :
```json
{
  "success": true,
  "election": {
    "id": "uuid",
    "statut": "Publiée"
  }
}
```

---

### 4️⃣ CANDIDATS

#### `POST /api/elections/{electionId}/candidates`
**Ajouter un candidat**

**Headers** : `Authorization: Bearer {token}` (Admin)

**Request Body** :
```json
{
  "nom": "Marie Martin",
  "photo_url": "https://storage.app/photos/marie.jpg",
  "programme": "Améliorer la communication...",
  "ordre_affichage": 1
}
```

**Response 201 Created** :
```json
{
  "success": true,
  "candidate": {
    "id": "uuid",
    "election_id": "uuid",
    "nom": "Marie Martin",
    "photo_url": "...",
    "programme": "...",
    "ordre_affichage": 1
  }
}
```

---

### 5️⃣ VOTE

#### `POST /api/elections/{id}/vote`
**Soumettre un vote**

**Headers** : `Authorization: Bearer {token}` (Électeur)

**Request Body** :
```json
{
  "candidat_id": "uuid-candidat"
}
```

**Validations** :
1. Élection statut = `EnCours`
2. Électeur n'a **pas déjà voté** (vérifier `participations`)
3. Candidat appartient à cette élection
4. Électeur statut = `Actif`

**Logique backend (TRANSACTION ATOMIQUE)** :
```php
DB::transaction(function () use ($electionId, $candidatId, $userId) {
    // 1. Vérifier pas déjà voté
    $hasVoted = Participation::where('election_id', $electionId)
        ->where('user_id', $userId)
        ->exists();
    
    if ($hasVoted) {
        throw new Exception('Vous avez déjà voté');
    }
    
    // 2. Créer bulletin ANONYME (AUCUNE référence user_id)
    $bulletin = Bulletin::create([
        'id' => Str::uuid(),
        'election_id' => $electionId,
        'candidat_id' => $candidatId,
        'hash_verification' => hash('sha256', uniqid()),
        'created_at' => now(),
    ]);
    
    // 3. Marquer participation (SÉPARÉ du bulletin)
    Participation::create([
        'id' => Str::uuid(),
        'election_id' => $electionId,
        'user_id' => $userId,
        'a_vote' => true,
        'created_at' => now(),
    ]);
    
    // 4. Log audit
    AuditLog::create([
        'user_id' => $userId,
        'action_type' => 'VOTE',
        'description' => "Vote soumis pour élection $electionId",
        // PAS de details_json avec candidat_id (anonymat)
        'resultat' => 'SUCCESS',
    ]);
});
```

**Response 200 OK** :
```json
{
  "success": true,
  "message": "Votre vote a été enregistré avec succès"
}
```

**Erreurs** :
- `403 Forbidden` : Déjà voté
- `400 Bad Request` : Élection non en cours

---

#### `GET /api/elections/{id}/has-voted`
**Vérifier si déjà voté**

**Headers** : `Authorization: Bearer {token}` (Électeur)

**Response 200 OK** :
```json
{
  "success": true,
  "has_voted": true
}
```

---

### 6️⃣ RÉSULTATS

#### `GET /api/elections/{id}/results`
**Consulter les résultats**

**Headers** : `Authorization: Bearer {token}`

**Contrôle d'accès** :
- **Admin** : Toujours
- **Électeur** : Seulement si `resultats.publie = true`

**Response 200 OK** :
```json
{
  "success": true,
  "results": {
    "election_id": "uuid",
    "total_votes": 892,
    "total_electeurs": 950,
    "taux_participation": 93.89,
    "candidats": [
      {
        "candidat_id": "uuid",
        "nom": "Marie Martin",
        "nb_votes": 520,
        "pourcentage": 58.3,
        "rang": 1
      },
      {
        "candidat_id": "uuid",
        "nom": "Jean Dupont",
        "nb_votes": 372,
        "pourcentage": 41.7,
        "rang": 2
      }
    ],
    "publie": true
  }
}
```

**Logique dépouillement (automatique à `date_cloture`)** :
```php
// Job Laravel : CountVotesJob (planifié toutes les minutes)
$results = Bulletin::where('election_id', $electionId)
    ->select('candidat_id', DB::raw('COUNT(*) as nb_votes'))
    ->groupBy('candidat_id')
    ->get();

Resultat::updateOrCreate(
    ['election_id' => $electionId],
    [
        'total_votes' => $results->sum('nb_votes'),
        'resultats_json' => $results->toJson(),
        'taux_participation' => ...,
    ]
);
```

---

### 7️⃣ AUDIT

#### `GET /api/audit/logs`
**Consulter les logs**

**Headers** : `Authorization: Bearer {token}` (Admin/Auditeur)

**Query Params** :
```
?page=1&limit=50&dateDebut=2026-02-01&dateFin=2026-02-28&action=VOTE&user_id=uuid&resultat=SUCCESS
```

**Response 200 OK** :
```json
{
  "success": true,
  "logs": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "user_nom": "Jean Dupont",
      "action_type": "VOTE",
      "description": "Vote soumis pour élection...",
      "ip_address": "192.168.1.1",
      "resultat": "SUCCESS",
      "created_at": "2026-02-04T14:30:00Z"
    }
  ],
  "total": 5420
}
```

---

## 🗄️ Structure Base de Données

### Tables principales :

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nom VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id UUID NOT NULL,
  statut ENUM('Inactif', 'Actif') DEFAULT 'Inactif',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Tokens confirmation
CREATE TABLE tokens_confirmation (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  token VARCHAR(64) UNIQUE NOT NULL,
  expire_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Passwords temporaires
CREATE TABLE passwords_temporary (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  password_plain TEXT NOT NULL,
  expire_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bulletins (ANONYMES)
CREATE TABLE bulletins (
  id UUID PRIMARY KEY,
  election_id UUID NOT NULL,
  candidat_id UUID NOT NULL,
  hash_verification VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL
  -- AUCUNE colonne user_id !!!
);

-- Participations (qui a voté, SÉPARÉ)
CREATE TABLE participations (
  id UUID PRIMARY KEY,
  election_id UUID NOT NULL,
  user_id UUID NOT NULL,
  a_vote BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  UNIQUE KEY (election_id, user_id)
);
```

---

## 📧 Templates Emails

### Email 1 : Confirmation
**Sujet** : Confirmez votre inscription - E-Vote

```
Bonjour,

Votre compte E-Vote a été créé par l'administrateur.

Pour activer votre compte, cliquez sur le lien ci-dessous :
{{ $confirmationUrl }}

⚠️ Ce lien expire dans 48 heures.

Cordialement,
L'équipe E-Vote
```

### Email 2 : Identifiants
**Sujet** : Vos identifiants de connexion - E-Vote

```
Bonjour,

Votre compte a été activé avec succès !

Vos identifiants de connexion :
📧 Email : {{ $email }}
🔐 Mot de passe : {{ $password }}

Vous pouvez maintenant vous connecter sur :
{{ $appUrl }}/login

Cordialement,
L'équipe E-Vote
```

---

## 🔒 Sécurité

### Rate Limiting
```php
// routes/api.php
Route::middleware(['throttle:5,15'])->group(function () {
    Route::post('/auth/login', ...);
});
```

### CORS Configuration
```php
// config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:5173', 'https://evote.universite.bj'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

---

## ✅ Checklist Backend

- [ ] Migrations DB (users, tokens_confirmation, passwords_temporary, etc.)
- [ ] Models Eloquent + Relations
- [ ] Controllers (AuthController, UserController, ElectionController, VoteController, etc.)
- [ ] Middleware (auth:sanctum, role:admin, etc.)
- [ ] Rate limiting (5 tentatives/15min sur login)
- [ ] Validation FormRequest
- [ ] Service génération password aléatoire
- [ ] Mails (ConfirmationMail, CredentialsMail)
- [ ] Job dépouillement automatique (CountVotesJob)
- [ ] Cron job nettoyage tokens/passwords expirés
- [ ] Tests unitaires (PHPUnit)
- [ ] HTTPS en production
- [ ] CORS configuré

---

**Équipe E-Vote** | Février 2026
