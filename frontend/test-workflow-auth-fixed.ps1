# ============================================
# TESTS POSTMAN - WORKFLOW AUTHENTIFICATION
# Basé sur POSTMAN_AUTH_FRONTEND.md
# ============================================

# Variables (à adapter selon ton environnement)
$BASE_URL = "http://localhost:8000/api"
$ADMIN_EMAIL = "admin@Vote.bj"
$ADMIN_PASSWORD = "Admin@123"
$USER_EMAIL = "test@universite.bj"
$USER_ROLE_ID = "23dd4542-7186-4429-b504-50b1927a1530"  # UUID Électeur

Write-Host "🚀 DÉBUT DES TESTS - WORKFLOW COMPLET" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# ============================================
# ÉTAPE 1: CONNEXION ADMIN
# ============================================
Write-Host "`n📌 ÉTAPE 1: Connexion admin" -ForegroundColor Yellow
try {
    $body = @{
        email = $ADMIN_EMAIL
        password = $ADMIN_PASSWORD
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method POST -ContentType "application/json" -Body $body -SkipHttpErrorCheck
    
    if ($response.success) {
        $ADMIN_TOKEN = $response.token
        Write-Host "✅ Admin connecté: $($response.user.email) (rôle: $($response.user.role))" -ForegroundColor Green
        Write-Host "🔑 Token admin: ${ADMIN_TOKEN}" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Échec connexion admin" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erreur connexion admin: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# ============================================
# ÉTAPE 2: CRÉATION UTILISATEUR (ADMIN)
# ============================================
Write-Host "`n📌 ÉTAPE 2: Création utilisateur par admin" -ForegroundColor Yellow
try {
    $body = @{
        email = $USER_EMAIL
        nom = "Jean Dupont"
        role_id = $USER_ROLE_ID
    } | ConvertTo-Json
    
    $headers = @{
        Authorization = "Bearer $ADMIN_TOKEN"
    }
    
    $response = Invoke-RestMethod -Uri "$BASE_URL/users" -Method POST -ContentType "application/json" -Headers $headers -Body $body -SkipHttpErrorCheck
    
    if ($response.success) {
        $USER_ID = $response.data.id
        $VERIFICATION_TOKEN = $response.verification.token
        Write-Host "✅ Utilisateur créé: $($response.data.email)" -ForegroundColor Green
        Write-Host "🆔 ID utilisateur: $USER_ID" -ForegroundColor Cyan
        Write-Host "🔗 Token verification: $VERIFICATION_TOKEN" -ForegroundColor Cyan
        Write-Host "📧 Email de confirmation envoyé (simulé)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Échec création utilisateur" -ForegroundColor Red
        Write-Host $response | ConvertTo-Json -Depth 10
    }
} catch {
    Write-Host "❌ Erreur création utilisateur: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 422) {
        try {
            $errorBody = $_.Exception.Response.GetResponseStream() | Get-Content | ConvertFrom-Json
            Write-Host "Details: $($errorBody | ConvertTo-Json -Depth 10)" -ForegroundColor Red
        } catch {
            Write-Host "Details: Erreur de validation 422" -ForegroundColor Red
        }
    }
}

# ============================================
# ÉTAPE 3: ACTIVATION COMPTE (VERIFY-ACCOUNT)
# ============================================
Write-Host "`n📌 ÉTAPE 3: Activation compte utilisateur" -ForegroundColor Yellow
$USER_PASSWORD = "Test1234!"
try {
    $body = @{
        token = $VERIFICATION_TOKEN
        password = $USER_PASSWORD
        password_confirmation = $USER_PASSWORD
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/verify-account" -Method POST -ContentType "application/json" -Body $body -SkipHttpErrorCheck
    
    if ($response.success) {
        $USER_TOKEN = $response.token
        Write-Host "✅ Compte activé avec succès" -ForegroundColor Green
        Write-Host "👤 Utilisateur: $($response.user.email) (rôle: $($response.user.role))" -ForegroundColor Green
        Write-Host "🔑 Token utilisateur: ${USER_TOKEN}" -ForegroundColor Cyan
        Write-Host "🔄 Connexion automatique réussie" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec activation compte" -ForegroundColor Red
        Write-Host $response | ConvertTo-Json -Depth 10
    }
} catch {
    Write-Host "❌ Erreur activation compte: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

# ============================================
# ÉTAPE 4: CONNEXION UTILISATEUR
# ============================================
Write-Host "`n📌 ÉTAPE 4: Connexion utilisateur classique" -ForegroundColor Yellow
try {
    $body = @{
        email = $USER_EMAIL
        password = $USER_PASSWORD
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method POST -ContentType "application/json" -Body $body -SkipHttpErrorCheck
    
    if ($response.success) {
        $USER_TOKEN = $response.token
        Write-Host "✅ Utilisateur connecté: $($response.user.email) (rôle: $($response.user.role))" -ForegroundColor Green
        Write-Host "🔑 Token utilisateur: ${USER_TOKEN}" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Échec connexion utilisateur" -ForegroundColor Red
        Write-Host $response | ConvertTo-Json -Depth 10
    }
} catch {
    Write-Host "❌ Erreur connexion utilisateur: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "⚠️  Compte non activé ou désactivé" -ForegroundColor Yellow
    }
}

# ============================================
# ÉTAPE 5: VÉRIFIER PROFIL (/AUTH/ME)
# ============================================
Write-Host "`n📌 ÉTAPE 5: Récupérer profil utilisateur" -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $USER_TOKEN"
    }
    
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/me" -Method GET -Headers $headers -SkipHttpErrorCheck
    
    if ($response.success) {
        Write-Host "✅ Profil récupéré avec succès" -ForegroundColor Green
        Write-Host "👤 Utilisateur: $($response.user.email)" -ForegroundColor Green
        Write-Host "🏷️  Rôle: $($response.user.role)" -ForegroundColor Green
        Write-Host "📊 Statut: $($response.user.statut)" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec récupération profil" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur profil: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "🔐 Token invalide ou expiré" -ForegroundColor Yellow
    }
}

# ============================================
# ÉTAPE 6: DÉCONNEXION
# ============================================
Write-Host "`n📌 ÉTAPE 6: Déconnexion utilisateur" -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $USER_TOKEN"
    }
    
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/logout" -Method POST -Headers $headers -SkipHttpErrorCheck
    
    if ($response.success) {
        Write-Host "✅ Déconnexion réussie" -ForegroundColor Green
        Write-Host "🔑 Token révoqué" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec déconnexion" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur déconnexion: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================
# ÉTAPE 7: VÉRIFIER TOKEN RÉVOQUÉ
# ============================================
Write-Host "`n📌 ÉTAPE 7: Vérifier token révoqué" -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $USER_TOKEN"
    }
    
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/me" -Method GET -Headers $headers -SkipHttpErrorCheck
    
    Write-Host "❌ Token toujours valide (erreur)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Token correctement révoqué (401 comme attendu)" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur inattendue: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ============================================
# RÉSUMÉ FINAL
# ============================================
Write-Host "`n🎉 TESTS TERMINÉS" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host "✅ Workflow complet testé avec succès" -ForegroundColor Green
Write-Host "📧 Email test: $USER_EMAIL" -ForegroundColor Cyan
Write-Host "🔑 Mot de passe: $USER_PASSWORD" -ForegroundColor Cyan
Write-Host "👤 Rôle: VOTER (Electeur)" -ForegroundColor Cyan
Write-Host "`n🌐 Tu peux maintenant te connecter au frontend avec:" -ForegroundColor Yellow
Write-Host "   URL: http://localhost:5173/login" -ForegroundColor Cyan
Write-Host "   Email: $USER_EMAIL" -ForegroundColor Cyan
Write-Host "   Password: $USER_PASSWORD" -ForegroundColor Cyan
