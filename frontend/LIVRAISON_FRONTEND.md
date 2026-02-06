# 📦 Livraison Frontend - Structure Routes API

**Version** : 1.1.0  
**Date** : 6 février 2026  
**Statut** : ✅ Prêt pour intégration backend

---

## 🎯 Résumé Exécutif

Le **frontend React** est **100% fonctionnel** en mode mock. Toute la structure des routes API a été **centralisée et documentée** pour faciliter l'intégration avec le backend Laravel.

**Prêt pour production** : Dès que le backend implémente les endpoints spécifiés, il suffit de changer `VITE_USE_MOCK=false` dans `.env` pour basculer sur l'API réelle.

---

## 📁 Nouveaux Fichiers Créés

### 1. Configuration Routes API

| Fichier | Description | Lignes |
|---------|-------------|--------|
| [`src/config/api.routes.js`](src/config/api.routes.js) | **Configuration centralisée de TOUTES les routes API** | 430+ |
| | Contient : Authentification, Utilisateurs, Élections, Candidats, Vote, Résultats, Audit, Stats | |
| | Format : `API_ROUTES.AUTH.LOGIN`, `API_ROUTES.ELECTIONS.LIST`, etc. | |

### 2. Documentation Backend

| Fichier | Description | Pages |
|---------|-------------|-------|
| [`BACKEND_API_SPEC.md`](BACKEND_API_SPEC.md) | **Spécifications complètes de l'API** | 7 |
| | Contient : 40+ endpoints, request/response, validations, DB schema, emails templates | |
| [`BACKEND_CHECKLIST.md`](BACKEND_CHECKLIST.md) | **Checklist détaillée pour développeur backend** | 12 |
| | Contient : Code Laravel prêt à copier, migrations, controllers, jobs, emails | |
| [`ROUTES_MAPPING.md`](ROUTES_MAPPING.md) | **Tableau mapping Frontend ↔️ Backend** | 5 |
| | Contient : Toutes les routes avec middleware Laravel, exemples cURL | |
| [`INTEGRATION_BACKEND.md`](INTEGRATION_BACKEND.md) | **Guide d'intégration complet** | 10 |
| | Contient : Workflow, config, tests, debugging, sécurité | |

### 3. Configuration Environnement

| Fichier | Description |
|---------|-------------|
| [`.env.example`](.env.example) | Exemple de configuration (déjà existant, mis à jour) |
| `.env` | Configuration locale (déjà présent) |

---

## 🔧 Modifications Services Frontend

Les 3 fichiers de services ont été mis à jour pour utiliser la configuration centralisée :

### ✅ [`src/services/auth.service.js`](src/services/auth.service.js)
**AVANT** :
```javascript
api.post("/auth/login", { email, password })
```

**APRÈS** :
```javascript
import API_ROUTES from "../config/api.routes";
api.post(API_ROUTES.AUTH.LOGIN, { email, password })
```

**Avantages** :
- ✅ Routes centralisées → 1 seul endroit à modifier
- ✅ Documentation JSDoc intégrée
- ✅ Autocomplétion améliorée

### ✅ [`src/services/election.service.js`](src/services/election.service.js)
Routes mises à jour :
- `getAll()` → `API_ROUTES.ELECTIONS.LIST`
- `getById()` → `API_ROUTES.ELECTIONS.GET(id)`
- `create()` → `API_ROUTES.ELECTIONS.CREATE`
- `publish()` → `API_ROUTES.ELECTIONS.PUBLISH(id)`
- `getCandidates()` → `API_ROUTES.ELECTIONS.CANDIDATES(electionId)`
- etc.

### ✅ [`src/services/vote.service.js`](src/services/vote.service.js)
Routes mises à jour :
- `submit()` → `API_ROUTES.VOTE.SUBMIT(electionId)`
- `hasVoted()` → `API_ROUTES.VOTE.HAS_VOTED(electionId)`
- `getHistory()` → `API_ROUTES.VOTE.HISTORY`

---

## 📋 Checklist Intégration Backend

### ⏳ Backend à implémenter (Laravel)

#### Phase 1 : Base de données (2-3h)
- [ ] Migration `users` (ajouter `password_hash`, `statut`)
- [ ] Migration `tokens_confirmation`
- [ ] Migration `passwords_temporary`
- [ ] Migration `bulletins` (SANS user_id pour anonymat)
- [ ] Migration `participations`
- [ ] Migration `audit_logs`

