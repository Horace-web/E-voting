# Guide d'Intégration Backend - E-Vote

## 📖 Introduction

Ce guide explique comment **intégrer le backend Laravel** avec le frontend React. Toute la structure des routes API est centralisée et documentée.

---

## 🗂️ Architecture des Routes

### Fichier clé : `src/config/api.routes.js`

Ce fichier contient **TOUTES** les routes API mappées. Exemple :

```javascript
import API_ROUTES from "../config/api.routes";

// Utilisation :
api.post(API_ROUTES.AUTH.LOGIN, { email, password });
api.get(API_ROUTES.ELECTIONS.LIST);
api.post(API_ROUTES.VOTE.SUBMIT(electionId), { candidat_id });
```

**Avantages** :
- ✅ Routes centralisées → facile à maintenir
- ✅ Typage et autocomplétion
- ✅ Documentation intégrée (commentaires JSDoc)
- ✅ Facile de changer l'URL de base (dev/prod)

---

## 🔧 Configuration

### 1️⃣ Créer le fichier `.env`

Copiez `.env.example` vers `.env` :

```bash
cp .env.example .env
```

### 2️⃣ Configurer l'URL de base

Éditez `.env` :

```env
# Développement
VITE_API_URL=http://localhost:8000/api

# Production
# VITE_API_URL=https://evote.universite.bj/api
```

### 3️⃣ Vérifier axios.js

Le fichier `src/api/axios.js` doit lire cette variable :

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 📡 Mapping Routes Frontend ↔️ Backend

| Frontend Service | Route API | Backend Laravel Route | Controller@Method |
|-----------------|-----------|----------------------|------------------|
| `authService.login()` | `POST /auth/login` | `Route::post('/auth/login', ...)` | `AuthController@login` |
| `authService.confirmAccount()` | `GET /auth/confirm/{token}` | `Route::get('/auth/confirm/{token}', ...)` | `AuthController@confirm` |
| `electionService.getAll()` | `GET /elections` | `Route::get('/elections', ...)` | `ElectionController@index` |
| `electionService.create()` | `POST /elections` | `Route::post('/elections', ...)` | `ElectionController@store` |
| `voteService.submit()` | `POST /elections/{id}/vote` | `Route::post('/elections/{id}/vote', ...)` | `VoteController@submit` |

**📄 Voir** `BACKEND_API_SPEC.md` pour la liste **complète** avec :
- Request body attendu
- Response format
- Codes d'erreur
- Validations requises
- Exemples cURL

---

## 🚀 Démarrage

### Frontend

```bash
cd frontend
npm install
npm run dev
```

→ Ouvre `http://localhost:5173`

### Backend Laravel (à implémenter)

```bash
cd backend
composer install
php artisan migrate
php artisan serve
```

→ API disponible sur `http://localhost:8000/api`

---

## 🔄 Workflow d'Intégration

### 1️⃣ Phase 1 : Authentification

**Frontend prêt** :
- ✅ `Login.jsx` avec formulaire email + password
- ✅ `ConfirmAccount.jsx` pour activation
- ✅ `authService.js` avec `login()`, `confirmAccount()`, `logout()`

**Backend à implémenter** :
- [ ] `POST /api/auth/login` → Vérifier bcrypt, retourner token JWT
- [ ] `GET /api/auth/confirm/{token}` → Activer utilisateur, retourner credentials
- [ ] Middleware `auth:sanctum` pour routes protégées

**Test** :
```bash
# 1. Créer un utilisateur manuellement en DB
# 2. Tester login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@universite.bj","password":"Test123!"}'

# Devrait retourner :
{
  "success": true,
  "token": "1|abc123...",
  "user": {
    "id": "uuid",
    "email": "test@universite.bj",
    "role": "voter"
  }
}
```

---

### 2️⃣ Phase 2 : Élections

**Frontend prêt** :
- ✅ `ElecteurElections.jsx` affiche liste des élections
- ✅ `electionService.getAll()` appelle `GET /elections`

**Backend à implémenter** :
- [ ] `GET /api/elections` → Filtrer selon rôle (admin = tout, voter = publiées)
- [ ] `POST /api/elections` → Créer élection (admin)
- [ ] `POST /api/elections/{id}/publish` → Publier

**Test** :
```bash
# Liste élections (avec token)
curl -X GET http://localhost:8000/api/elections \
  -H "Authorization: Bearer {TOKEN}"
```

---

### 3️⃣ Phase 3 : Vote

**Frontend prêt** :
- ✅ `ElecteurVote.jsx` formulaire de vote
- ✅ `voteService.submit()` appelle `POST /elections/{id}/vote`

**Backend à implémenter** :
- [ ] `POST /api/elections/{id}/vote` → **TRANSACTION ATOMIQUE** (voir BACKEND_API_SPEC.md)
  - Vérifier pas déjà voté
  - Créer bulletin ANONYME
  - Créer participation
  - Log audit

