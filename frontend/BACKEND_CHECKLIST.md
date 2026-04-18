# ✅ Checklist Backend - Intégration E-Vote

**Pour le développeur Laravel Backend**

Cette checklist vous guide pas à pas pour implémenter l'API backend compatible avec le frontend React déjà développé.

---

## 📋 Documents à consulter ABSOLUMENT

1. **`BACKEND_API_SPEC.md`** → Spécifications complètes des 40+ endpoints
2. **`MIGRATION_AUTH.md`** → Workflow authentification Email+Password
3. **`INTEGRATION_BACKEND.md`** → Guide d'intégration détaillé
4. **`src/config/api.routes.js`** → Routes mappées (Frontend)

---

## 🗄️ Phase 1 : Base de données (2-3h)

### Migrations Laravel

<details>
<summary>✅ 1.1 Migration `users` (modifier existante)</summary>

```php
// database/migrations/xxxx_update_users_table.php
Schema::table('users', function (Blueprint $table) {
    $table->string('password_hash')->after('email');
    $table->enum('statut', ['Inactif', 'Actif'])->default('Inactif');
    $table->uuid('role_id')->nullable();
    
    // Supprimer colonnes OTP si existantes
    $table->dropColumn(['otp_code', 'otp_expires_at']);
});
```

**Vérification** : `php artisan migrate`

</details>

<details>
<summary>✅ 1.2 Migration `tokens_confirmation`</summary>

```php
// database/migrations/xxxx_create_tokens_confirmation_table.php
Schema::create('tokens_confirmation', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('user_id')->unique();
    $table->string('token', 64)->unique();
    $table->timestamp('expire_at');
    $table->timestamps();
    
    $table->foreign('user_id')
          ->references('id')->on('users')
          ->onDelete('cascade');
});
```

**Vérification** : Exécuter migration, vérifier table créée

</details>

<details>
<summary>✅ 1.3 Migration `passwords_temporary`</summary>

```php
// database/migrations/xxxx_create_passwords_temporary_table.php
Schema::create('passwords_temporary', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('user_id')->unique();
    $table->text('password_plain'); // Stockage temporaire en clair
    $table->timestamp('expire_at');
    $table->timestamps();
    
    $table->foreign('user_id')
          ->references('id')->on('users')
          ->onDelete('cascade');
});
```

**Vérification** : Table créée avec index unique sur `user_id`

</details>

<details>
<summary>✅ 1.4 Migration `bulletins` (ANONYME)</summary>

```php
// database/migrations/xxxx_create_bulletins_table.php
Schema::create('bulletins', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('election_id');
    $table->uuid('candidat_id');
    $table->string('hash_verification', 64);
    $table->timestamp('created_at');
    
    // ⚠️ PAS de user_id (anonymat du vote)
    
    $table->foreign('election_id')->references('id')->on('elections');
    $table->foreign('candidat_id')->references('id')->on('candidats');
});
```

**⚠️ CRITIQUE** : JAMAIS de colonne `user_id` ici !

</details>

<details>
<summary>✅ 1.5 Migration `participations`</summary>

```php
// database/migrations/xxxx_create_participations_table.php
Schema::create('participations', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('election_id');
    $table->uuid('user_id');
    $table->boolean('a_vote')->default(true);
    $table->timestamp('created_at');
    
    $table->unique(['election_id', 'user_id']); // Empêche double vote
    
    $table->foreign('election_id')->references('id')->on('elections');
    $table->foreign('user_id')->references('id')->on('users');
});
```

**Vérification** : Contrainte UNIQUE fonctionne

</details>

<details>
<summary>✅ 1.6 Migration `audit_logs`</summary>

```php
// database/migrations/xxxx_create_audit_logs_table.php
Schema::create('audit_logs', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('user_id')->nullable();
    $table->string('action_type', 50); // LOGIN, VOTE, CREATE_ELECTION...
    $table->text('description');
    $table->string('ip_address', 45)->nullable();
    $table->enum('resultat', ['SUCCESS', 'FAILED']);
    $table->json('details_json')->nullable();
    $table->timestamp('created_at');
    
    $table->index(['user_id', 'created_at']);
    $table->index('action_type');
});
```