#### Phase 2 : Authentification (4-5h)
- [ ] `POST /api/auth/login` → Vérifier bcrypt, retourner token
- [ ] `GET /api/auth/confirm/{token}` → Activer utilisateur, envoyer credentials
- [ ] `POST /api/users` → Créer utilisateur, générer password, envoyer confirmation
- [ ] Rate limiting (5 tentatives/15min)
- [ ] Emails (ConfirmationMail, CredentialsMail)

#### Phase 3 : Élections (3-4h)
- [ ] `GET /api/elections` → Filtrer selon rôle
- [ ] `POST /api/elections` → Créer élection
- [ ] `POST /api/elections/{id}/publish` → Publier
- [ ] `GET /api/elections/{id}/candidates` → Liste candidats

#### Phase 4 : Vote (5-6h)
- [ ] `POST /api/elections/{id}/vote` → **TRANSACTION ATOMIQUE**
  - Vérifier pas déjà voté
  - Créer bulletin ANONYME (sans user_id)
  - Créer participation
  - Log audit (sans révéler choix)
- [ ] `GET /api/elections/{id}/has-voted` → Vérifier participation

#### Phase 5 : Résultats (3-4h)
- [ ] `GET /api/elections/{id}/results` → Dépouillement
- [ ] Job `CountVotesJob` → Compter votes après clôture
- [ ] Contrôle d'accès (admin = toujours, voter = si publié)

#### Phase 6 : Nettoyage (1h)
- [ ] Cron job → Supprimer tokens expirés (hourly)
- [ ] Scheduler Laravel configuré

---

## 🧪 Tests Pré-Intégration

### ✅ Frontend (Déjà testés)
- ✅ Compilation sans erreurs
- ✅ Dev server tourne sur http://localhost:5173
- ✅ Mode mock fonctionnel (`VITE_USE_MOCK=true`)
- ✅ Toutes les pages accessibles
- ✅ Routes protégées avec AuthContext
- ✅ Design harmonisé (navy + amber)

### ⏳ Backend (À tester)
```bash
# 1. Créer utilisateur (admin)
curl -X POST http://localhost:8000/api/users \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@universite.bj","nom":"Test","prenom":"User","role_id":"uuid"}'

# 2. Vérifier email confirmation envoyé
# (Simuler clic sur lien)

# 3. Confirmer compte
curl -X GET http://localhost:8000/api/auth/confirm/{TOKEN}

# 4. Login
curl -X POST http://localhost:8000/api/auth/login \
  -d '{"email":"test@universite.bj","password":"GeneratedPassword123!"}'

# 5. Vote
curl -X POST http://localhost:8000/api/elections/{ID}/vote \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{"candidat_id":"uuid"}'

# 6. Vérifier double vote impossible (403)
```

---

## 🔐 Points de Sécurité CRITIQUES

### 1. Anonymat du Vote (⚠️ PRIORITÉ MAX)

**❌ JAMAIS** stocker `user_id` dans la table `bulletins` :
```sql
-- ❌ MAUVAIS
CREATE TABLE bulletins (
  user_id UUID,  -- ⚠️ Casse l'anonymat !
  candidat_id UUID
);

-- ✅ BON
CREATE TABLE bulletins (
  id UUID PRIMARY KEY,
  election_id UUID,
  candidat_id UUID,
  hash_verification VARCHAR(64),
  created_at TIMESTAMP
  -- AUCUNE colonne user_id
);
```

### 2. Séparation Bulletins ↔️ Participations

**Logique backend** (TRANSACTION ATOMIQUE) :
```php
DB::transaction(function () {
    // 1. Vérifier PAS déjà voté
    if (Participation::where('election_id', $id)->where('user_id', $userId)->exists()) {
        throw new Exception('Déjà voté');
    }
    
    // 2. Créer bulletin ANONYME
    Bulletin::create([
        'election_id' => $electionId,
        'candidat_id' => $candidatId,
        // PAS de user_id !
    ]);
    
    // 3. Marquer participation (séparé du bulletin)
    Participation::create([
        'election_id' => $electionId,
        'user_id' => $userId,
    ]);
});
```

**Résultat** : Impossible de savoir qui a voté pour qui ✅

### 3. Logs Audit Sans Révélation

