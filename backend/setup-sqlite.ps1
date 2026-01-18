# Script pour configurer SQLite dans .env

$envPath = Join-Path $PSScriptRoot ".env"

# Lire le fichier .env
$envContent = Get-Content $envPath -Raw
$envLines = $envContent -split "`r?`n"

$newLines = @()
$dbConnectionSet = $false

foreach ($line in $envLines) {
    if ($line -match '^DB_CONNECTION=') {
        $newLines += 'DB_CONNECTION=sqlite'
        $dbConnectionSet = $true
    }
    elseif ($line -match '^DB_DATABASE=') {
        $newLines += 'DB_DATABASE=database/database.sqlite'
    }
    elseif ($line -match '^DB_HOST=') {
        # Commenter ou retirer les lignes MySQL inutiles pour SQLite
        # On peut les garder mais elles seront ignorées
    }
    elseif ($line -match '^DB_PORT=') {
        # Commenter ou retirer
    }
    elseif ($line -match '^DB_USERNAME=') {
        # Commenter ou retirer
    }
    elseif ($line -match '^DB_PASSWORD=') {
        # Commenter ou retirer
    }
    elseif ($line.Trim() -ne '') {
        $newLines += $line
    }
}

# S'assurer que DB_CONNECTION est défini
if (-not $dbConnectionSet) {
    $newLines += 'DB_CONNECTION=sqlite'
}

# S'assurer que DB_DATABASE est défini
$hasDbDatabase = $newLines | Where-Object { $_ -match '^DB_DATABASE=' }
if (-not $hasDbDatabase) {
    $newLines += 'DB_DATABASE=database/database.sqlite'
}

# Écrire le nouveau fichier
$newLines -join "`n" | Set-Content $envPath -Encoding UTF8

Write-Host "✅ Configuration SQLite ajoutée au fichier .env" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration actuelle :" -ForegroundColor Cyan
Get-Content $envPath | Select-String -Pattern "^DB_" | ForEach-Object { Write-Host "  $_" }

