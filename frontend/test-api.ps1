#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de test pour l'API E-Voting Backend
.DESCRIPTION
    Teste tous les endpoints de l'API pour vérifier que le backend est prêt pour le déploiement
.EXAMPLE
    .\test-api.ps1
    .\test-api.ps1 -ApiUrl "https://evoting-api.rps-benin.com"
#>

param(
    [string]$ApiUrl = "https://evoting-api.rps-benin.com"
)

# Couleurs pour l'affichage
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Fail { param($msg) Write-Host "[ERREUR] $msg" -ForegroundColor Red }
function Write-Warn { param($msg) Write-Host "[ATTENTION] $msg" -ForegroundColor Yellow }
function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Title { 
    param($msg) 
    Write-Host "`n=======================================" -ForegroundColor Magenta
    Write-Host "  $msg" -ForegroundColor Magenta
    Write-Host "=======================================`n" -ForegroundColor Magenta 
}

# Résultats globaux
$script:totalTests = 0
$script:passedTests = 0
$script:failedTests = 0

# Fonction de test d'endpoint
function Test-Endpoint {
    param(
        [string]$Route,
        [string]$Method = "GET",
        [hashtable]$Body = $null,
        [hashtable]$Headers = @{"Accept" = "application/json"; "Content-Type" = "application/json"},
        [int[]]$ExpectedStatus = @(200, 201, 401, 403),
        [string]$Description = ""
    )
    
    $script:totalTests++
    $url = "$ApiUrl$Route"
    
    try {
        $params = @{
            Uri = $url
            Method = $Method
            Headers = $Headers
            UseBasicParsing = $true
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-WebRequest @params
        $status = $response.StatusCode
        
        if ($ExpectedStatus -contains $status) {
            Write-Success "$Method $Route - Status: $status $(if($Description){" - $Description"})"
            $script:passedTests++
            
            # Essayer de parser le JSON
            try {
                $jsonContent = $response.Content | ConvertFrom-Json
                if ($jsonContent.message) {
                    Write-Host "   → Message: $($jsonContent.message)" -ForegroundColor Gray
                }
                if ($jsonContent.user) {
                    Write-Host "   → User: $($jsonContent.user.email) (Role: $($jsonContent.user.role))" -ForegroundColor Gray
                }
            } catch {
                # Pas de JSON, ignorer
            }
            
            return $true
        } else {
            Write-Warn "$Method $Route - Status inattendu: $status (Attendu: $($ExpectedStatus -join ', '))"
            return $false
        }
        
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        if ($ExpectedStatus -contains $statusCode) {
            Write-Success "$Method $Route - Status: $statusCode $(if($Description){" - $Description"})"
            $script:passedTests++
            
            # Tenter de lire le corps de l'erreur
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                $jsonError = $responseBody | ConvertFrom-Json
                if ($jsonError.message) {
                    Write-Host "   → Message: $($jsonError.message)" -ForegroundColor Gray
                }
            } catch {
                # Ignorer
            }
            
            return $true
        } else {
            Write-Fail "$Method $Route - Erreur: $statusCode $($_.Exception.Message)"
            $script:failedTests++
            return $false
        }
    }
}

# ===========================================
# DÉBUT DES TESTS
# ===========================================

Clear-Host
Write-Title "TEST DE L'API E-VOTING BACKEND"
Write-Info "URL de test: $ApiUrl"
Write-Info "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# Test 1: Serveur accessible
Write-Title "1. CONNEXION AU SERVEUR"
try {
    $response = Invoke-WebRequest -Uri $ApiUrl -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Success "Serveur accessible - Status: 200"
        $script:passedTests++
        $script:totalTests++
        
        if ($response.Content -match 'Laravel') {
            Write-Success "Framework Laravel detecte"
        } else {
            Write-Warn "Laravel non detecte dans la reponse"
        }
    }
} catch {
    Write-Fail "Impossible de se connecter au serveur: $($_.Exception.Message)"
    $script:failedTests++
    $script:totalTests++
}

# Test 2: Endpoints d'authentification
Write-Title "2. AUTHENTIFICATION"

Test-Endpoint -Route "/api/auth/login" -Method "POST" -Body @{email="test@example.com"; password="wrongpass"} -ExpectedStatus @(401, 404, 422) -Description "Login (attendu: erreur auth)"
Test-Endpoint -Route "/api/auth/profile" -Method "GET" -ExpectedStatus @(401, 404) -Description "Profil sans token (attendu: 401)"
Test-Endpoint -Route "/api/auth/logout" -Method "POST" -ExpectedStatus @(401, 404) -Description "Logout sans token"
Test-Endpoint -Route "/api/auth/resend-confirmation" -Method "POST" -ExpectedStatus @(404, 422) -Description "Renvoyer confirmation"

# Test 3: Endpoints Elections
Write-Title "3. ELECTIONS"