**⚠️ CRITIQUE** : Respecter l'anonymat du vote (voir section sécurité)

---

### 4️⃣ Phase 4 : Résultats

**Frontend prêt** :
- ✅ `ElecteurResults.jsx` affiche résultats
- ✅ Appelle `GET /elections/{id}/results`

**Backend à implémenter** :
- [ ] `GET /api/elections/{id}/results` → Dépouillement automatique
- [ ] Job Laravel `CountVotesJob` lancé à `date_cloture`

---

## 🔐 Sécurité & Anonymat

### Séparation bulletins ↔️ participations

**❌ MAUVAIS** (permet de relier électeur → choix) :
```sql
CREATE TABLE votes (
  user_id UUID,  -- ⚠️ Ne JAMAIS stocker ça !
  candidat_id UUID
);
```

**✅ BON** (anonymat garanti) :
```sql
-- Table 1 : Bulletins ANONYMES
CREATE TABLE bulletins (
  id UUID PRIMARY KEY,
  election_id UUID,
  candidat_id UUID,
  hash_verification VARCHAR(64),
  created_at TIMESTAMP
  -- AUCUNE référence user_id !
);

-- Table 2 : Participations (QUI a voté, PAS pour qui)
CREATE TABLE participations (
  id UUID PRIMARY KEY,
  election_id UUID,
  user_id UUID,
  a_vote BOOLEAN,
  created_at TIMESTAMP,
  UNIQUE KEY (election_id, user_id)
);
```

**Workflow vote** :
1. Vérifier `participations` → Si existe déjà pour (election, user) = REFUSER
2. Créer `bulletin` **sans** user_id
3. Créer `participation` (marquer que cet user a voté)
4. **IMPOSSIBLE** de savoir qui a voté pour qui ✅

---

## 🧪 Tests d'Intégration

### Checklist avant production

#### Authentification
- [ ] Login avec bon email/password retourne token
- [ ] Login avec mauvais password retourne 401
- [ ] Login compte inactif retourne 403
- [ ] Confirmation token valide active compte + envoie email credentials
- [ ] Confirmation token expiré retourne 404

#### Élections
- [ ] Électeur voit seulement élections publiées/en cours
- [ ] Admin voit toutes les élections (brouillon inclus)
- [ ] Publication élection change statut Brouillon → Publiée
- [ ] Impossible publier si < 2 candidats

#### Vote
- [ ] Vote avec token valide fonctionne
- [ ] Vote sans token retourne 401
- [ ] Double vote sur même élection retourne 403
- [ ] Vote après clôture retourne 400
- [ ] Bulletin créé SANS user_id (anonymat)

#### Résultats
- [ ] Dépouillement auto après date_cloture
- [ ] Électeur voit résultats seulement si publiés
- [ ] Admin voit toujours les résultats
- [ ] Total votes = COUNT(bulletins)
- [ ] Taux participation = votes / nb_électeurs

---

## 📊 Monitoring & Logs

### Logs attendus (Laravel)

```php
// Log connexion
Log::info('User logged in', [
    'user_id' => $user->id,
    'ip' => $request->ip(),
]);

// Log vote (SANS révéler choix)
Log::info('Vote submitted', [
    'election_id' => $electionId,
    'user_id' => $userId,
    // PAS de candidat_id !
]);

// Log erreur
Log::error('Vote failed', [
    'election_id' => $electionId,
    'error' => $e->getMessage(),
]);
```

### Table audit

Créer `audit_logs` :

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID,
  action_type VARCHAR(50),  -- LOGIN, VOTE, CREATE_ELECTION, etc.
  description TEXT,
  ip_address VARCHAR(45),
  resultat ENUM('SUCCESS', 'FAILED'),
  created_at TIMESTAMP
);
```

---

## 🐛 Debugging

### Activer mode Mock (frontend sans backend)

Dans `.env` :
```env
VITE_USE_MOCK_DATA=true
```

→ Le frontend utilisera des données fictives

### Voir les requêtes réseau

Dans `src/api/axios.js`, ajouter :

```javascript
api.interceptors.request.use((config) => {
  console.log('🚀 Request:', config.method.toUpperCase(), config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);
```

### Tester API avec cURL

**Login** :
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@universite.bj","password":"Test123!"}'
```

**Liste élections** :
```bash
TOKEN="1|abc123..."
curl -X GET http://localhost:8000/api/elections \
  -H "Authorization: Bearer $TOKEN"
```

**Vote** :
```bash
curl -X POST http://localhost:8000/api/elections/uuid-election/vote \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"candidat_id":"uuid-candidat"}'
```

---

## 📞 Support

**Questions Backend** :
- Voir `BACKEND_API_SPEC.md` pour spécifications complètes
- Voir `MIGRATION_AUTH.md` pour workflow authentification détaillé

**Questions Frontend** :
- Voir `README.md` pour setup projet
- Voir `src/config/api.routes.js` pour liste routes

---

**Équipe E-Vote** | Février 2026