**Vérification** : Index créés pour performance

</details>

**Test global DB** :
```bash
php artisan migrate:fresh --seed
```

---

## 🔐 Phase 2 : Authentification (4-5h)

### 2.1 AuthController

<details>
<summary>✅ `POST /api/auth/login`</summary>

**Localisation** : `app/Http/Controllers/Api/AuthController.php`

```php
public function login(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
    ]);
    
    $user = User::where('email', $validated['email'])->first();
    
    // Vérifier utilisateur existe
    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'Email ou mot de passe incorrect',
        ], 401);
    }
    
    // Vérifier compte actif
    if ($user->statut !== 'Actif') {
        return response()->json([
            'success' => false,
            'message' => 'Votre compte n\'est pas encore activé. Veuillez confirmer votre email.',
        ], 403);
    }
    
    // Vérifier password
    if (!Hash::check($validated['password'], $user->password_hash)) {
        return response()->json([
            'success' => false,
            'message' => 'Email ou mot de passe incorrect',
        ], 401);
    }
    
    // Créer token Sanctum
    $token = $user->createToken('auth_token')->plainTextToken;
    
    // Log audit
    AuditLog::create([
        'user_id' => $user->id,
        'action_type' => 'LOGIN',
        'description' => 'Connexion réussie',
        'ip_address' => $request->ip(),
        'resultat' => 'SUCCESS',
    ]);
    
    return response()->json([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user->id,
            'email' => $user->email,
            'nom' => $user->nom,
            'role' => $user->role->nom ?? 'voter',
            'statut' => $user->statut,
        ],
    ], 200);
}
```

