# Script pour configurer MySQL dans .env

$envPath = Join-Path $PSScriptRoot ".env"

# Lire le fichier .env actuel ou créer un nouveau
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    $envLines = $envContent -split "`r?`n"
} else {
    $envLines = @()
}

$newLines = @()
$dbConfigAdded = @{
    'DB_CONNECTION' = $false
    'DB_HOST' = $false
    'DB_PORT' = $false
    'DB_DATABASE' = $false
    'DB_USERNAME' = $false
    'DB_PASSWORD' = $false
}

# Parcourir les lignes existantes et les modifier
foreach ($line in $envLines) {
    if ($line -match '^DB_CONNECTION=') {
        $newLines += 'DB_CONNECTION=mysql'
        $dbConfigAdded['DB_CONNECTION'] = $true
    }
    elseif ($line -match '^DB_HOST=') {
        $newLines += 'DB_HOST=127.0.0.1'
        $dbConfigAdded['DB_HOST'] = $true
    }
    elseif ($line -match '^DB_PORT=') {
        $newLines += 'DB_PORT=3306'
        $dbConfigAdded['DB_PORT'] = $true
    }
    elseif ($line -match '^DB_DATABASE=') {
        $newLines += 'DB_DATABASE=e_voting'
        $dbConfigAdded['DB_DATABASE'] = $true
    }
    elseif ($line -match '^DB_USERNAME=') {
        $newLines += 'DB_USERNAME=root'
        $dbConfigAdded['DB_USERNAME'] = $true
    }
    elseif ($line -match '^DB_PASSWORD=') {
        $newLines += 'DB_PASSWORD='
        $dbConfigAdded['DB_PASSWORD'] = $true
    }
    elseif ($line -match '^#.*DB_') {
        # Ignorer les commentaires DB
        continue
    }
    elseif ($line.Trim() -ne '') {
        # Garder les autres lignes
        $newLines += $line
    }
}

# Ajouter les configurations DB manquantes
if (-not $dbConfigAdded['DB_CONNECTION']) {
    $newLines += 'DB_CONNECTION=mysql'
}
if (-not $dbConfigAdded['DB_HOST']) {
    $newLines += 'DB_HOST=127.0.0.1'
}
if (-not $dbConfigAdded['DB_PORT']) {
    $newLines += 'DB_PORT=3306'
}
if (-not $dbConfigAdded['DB_DATABASE']) {
    $newLines += 'DB_DATABASE=e_voting'
}
if (-not $dbConfigAdded['DB_USERNAME']) {
    $newLines += 'DB_USERNAME=root'
}
if (-not $dbConfigAdded['DB_PASSWORD']) {
    $newLines += 'DB_PASSWORD='
}

# Écrire le nouveau fichier
$newLines -join "`n" | Set-Content $envPath -Encoding UTF8

Write-Host "✅ Configuration MySQL ajoutée au fichier .env" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration actuelle :" -ForegroundColor Cyan
Get-Content $envPath | Select-String -Pattern "^DB_" | ForEach-Object { Write-Host "  $_" }

Write-Host ""
Write-Host "⚠️  N'oubliez pas de :" -ForegroundColor Yellow
Write-Host "  1. Créer la base de données MySQL : e_voting" -ForegroundColor Yellow
Write-Host "  2. Modifier DB_USERNAME et DB_PASSWORD si nécessaire" -ForegroundColor Yellow
Write-Host "  3. Exécuter : php artisan migrate" -ForegroundColor Yellow

