<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ElectionController;
use App\Http\Controllers\Api\CandidatController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UploadController;

// ========================================
// ROUTES PUBLIQUES (pas de connexion)
// ========================================

Route::post('/auth/verify-account', [AuthController::class, 'verifyAccount']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/roles', [RoleController::class, 'index']);

// ========================================
// ROUTES PROTÉGÉES (connexion requise)
// ========================================

Route::middleware('auth:sanctum')->group(function () {

    // Authentification
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Élections (tous les utilisateurs connectés)
    Route::get('/elections', [ElectionController::class, 'index']);
    Route::get('/elections/{id}', [ElectionController::class, 'show']);
    Route::get('/elections/{id}/resultats', [ElectionController::class, 'resultats']);

    // ========================================
    // ROUTES ADMIN UNIQUEMENT
    // ========================================

    Route::middleware('role:ADMIN')->group(function () {

        // Gestion utilisateurs
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']); // ✅ Ajouté
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Gestion élections
        Route::post('/elections', [ElectionController::class, 'store']);
        Route::put('/elections/{id}', [ElectionController::class, 'update']);
        Route::delete('/elections/{id}', [ElectionController::class, 'destroy']);
        Route::post('/elections/{id}/publier', [ElectionController::class, 'publier']);
        Route::post('/elections/{id}/cloturer', [ElectionController::class, 'cloturer']);

        // Gestion candidats
        Route::post('/elections/{election_id}/candidats', [CandidatController::class, 'store']);
        Route::get('/elections/{election_id}/candidats', [CandidatController::class, 'index']); // ✅ Ajouté
        Route::get('/candidats/{id}', [CandidatController::class, 'show']); // ✅ Ajouté
        Route::put('/candidats/{id}', [CandidatController::class, 'update']);
        Route::delete('/candidats/{id}', [CandidatController::class, 'destroy']);

        // Upload
        Route::post('/upload/photo', [UploadController::class, 'storePhoto']);
    });

    // ========================================
    // ROUTES VOTER UNIQUEMENT
    // ========================================

    Route::middleware('role:VOTER')->group(function () {
        // Vote (à implémenter)
        // Route::post('/vote', [VoteController::class, 'store']);
        // Route::get('/mon-vote/{election_id}', [VoteController::class, 'checkVote']);
    });

    // ========================================
    // ROUTES AUDITOR UNIQUEMENT
    // ========================================

    Route::middleware('role:AUDITOR')->group(function () {
        // Audit (à implémenter)
        // Route::get('/audit/logs', [AuditController::class, 'index']);
    });

    // ========================================
    // ROUTES ADMIN + AUDITOR
    // ========================================

    Route::middleware('role:ADMIN,AUDITOR')->group(function () {
        // Consultation résultats détaillés, logs, etc.
        // Route::get('/elections/{id}/logs', [ElectionController::class, 'logs']);
    });
});