```php
// ✅ BON
AuditLog::create([
    'user_id' => $userId,
    'action_type' => 'VOTE',
    'description' => "Vote soumis pour élection {$electionId}",
    // PAS de details_json avec candidat_id
    'resultat' => 'SUCCESS',
]);

// ❌ MAUVAIS
AuditLog::create([
    'details_json' => json_encode(['candidat_id' => $candidatId]), // ⚠️ Brise anonymat
]);
```

---

## 📊 Architecture Globale

```
Frontend (React)                Backend (Laravel)
┌─────────────────┐            ┌──────────────────┐
│ Login.jsx       │──POST──────│ AuthController   │
│ (email+pwd)     │            │ @login           │
└─────────────────┘            │ - bcrypt check   │
        │                      │ - token Sanctum  │
        ├─ authService.login() └──────────────────┘
        │
        ├─ API_ROUTES.AUTH.LOGIN
        │
        └─ axios (baseURL from .env)

Frontend (React)                Backend (Laravel)
┌─────────────────┐            ┌──────────────────┐
│ ElecteurVote    │──POST──────│ VoteController   │
│ (candidat_id)   │            │ @submit          │
└─────────────────┘            │ - Transaction    │
        │                      │ - Bulletin (anon)│
        ├─ voteService.submit()│ - Participation  │
        │                      │ - Audit log      │
        ├─ API_ROUTES.VOTE.SUBMIT(id)
        │                      └──────────────────┘
        └─ axios + token
```

---

## 📞 Support & Contact

### Pour le développeur backend :

**Blocage technique ?**
1. Consulter [`BACKEND_API_SPEC.md`](BACKEND_API_SPEC.md) pour specs détaillées
2. Voir [`BACKEND_CHECKLIST.md`](BACKEND_CHECKLIST.md) pour code Laravel prêt à copier
3. Vérifier [`ROUTES_MAPPING.md`](ROUTES_MAPPING.md) pour mapping exact

**Questions sur l'intégration ?**
- Voir [`INTEGRATION_BACKEND.md`](INTEGRATION_BACKEND.md)
- Vérifier `.env` configuration (VITE_API_URL)

**Questions sur les routes frontend ?**
- Voir [`src/config/api.routes.js`](src/config/api.routes.js)
- Tous les endpoints sont documentés avec JSDoc

---

## ✅ Résumé Livraison

### Ce qui est prêt :
1. ✅ **Frontend 100% fonctionnel** (mode mock)
2. ✅ **Configuration routes centralisée** (`api.routes.js`)
3. ✅ **Services mis à jour** (auth, election, vote)
4. ✅ **Documentation complète** (4 fichiers : SPEC, CHECKLIST, MAPPING, INTEGRATION)
5. ✅ **Design harmonisé** (navy #1e3a5f + amber #f59e0b)
6. ✅ **Authentification Email+Password** (migration complète)
7. ✅ **Structure workflow** (création user → confirmation → activation → login → vote)

### Ce qui reste à faire (Backend) :
1. ⏳ Implémenter 40+ endpoints API (voir BACKEND_API_SPEC.md)
2. ⏳ Créer migrations DB (6 tables)
3. ⏳ Configurer SMTP emails
4. ⏳ Implémenter jobs Laravel (dépouillement, nettoyage)
5. ⏳ Configurer CORS + rate limiting
6. ⏳ Tests unitaires backend

### Prochaine étape :
👉 **Le développeur backend** commence par lire [`BACKEND_CHECKLIST.md`](BACKEND_CHECKLIST.md) et suit les phases 1 à 6.

---

## 🚀 Déploiement

### Développement actuel :
```bash
# Frontend (déjà fonctionnel)
cd frontend
npm run dev
# → http://localhost:5173

# Backend (à implémenter)
cd backend
php artisan serve
# → http://localhost:8000/api
```

### Production (après intégration) :
```bash
# Frontend
npm run build
# → Fichiers static dans dist/

# Backend
php artisan migrate
php artisan optimize
php artisan queue:work
```

**Configuration** :
- Frontend : `VITE_API_URL=https://evote.universite.bj/api`
- Backend : `FRONTEND_URL=https://evote.universite.bj`
- HTTPS obligatoire en production

---

**Équipe E-Vote** | Février 2026

**Status** : ✅ Frontend prêt, Backend en attente d'implémentation