**Test** :
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@universite.bj","password":"Test123!"}'
```

**Attendu** : Status 200, token retourné

</details>

<details>
<summary>✅ `GET /api/auth/confirm/{token}`</summary>

```php
public function confirm($token)
{
    // Chercher token non expiré
    $tokenRecord = TokenConfirmation::where('token', $token)
        ->where('expire_at', '>', now())
        ->first();
    
    if (!$tokenRecord) {
        return response()->json([
            'success' => false,
            'message' => 'Token invalide ou expiré',
        ], 404);
    }
    
    DB::transaction(function () use ($tokenRecord) {
        // 1. Activer utilisateur
        $user = User::find($tokenRecord->user_id);
        $user->statut = 'Actif';
        $user->save();
        
        // 2. Récupérer password temporaire
        $passwordTemp = PasswordTemporary::where('user_id', $user->id)->first();
        
        // 3. Envoyer Email 2 (identifiants)
        Mail::to($user->email)->send(new CredentialsMail([
            'email' => $user->email,
            'password' => $passwordTemp->password_plain,
        ]));
        
        // 4. Supprimer tokens et password temporaire
        $tokenRecord->delete();
        $passwordTemp->delete();
        
        // 5. Log audit
        AuditLog::create([
            'user_id' => $user->id,
            'action_type' => 'ACCOUNT_ACTIVATED',
            'description' => 'Compte activé via confirmation email',
            'resultat' => 'SUCCESS',
        ]);
    });
    
    return response()->json([
        'success' => true,
        'message' => 'Votre compte a été activé avec succès',
        'email' => $user->email,
        'password' => $passwordTemp->password_plain,
    ], 200);
}
```

**Test** :
```bash
# Après création utilisateur
curl -X GET http://localhost:8000/api/auth/confirm/{TOKEN_64_CHARS}
```

**Attendu** : Status 200, email + password retournés

</details>

<details>
<summary>✅ `POST /api/auth/logout`</summary>

```php
public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();
    
    AuditLog::create([
        'user_id' => $request->user()->id,
        'action_type' => 'LOGOUT',
        'description' => 'Déconnexion',
        'resultat' => 'SUCCESS',
    ]);
    
    return response()->json([
        'success' => true,
        'message' => 'Déconnexion réussie',
    ], 200);
}
```

**Route** : `Route::middleware('auth:sanctum')->post('/auth/logout', ...)`

</details>

### 2.2 Création d'utilisateur (Admin)

<details>
<summary>✅ `POST /api/users`</summary>

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email|unique:users',
        'nom' => 'required|string',
        'prenom' => 'required|string',
        'role_id' => 'required|uuid|exists:roles,id',
    ]);
    
    DB::transaction(function () use ($validated) {
        // 1. Générer password aléatoire
        $password = $this->generatePassword();
        
        // 2. Créer utilisateur
        $user = User::create([
            'id' => Str::uuid(),
            'email' => $validated['email'],
            'nom' => $validated['nom'] . ' ' . $validated['prenom'],
            'password_hash' => Hash::make($password),
            'role_id' => $validated['role_id'],
            'statut' => 'Inactif',
        ]);
        
        // 3. Générer token confirmation
        $token = Str::random(64);
        TokenConfirmation::create([
            'id' => Str::uuid(),
            'user_id' => $user->id,
            'token' => $token,
            'expire_at' => now()->addHours(48),
        ]);
        
        // 4. Stocker password temporairement
        PasswordTemporary::create([
            'id' => Str::uuid(),
            'user_id' => $user->id,
            'password_plain' => $password,
            'expire_at' => now()->addHours(48),
        ]);
        
        // 5. Envoyer Email 1 (confirmation)
        $confirmUrl = env('FRONTEND_URL') . "/confirm/{$token}";
        Mail::to($user->email)->send(new ConfirmationMail(['url' => $confirmUrl]));
        
        // 6. Log audit
        AuditLog::create([
            'user_id' => $request->user()->id,
            'action_type' => 'USER_CREATED',
            'description' => "Création utilisateur {$user->email}",
            'resultat' => 'SUCCESS',
        ]);
    });
    
    return response()->json([
        'success' => true,
        'user' => $user,
        'message' => 'Utilisateur créé. Email de confirmation envoyé.',
    ], 201);
}

private function generatePassword()
{
    $upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $lower = 'abcdefghijklmnopqrstuvwxyz';
    $digits = '0123456789';
    $special = '!@#$%^&*';
    
    $password = '';
    $password .= $upper[rand(0, strlen($upper) - 1)];
    $password .= $lower[rand(0, strlen($lower) - 1)];
    $password .= $digits[rand(0, strlen($digits) - 1)];
    $password .= $special[rand(0, strlen($special) - 1)];
    
    $all = $upper . $lower . $digits . $special;
    for ($i = 0; $i < 8; $i++) {
        $password .= $all[rand(0, strlen($all) - 1)];
    }
    
    return str_shuffle($password); // 12 caractères
}
```

**Test** :
```bash
TOKEN="1|admin_token..."
curl -X POST http://localhost:8000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"nouveau@universite.bj",
    "nom":"Dupont",
    "prenom":"Jean",
    "role_id":"uuid-role-voter"
  }'
```

</details>

### 2.3 Rate Limiting

<details>
<summary>✅ Configuration Throttle</summary>

**Fichier** : `routes/api.php`

```php
use Illuminate\Support\Facades\RateLimiter;

// Rate limiter personnalisé
RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip());
});

// Routes
Route::middleware('throttle:login')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
});
```

**Test** : Appeler login 6 fois en 1 minute → 429 Too Many Requests

</details>

---

## 🗳️ Phase 3 : Vote (5-6h)

<details>
<summary>✅ `POST /api/elections/{id}/vote`</summary>

**⚠️ TRANSACTION ATOMIQUE OBLIGATOIRE**

