# 📡 Mapping Complet des Routes API

**Vue rapide de toutes les routes frontend → backend**

---

## 🔐 Authentification (`authService.js`)

| Méthode Frontend | Route API | Méthode HTTP | Contrôleur Backend | Middleware |
|-----------------|-----------|--------------|-------------------|------------|
| `login()` | `/auth/login` | POST | `AuthController@login` | `throttle:5,15` |
| `confirmAccount()` | `/auth/confirm/{token}` | GET | `AuthController@confirm` | - |
| `logout()` | `/auth/logout` | POST | `AuthController@logout` | `auth:sanctum` |
| `getProfile()` | `/auth/profile` | GET | `AuthController@profile` | `auth:sanctum` |
| `updateProfile()` | `/auth/profile` | PUT | `AuthController@updateProfile` | `auth:sanctum` |
| `resendConfirmationLink()` | `/auth/resend-confirmation` | POST | `AuthController@resendConfirmation` | `throttle:3,15` |

**Request/Response exemples** : Voir `BACKEND_API_SPEC.md` section "Authentification"

---

## 👥 Utilisateurs (`userService.js` - À créer si besoin)

| Méthode Frontend | Route API | Méthode HTTP | Contrôleur Backend | Middleware |
|-----------------|-----------|--------------|-------------------|------------|
| `getAll()` | `/users` | GET | `UserController@index` | `auth:sanctum`, `role:admin` |
| `create()` | `/users` | POST | `UserController@store` | `auth:sanctum`, `role:admin` |
| `getById()` | `/users/{id}` | GET | `UserController@show` | `auth:sanctum`, `role:admin` |
| `update()` | `/users/{id}` | PUT | `UserController@update` | `auth:sanctum`, `role:admin` |
| `delete()` | `/users/{id}` | DELETE | `UserController@destroy` | `auth:sanctum`, `role:admin` |

---

## 🗳️ Élections (`electionService.js`)

| Méthode Frontend | Route API | Méthode HTTP | Contrôleur Backend | Middleware |
|-----------------|-----------|--------------|-------------------|------------|
| `getAll()` | `/elections` | GET | `ElectionController@index` | `auth:sanctum` |
| `getById()` | `/elections/{id}` | GET | `ElectionController@show` | `auth:sanctum` |
| `create()` | `/elections` | POST | `ElectionController@store` | `auth:sanctum`, `role:admin` |
| `update()` | `/elections/{id}` | PUT | `ElectionController@update` | `auth:sanctum`, `role:admin` |
| `delete()` | `/elections/{id}` | DELETE | `ElectionController@destroy` | `auth:sanctum`, `role:admin` |
| `publish()` | `/elections/{id}/publish` | POST | `ElectionController@publish` | `auth:sanctum`, `role:admin` |
| `close()` | `/elections/{id}/close` | POST | `ElectionController@close` | `auth:sanctum`, `role:admin` |
| `getStats()` | `/elections/{id}/statistics` | GET | `ElectionController@statistics` | `auth:sanctum`, `role:admin` |
| `getCandidates()` | `/elections/{id}/candidates` | GET | `CandidatController@index` | `auth:sanctum` |

**Filtrage important** :
- **Admin** : Toutes les élections (y compris Brouillon)
- **Électeur** : Seulement élections `statut IN ('Publiée', 'EnCours', 'Clôturée')`

---

## 📋 Candidats (`candidatService.js` - À créer si besoin)

| Méthode Frontend | Route API | Méthode HTTP | Contrôleur Backend | Middleware |
|-----------------|-----------|--------------|-------------------|------------|
| `create()` | `/elections/{electionId}/candidates` | POST | `CandidatController@store` | `auth:sanctum`, `role:admin` |
| `getById()` | `/candidates/{id}` | GET | `CandidatController@show` | `auth:sanctum` |
| `update()` | `/candidates/{id}` | PUT | `CandidatController@update` | `auth:sanctum`, `role:admin` |
| `delete()` | `/candidates/{id}` | DELETE | `CandidatController@destroy` | `auth:sanctum`, `role:admin` |

---

## 🗳️ Vote (`voteService.js`)

