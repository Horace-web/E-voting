# 🧪 Guide de Test de l'API Backend

Ce document explique comment tester votre API backend avant de déployer le frontend sur Netlify.

## 📋 Prérequis

- PowerShell (préinstallé sur Windows)
- Accès Internet
- URL de l'API backend : `https://evoting-api.rps-benin.com`

## 🚀 Utilisation du Script de Test

### Méthode 1 : Test rapide (Simple)

```powershell
# Dans le dossier frontend
.\test-api.ps1
```

### Méthode 2 : Test avec URL personnalisée

```powershell
.\test-api.ps1 -ApiUrl "https://votreapi.com"
```

### Méthode 3 : Test en local

```powershell
.\test-api.ps1 -ApiUrl "http://localhost:8000"
```

## 📊 Interprétation des Résultats

Le script teste automatiquement :

### ✅ Tests d'authentification

- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/resend-confirmation` - Renvoyer email

### ✅ Tests des élections

- `GET /api/elections` - Liste des élections
- `GET /api/elections/{id}` - Détails d'une élection

### ✅ Tests des candidats

- `GET /api/elections/{id}/candidats` - Candidats

### ✅ Tests des votes

- `POST /api/votes` - Voter

### ✅ Tests des résultats

- `GET /api/elections/{id}/resultats` - Résultats

### ✅ Tests admin

- `GET /api/users` - Liste utilisateurs (admin)
- `POST /api/users` - Créer utilisateur (admin)

### ✅ Test CORS

- Vérification de la configuration CORS

## 🎯 Codes de Statut Attendus

| Code | Signification          | OK pour test ?                |
| ---- | ---------------------- | ----------------------------- |
| 200  | Succès                 | ✅ Parfait                    |
| 201  | Créé                   | ✅ Parfait                    |
| 401  | Non authentifié        | ✅ Normal (sans token)        |
| 403  | Interdit (permissions) | ✅ Normal (sans être admin)   |
| 404  | Non trouvé             | ❌ Endpoint manquant          |
| 422  | Données invalides      | ✅ Normal (test sans données) |

## 🔍 Exemple de Rapport

```
═══════════════════════════════════════
  📊 RAPPORT FINAL
═══════════════════════════════════════

Total de tests: 15
Réussis: 12
Échoués: 3
Taux de réussite: 80%

✅ Le backend semble opérationnel et prêt pour le déploiement!
```

### Taux de réussite

- **≥ 80%** : ✅ Backend opérationnel, prêt pour déploiement
- **50-79%** : ⚠️ Backend partiellement fonctionnel, vérifier erreurs
- **< 50%** : ❌ Backend non prêt, corriger les problèmes

## 🛠️ Que Faire si les Tests Échouent ?

### Si beaucoup de 404 (Non trouvé)

Le backend n'est pas déployé ou les routes ne sont pas définies.

**Actions** :

1. Vérifier que le code Laravel est bien déployé
2. Vérifier le fichier `routes/api.php`
3. Exécuter `php artisan route:list` sur le serveur

### Si beaucoup d'erreurs de connexion

Le serveur n'est pas accessible.

**Actions** :

1. Vérifier que le serveur est en ligne
2. Vérifier les DNS
3. Vérifier le certificat SSL

### Si erreurs CORS

Le backend refuse les requêtes cross-origin.

**Actions** :

1. Installer `laravel-cors` : `composer require fruitcake/laravel-cors`
2. Configurer `config/cors.php`
3. Ajouter le middleware CORS

## 📝 Test Manuel avec PowerShell

Si vous préférez tester manuellement :

### Test de connexion

```powershell
$body = @{
    email = "admin@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://evoting-api.rps-benin.com/api/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing
```

### Test avec authentification

```powershell
$token = "votre_token_jwt"

Invoke-WebRequest -Uri "https://evoting-api.rps-benin.com/api/auth/profile" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $token"
        "Accept" = "application/json"
    } `
    -UseBasicParsing
```

## 🔐 Configuration CORS Requise (Backend)

Pour que le frontend sur Netlify puisse appeler l'API :

### Fichier `config/cors.php` (Laravel)

```php
<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://votreapp.netlify.app',
        'http://localhost:4173',
        'http://localhost:5173'
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

## 📞 Support

Si les tests persistent à échouer :

1. Vérifiez les logs du serveur Laravel
2. Vérifiez la configuration de la base de données
3. Assurez-vous que les migrations sont exécutées
4. Vérifiez que les seeders sont exécutés (données de test)

## ✅ Checklist Backend Avant Déploiement Frontend

- [ ] Serveur accessible (200 OK)
- [ ] Framework Laravel détecté
- [ ] Endpoint `/api/auth/login` fonctionnel
- [ ] Endpoint `/api/elections` fonctionnel
- [ ] CORS configuré pour Netlify
- [ ] Base de données configurée
- [ ] Migrations exécutées
- [ ] Au moins un admin créé
- [ ] Certificat SSL valide

Une fois tous ces points verts ✅, vous pouvez déployer le frontend !