```php
public function submit(Request $request, $electionId)
{
    $validated = $request->validate([
        'candidat_id' => 'required|uuid|exists:candidats,id',
    ]);
    
    $user = $request->user();
    
    // Vérifier élection en cours
    $election = Election::find($electionId);
    if (!$election || $election->statut !== 'EnCours') {
        return response()->json([
            'success' => false,
            'message' => 'Cette élection n\'est pas en cours',
        ], 400);
    }
    
    DB::transaction(function () use ($electionId, $validated, $user) {
        // 1. Vérifier pas déjà voté
        $hasVoted = Participation::where('election_id', $electionId)
            ->where('user_id', $user->id)
            ->exists();
        
        if ($hasVoted) {
            throw new \Exception('Vous avez déjà voté pour cette élection');
        }
        
        // 2. Créer bulletin ANONYME (AUCUNE référence user_id)
        Bulletin::create([
            'id' => Str::uuid(),
            'election_id' => $electionId,
            'candidat_id' => $validated['candidat_id'],
            'hash_verification' => hash('sha256', uniqid()),
            'created_at' => now(),
        ]);
        
        // 3. Marquer participation (QUI a voté, PAS pour qui)
        Participation::create([
            'id' => Str::uuid(),
            'election_id' => $electionId,
            'user_id' => $user->id,
            'a_vote' => true,
            'created_at' => now(),
        ]);
        
        // 4. Log audit (SANS révéler candidat)
        AuditLog::create([
            'user_id' => $user->id,
            'action_type' => 'VOTE',
            'description' => "Vote soumis pour élection {$electionId}",
            // PAS de details_json avec candidat_id !
            'resultat' => 'SUCCESS',
        ]);
    });
    
    return response()->json([
        'success' => true,
        'message' => 'Votre vote a été enregistré avec succès',
    ], 200);
}
```

**Test** :
```bash
TOKEN="voter_token"
curl -X POST http://localhost:8000/api/elections/{ELECTION_ID}/vote \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"candidat_id":"uuid-candidat"}'
```

**Vérifications** :
1. Vote créé dans `bulletins` SANS user_id ✅
2. Participation créée dans `participations` ✅
3. Double vote impossible (contrainte UNIQUE) ✅

</details>

---

## 📊 Phase 4 : Dépouillement (3-4h)

<details>
<summary>✅ Job automatique `CountVotesJob`</summary>

```php
// app/Jobs/CountVotesJob.php
class CountVotesJob implements ShouldQueue
{
    protected $electionId;
    
    public function handle()
    {
        $election = Election::find($this->electionId);
        
        if ($election->statut !== 'Clôturée') {
            return; // Seulement élections clôturées
        }
        
        // Compter votes par candidat
        $results = Bulletin::where('election_id', $this->electionId)
            ->select('candidat_id', DB::raw('COUNT(*) as nb_votes'))
            ->groupBy('candidat_id')
            ->get();
        
        $totalVotes = $results->sum('nb_votes');
        $totalElecteurs = User::where('role_id', 'role-voter-uuid')->count();
        
        // Sauvegarder résultats
        Resultat::updateOrCreate(
            ['election_id' => $this->electionId],
            [
                'total_votes' => $totalVotes,
                'total_electeurs' => $totalElecteurs,
                'taux_participation' => ($totalVotes / $totalElecteurs) * 100,
                'resultats_json' => $results->toJson(),
                'publie' => false, // Admin doit publier manuellement
            ]
        );
    }
}
```

**Scheduler** : `app/Console/Kernel.php`

```php
protected function schedule(Schedule $schedule)
{
    // Vérifier élections à clôturer chaque minute
    $schedule->call(function () {
        $elections = Election::where('statut', 'EnCours')
            ->where('date_cloture', '<=', now())
            ->get();
        
        foreach ($elections as $election) {
            $election->statut = 'Clôturée';
            $election->save();
            
            // Déclencher dépouillement
            CountVotesJob::dispatch($election->id);
        }
    })->everyMinute();
}
```

**Test** :
```bash
# Simuler clôture manuelle
php artisan tinker
>>> Election::find('uuid')->update(['date_cloture' => now()->subMinute()]);
>>> exit

# Attendre 1 minute puis vérifier
php artisan queue:work
```

</details>

---

## 📧 Phase 5 : Emails (2-3h)