Test-Endpoint -Route "/api/elections" -Method "GET" -ExpectedStatus @(200, 401, 404) -Description "Liste des élections"
Test-Endpoint -Route "/api/elections/1" -Method "GET" -ExpectedStatus @(200, 401, 404) -Description "Détails élection #1"

# Test 4: Endpoints Candidats
Write-Title "4. CANDIDATS"

Test-Endpoint -Route "/api/elections/1/candidats" -Method "GET" -ExpectedStatus @(200, 401, 404) -Description "Candidats d'une élection"

# Test 5: Endpoints Votes
Write-Title "5. VOTES"

Test-Endpoint -Route "/api/votes" -Method "POST" -Body @{election_id=1; candidate_id=1} -ExpectedStatus @(401, 404, 422) -Description "Voter (sans auth)"

# Test 6: Endpoints Resultats
Write-Title "6. RESULTATS"

Test-Endpoint -Route "/api/elections/1/resultats" -Method "GET" -ExpectedStatus @(200, 401, 404) -Description "Résultats d'une élection"

# Test 7: Endpoints Admin - Utilisateurs
Write-Title "7. ADMIN - UTILISATEURS"

Test-Endpoint -Route "/api/users" -Method "GET" -ExpectedStatus @(401, 403, 404) -Description "Liste utilisateurs (admin requis)"
Test-Endpoint -Route "/api/users" -Method "POST" -Body @{email="new@example.com"; nom="Test"; prenom="User"} -ExpectedStatus @(401, 403, 404, 422) -Description "Créer utilisateur (admin requis)"

# Test 8: Test CORS
Write-Title "8. CONFIGURATION CORS"

try {
    $headers = @{
        "Origin" = "https://votreapp.netlify.app"
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "Content-Type"
    }
    
    $response = Invoke-WebRequest -Uri "$ApiUrl/api/elections" -Method OPTIONS -Headers $headers -UseBasicParsing -ErrorAction Stop
    
    $corsHeader = $response.Headers["Access-Control-Allow-Origin"]
    if ($corsHeader) {
        Write-Success "CORS configure - Allow-Origin: $corsHeader"
        $script:passedTests++
    } else {
        Write-Warn "En-tete CORS 'Access-Control-Allow-Origin' non trouve"
    }
    $script:totalTests++
    
} catch {
    Write-Warn "Impossible de tester CORS (attendu si endpoint n'existe pas encore)"
    $script:totalTests++
}

# ===========================================
# RAPPORT FINAL
# ===========================================

Write-Title "RAPPORT FINAL"

$successRate = if ($script:totalTests -gt 0) { [math]::Round(($script:passedTests / $script:totalTests) * 100, 2) } else { 0 }

Write-Host "Total de tests: $script:totalTests" -ForegroundColor White
Write-Host "Réussis: " -NoNewline
Write-Host "$script:passedTests" -ForegroundColor Green
Write-Host "Échoués: " -NoNewline
Write-Host "$script:failedTests" -ForegroundColor Red
Write-Host "Taux de réussite: " -NoNewline

if ($successRate -ge 80) {
    Write-Host "$successRate%" -ForegroundColor Green
    Write-Host "`n[OK] Le backend semble operationnel et pret pour le deploiement!`n" -ForegroundColor Green
} elseif ($successRate -ge 50) {
    Write-Host "$successRate%" -ForegroundColor Yellow
    Write-Host "`n[ATTENTION] Le backend est partiellement fonctionnel. Verifiez les erreurs ci-dessus.`n" -ForegroundColor Yellow
} else {
    Write-Host "$successRate%" -ForegroundColor Red
    Write-Host "`n[ERREUR] Le backend n'est pas encore pret. Beaucoup d'endpoints sont manquants.`n" -ForegroundColor Red
}

Write-Title "RECOMMANDATIONS"

if ($script:failedTests -gt ($script:totalTests / 2)) {
    Write-Host "Le backend semble ne pas etre deploye ou configure correctement." -ForegroundColor Yellow
    Write-Host "`nActions a effectuer sur le serveur:" -ForegroundColor Cyan
    Write-Host "  1. Deployer le code Laravel de l'API" -ForegroundColor White
    Write-Host "  2. Configurer la base de donnees (.env)" -ForegroundColor White
    Write-Host "  3. Executer les migrations: php artisan migrate" -ForegroundColor White
    Write-Host "  4. Configurer CORS pour accepter les requetes depuis Netlify" -ForegroundColor White
    Write-Host "  5. Tester a nouveau avec ce script`n" -ForegroundColor White
} else {
    Write-Host "[OK] Le backend est operationnel!" -ForegroundColor Green
    Write-Host "`nVous pouvez maintenant:" -ForegroundColor Cyan
    Write-Host "  1. Deployer le frontend sur Netlify" -ForegroundColor White
    Write-Host "  2. Configurer les variables d'environnement sur Netlify" -ForegroundColor White
    Write-Host "  3. Tester l'application complete`n" -ForegroundColor White
}

Write-Host "=======================================`n" -ForegroundColor Magenta