| Méthode Frontend | Route API | Méthode HTTP | Contrôleur Backend | Middleware |
|-----------------|-----------|--------------|-------------------|------------|
| `submit()` | `/elections/{id}/vote` | POST | `VoteController@submit` | `auth:sanctum`, `role:voter` |
| `hasVoted()` | `/elections/{id}/has-voted` | GET | `VoteController@hasVoted` | `auth:sanctum`, `role:voter` |
| `getHistory()` | `/vote/history` | GET | `VoteController@history` | `auth:sanctum`, `role:voter` |

**⚠️ CRITIQUE** : Endpoint `submit()` doit respecter anonymat (voir `BACKEND_API_SPEC.md`)

---

## 📊 Résultats (`resultService.js` - À créer si besoin)

| Méthode Frontend | Route API | Méthode HTTP | Contrôleur Backend | Middleware |
|-----------------|-----------|--------------|-------------------|------------|
| `get()` | `/elections/{id}/results` | GET | `ResultatController@show` | `auth:sanctum` |
| `publish()` | `/elections/{id}/results/publish` | POST | `ResultatController@publish` | `auth:sanctum`, `role:admin` |
| `exportPDF()` | `/elections/{id}/results/export/pdf` | GET | `ResultatController@exportPDF` | `auth:sanctum`, `role:admin` |
| `exportCSV()` | `/elections/{id}/results/export/csv` | GET | `ResultatController@exportCSV` | `auth:sanctum`, `role:admin` |

**Contrôle d'accès** :
- **Admin** : Toujours accès aux résultats
- **Électeur** : Seulement si `resultats.publie = true`

---

## 📜 Audit (`auditService.js` - À créer si besoin)

| Méthode Frontend | Route API | Méthode HTTP | Contrôleur Backend | Middleware |
|-----------------|-----------|--------------|-------------------|------------|
| `getLogs()` | `/audit/logs` | GET | `AuditController@index` | `auth:sanctum`, `role:admin,auditor` |
| `exportCSV()` | `/audit/logs/export/csv` | GET | `AuditController@exportCSV` | `auth:sanctum`, `role:admin,auditor` |

---

## 📈 Statistiques (`statsService.js` - À créer si besoin)

| Méthode Frontend | Route API | Méthode HTTP | Contrôleur Backend | Middleware |
|-----------------|-----------|--------------|-------------------|------------|
| `getDashboard()` | `/stats/dashboard` | GET | `StatsController@dashboard` | `auth:sanctum`, `role:admin` |
| `getParticipation()` | `/stats/participation` | GET | `StatsController@participation` | `auth:sanctum`, `role:admin` |

---

## 🔑 Rôles (`roleService.js` - À créer si besoin)

| Méthode Frontend | Route API | Méthode HTTP | Contrôleur Backend | Middleware |
|-----------------|-----------|--------------|-------------------|------------|
| `getAll()` | `/roles` | GET | `RoleController@index` | `auth:sanctum`, `role:admin` |

---

## 📦 Exemple de Routes Laravel

**Fichier** : `routes/api.php`