<details>
<summary>✅ Email 1 : Confirmation</summary>

**Fichier** : `app/Mail/ConfirmationMail.php`

```php
namespace App\Mail;

use Illuminate\Mail\Mailable;

class ConfirmationMail extends Mailable
{
    public $data;
    
    public function __construct($data)
    {
        $this->data = $data;
    }
    
    public function build()
    {
        return $this->subject('Confirmez votre inscription - E-Vote')
            ->view('emails.confirmation')
            ->with('confirmUrl', $this->data['url']);
    }
}
```

**Template** : `resources/views/emails/confirmation.blade.php`

```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif;">
    <h2>Confirmez votre inscription</h2>
    <p>Bonjour,</p>
    <p>Votre compte E-Vote a été créé par l'administrateur.</p>
    <p>Pour activer votre compte, cliquez sur le lien ci-dessous :</p>
    <a href="{{ $confirmUrl }}" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
        Activer mon compte
    </a>
    <p>⚠️ Ce lien expire dans 48 heures.</p>
    <p>Cordialement,<br>L'équipe E-Vote</p>
</body>
</html>
```

</details>

<details>
<summary>✅ Email 2 : Identifiants</summary>

**Fichier** : `app/Mail/CredentialsMail.php`

```php
public function build()
{
    return $this->subject('Vos identifiants de connexion - E-Vote')
        ->view('emails.credentials')
        ->with([
            'email' => $this->data['email'],
            'password' => $this->data['password'],
        ]);
}
```

**Template** : `resources/views/emails/credentials.blade.php`

```html
<h2>Votre compte a été activé !</h2>
<p>Bonjour,</p>
<p>Vos identifiants de connexion :</p>
<ul>
    <li><strong>Email :</strong> {{ $email }}</li>
    <li><strong>Mot de passe :</strong> {{ $password }}</li>
</ul>
<p>Vous pouvez maintenant vous connecter sur :</p>
<a href="{{ env('FRONTEND_URL') }}/login">Se connecter</a>
```

</details>

**Configuration SMTP** : `.env`

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=evote@universite.bj
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=evote@universite.bj
MAIL_FROM_NAME="E-Vote"
```

---

## 🧹 Phase 6 : Nettoyage automatique (1h)

<details>
<summary>✅ Cron job tokens expirés</summary>

```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    // Supprimer tokens expirés chaque heure
    $schedule->call(function () {
        TokenConfirmation::where('expire_at', '<', now())->delete();
        PasswordTemporary::where('expire_at', '<', now())->delete();
    })->hourly();
}
```

**Test** :
```bash
php artisan schedule:run
```

</details>

---

## ✅ Tests finaux

### Workflow complet

```bash
# 1. Créer utilisateur (Admin)
curl -X POST http://localhost:8000/api/users ...

# 2. Vérifier email reçu (simulation)
# URL : http://localhost:5173/confirm/{TOKEN}

# 3. Cliquer sur lien confirmation
curl -X GET http://localhost:8000/api/auth/confirm/{TOKEN}

# 4. Vérifier Email 2 reçu avec credentials

# 5. Login
curl -X POST http://localhost:8000/api/auth/login \
  -d '{"email":"...","password":"..."}'

# 6. Voter
curl -X POST http://localhost:8000/api/elections/{ID}/vote \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{"candidat_id":"..."}'

# 7. Vérifier double vote impossible
curl -X POST ... (même requête)
# Attendu : 403 Forbidden

# 8. Clôturer élection (auto ou manuel)
# 9. Vérifier résultats décomptés
curl -X GET http://localhost:8000/api/elections/{ID}/results
```

---

## 📞 Support

**Blocage ?** Consulter :
- `BACKEND_API_SPEC.md` (specs complètes)
- `MIGRATION_AUTH.md` (workflow auth)
- Logs Laravel : `storage/logs/laravel.log`

**Contact Frontend** : Vérifier `src/config/api.routes.js` pour mapping exact

---

**Bon courage ! 🚀**

**Équipe E-Vote** | Février 2026
