# Guide de Test de l'API d'Authentification

## Prérequis

1. **Base de données configurée** :
   - Soit activer l'extension SQLite dans PHP (`php.ini` : `extension=pdo_sqlite`)
   - Soit configurer MySQL dans le fichier `.env`

2. **Migrations exécutées** :
   ```bash
   php artisan migrate
   ```

3. **Utilisateur de test créé** :
   ```bash
   php artisan db:seed
   ```
   Ou créer manuellement :
   ```bash
   php artisan tinker
   ```
   Puis :
   ```php
   User::create([
       'name' => 'Test User',
       'email' => 'test@example.com',
       'password' => Hash::make('password')
   ]);
   ```

4. **Serveur Laravel démarré** :
   ```bash
   php artisan serve
   ```

## Tests avec cURL

### 1. Test de Login (Réussi)

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password\"}"
```

**Réponse attendue (200 OK)** :
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com"
  },
  "token": "1|xxxxxxxxxxxxxxxxxxxxx"
}
```

### 2. Test de Login (Échec - Mauvais mot de passe)

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"wrongpassword\"}"
```

**Réponse attendue (422 Unprocessable Entity)** :
```json
{
  "message": "Les identifiants sont incorrects.",
  "errors": {
    "email": ["Les identifiants sont incorrects."]
  }
}
```

### 3. Test de Login (Échec - Email inexistant)

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"nonexistent@example.com\",\"password\":\"password\"}"
```

**Réponse attendue (422 Unprocessable Entity)** :
```json
{
  "message": "Cet email n'existe pas dans notre base de données.",
  "errors": {
    "email": ["Cet email n'existe pas dans notre base de données."]
  }
}
```

### 4. Test de Logout (Réussi)

Remplacez `{TOKEN}` par le token reçu lors du login :

```bash
curl -X POST http://localhost:8000/api/logout \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json"
```

**Réponse attendue (200 OK)** :
```json
{
  "message": "Déconnexion réussie"
}
```

### 5. Test de Logout (Échec - Sans token)

```bash
curl -X POST http://localhost:8000/api/logout \
  -H "Content-Type: application/json"
```

**Réponse attendue (401 Unauthorized)** :
```json
{
  "message": "Unauthenticated."
}
```

## Tests avec Postman / Insomnia

### Login

1. **Méthode** : `POST`
2. **URL** : `http://localhost:8000/api/login`
3. **Headers** :
   - `Content-Type: application/json`
   - `Accept: application/json`
4. **Body** (raw JSON) :
   ```json
   {
     "email": "test@example.com",
     "password": "password"
   }
   ```

### Logout

1. **Méthode** : `POST`
2. **URL** : `http://localhost:8000/api/logout`
3. **Headers** :
   - `Authorization: Bearer {TOKEN}`
   - `Content-Type: application/json`
   - `Accept: application/json`

## Tests avec JavaScript (Frontend)

```javascript
// Login
const loginResponse = await fetch('http://localhost:8000/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password'
  })
});

const loginData = await loginResponse.json();
console.log('Token:', loginData.token);

// Logout
const logoutResponse = await fetch('http://localhost:8000/api/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${loginData.token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

const logoutData = await logoutResponse.json();
console.log('Logout:', logoutData.message);
```

## Tests avec PHP (Artisan Tinker)

```php
php artisan tinker
```

Puis dans tinker :
```php
// Test de login
$response = Http::post('http://localhost:8000/api/login', [
    'email' => 'test@example.com',
    'password' => 'password'
]);
$response->json();

// Récupérer le token
$token = $response['token'];

// Test de logout
Http::withToken($token)->post('http://localhost:8000/api/logout')->json();
```