```php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ElectionController;
use App\Http\Controllers\Api\VoteController;
use App\Http\Controllers\Api\ResultatController;

// ============================================
// AUTHENTIFICATION (Public)
// ============================================
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,15');
    
    Route::get('/confirm/{token}', [AuthController::class, 'confirm']);
    
    Route::post('/resend-confirmation', [AuthController::class, 'resendConfirmation'])
        ->middleware('throttle:3,15');
    
    // Protégées
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });
});

// ============================================
// UTILISATEURS (Admin uniquement)
// ============================================
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('users', UserController::class);
});

// ============================================
// ÉLECTIONS
// ============================================
Route::middleware('auth:sanctum')->group(function () {
    // Tout le monde authentifié
    Route::get('/elections', [ElectionController::class, 'index']);
    Route::get('/elections/{id}', [ElectionController::class, 'show']);
    Route::get('/elections/{id}/candidates', [ElectionController::class, 'candidates']);
    Route::get('/elections/{id}/results', [ResultatController::class, 'show']);
    
    // Admin uniquement
    Route::middleware('role:admin')->group(function () {
        Route::post('/elections', [ElectionController::class, 'store']);
        Route::put('/elections/{id}', [ElectionController::class, 'update']);
        Route::delete('/elections/{id}', [ElectionController::class, 'destroy']);
        Route::post('/elections/{id}/publish', [ElectionController::class, 'publish']);
        Route::post('/elections/{id}/close', [ElectionController::class, 'close']);
        Route::get('/elections/{id}/statistics', [ElectionController::class, 'statistics']);
        Route::post('/elections/{id}/results/publish', [ResultatController::class, 'publish']);
    });
});

// ============================================
// VOTE (Électeurs uniquement)
// ============================================
Route::middleware(['auth:sanctum', 'role:voter'])->group(function () {
    Route::post('/elections/{id}/vote', [VoteController::class, 'submit']);
    Route::get('/elections/{id}/has-voted', [VoteController::class, 'hasVoted']);
    Route::get('/vote/history', [VoteController::class, 'history']);
});

// ============================================
// CANDIDATS (Admin uniquement)
// ============================================
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/elections/{electionId}/candidates', [CandidatController::class, 'store']);
    Route::get('/candidates/{id}', [CandidatController::class, 'show']);
    Route::put('/candidates/{id}', [CandidatController::class, 'update']);
    Route::delete('/candidates/{id}', [CandidatController::class, 'destroy']);
});

// ============================================
// AUDIT (Admin/Auditeur)
// ============================================
Route::middleware(['auth:sanctum', 'role:admin,auditor'])->group(function () {
    Route::get('/audit/logs', [AuditController::class, 'index']);
    Route::get('/audit/logs/export/csv', [AuditController::class, 'exportCSV']);
});

// ============================================
// STATISTIQUES (Admin)
// ============================================
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/stats/dashboard', [StatsController::class, 'dashboard']);
    Route::get('/stats/participation', [StatsController::class, 'participation']);
});

// ============================================
// RÔLES (Admin)
// ============================================
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/roles', [RoleController::class, 'index']);
});
```

---

## 🔧 Middleware Laravel à créer

### `app/Http/Middleware/CheckRole.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié',
            ], 401);
        }
        
        $userRole = $user->role->nom ?? 'visitor';
        
        if (!in_array($userRole, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé',
            ], 403);
        }
        
        return $next($request);
    }
}
```

**Enregistrement** : `app/Http/Kernel.php`

```php
protected $middlewareAliases = [
    // ...
    'role' => \App\Http\Middleware\CheckRole::class,
];
```

---

## 📝 Notes importantes

### 1. URL de base

Frontend utilise : `import.meta.env.VITE_API_URL` (configuré dans `.env`)

**Développement** : `http://localhost:8000/api`  
**Production** : `https://evote.universite.bj/api`

### 2. Headers requis

**Toutes les requêtes** :
```
Content-Type: application/json
```

**Routes protégées** :
```
Authorization: Bearer {token}
```

### 3. Format réponse standard

**Succès** :
```json
{
  "success": true,
  "data": { ... }
}
```

**Erreur** :
```json
{
  "success": false,
  "message": "Description de l'erreur"
}
```

### 4. Codes HTTP

| Code | Signification | Utilisation |
|------|--------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée |
| 400 | Bad Request | Validation échouée |
| 401 | Unauthorized | Token invalide/manquant |
| 403 | Forbidden | Pas les permissions |
| 404 | Not Found | Ressource inexistante |
| 429 | Too Many Requests | Rate limit dépassé |
| 500 | Server Error | Erreur interne |

---

## 🧪 Tests avec cURL

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@universite.bj","password":"Test123!"}'
```

### Liste élections (avec token)
```bash
TOKEN="1|abc123..."
curl -X GET http://localhost:8000/api/elections \
  -H "Authorization: Bearer $TOKEN"
```

### Soumettre vote
```bash
curl -X POST http://localhost:8000/api/elections/{ELECTION_ID}/vote \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"candidat_id":"uuid-candidat"}'
```

---

## 📚 Ressources

- **Spécifications complètes** : `BACKEND_API_SPEC.md`
- **Workflow auth** : `MIGRATION_AUTH.md`
- **Guide intégration** : `INTEGRATION_BACKEND.md`
- **Checklist backend** : `BACKEND_CHECKLIST.md`
- **Config routes frontend** : `src/config/api.routes.js`

---

**Équipe E-Vote** | Février 2026
