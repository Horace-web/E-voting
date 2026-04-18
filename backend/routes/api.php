<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ElectionController;
use App\Http\Controllers\Api\CandidatController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\AuditController;
use App\Http\Controllers\Api\VoteController;

// ========================================
// ROUTES PUBLIQUES (pas de connexion)
// ========================================

Route::post('/auth/verify-account', [AuthController::class, 'verifyAccount']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/roles', [RoleController::class, 'index']);
Route::post('/auth/forgot-password-otp', [AuthController::class, 'forgotPasswordOtp']);
Route::post('/auth/verify-otp-reset-password', [AuthController::class, 'verifyOtpResetPassword']);

// ========================================
// ROUTES PROTEGEES (connexion requise)
// ========================================

Route::middleware('auth:sanctum')->group(function () {
    // Authentification
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Elections (tous les utilisateurs connectes)
    Route::get('/elections', [ElectionController::class, 'index']);
    Route::get('/elections/{id}', [ElectionController::class, 'show']);
    Route::get('/elections/{id}/resultats', [ElectionController::class, 'resultats']);
    Route::get('/elections/{id}/results', [ElectionController::class, 'resultats']);
    Route::get('/elections/{election_id}/candidats', [CandidatController::class, 'index']);

    // ========================================
    // ROUTES ADMIN UNIQUEMENT
    // ========================================

    Route::middleware('role:ADMIN')->group(function () {
        // Gestion utilisateurs
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Gestion elections
        Route::post('/elections', [ElectionController::class, 'store']);
        Route::put('/elections/{id}', [ElectionController::class, 'update']);
        Route::delete('/elections/{id}', [ElectionController::class, 'destroy']);
        Route::post('/elections/{id}/publier', [ElectionController::class, 'publier']);
        Route::post('/elections/{id}/cloturer', [ElectionController::class, 'cloturer']);

        // Gestion candidats
        Route::post('/elections/{election_id}/candidats', [CandidatController::class, 'store']);
        Route::get('/candidats/{id}', [CandidatController::class, 'show']);
        Route::put('/candidats/{id}', [CandidatController::class, 'update']);
        Route::delete('/candidats/{id}', [CandidatController::class, 'destroy']);

        // Upload
        Route::post('/upload/photo', [UploadController::class, 'storePhoto']);
    });

    // ========================================
    // ROUTES VOTER UNIQUEMENT
    // ========================================

    Route::middleware('role:VOTER')->group(function () {
        Route::post('/vote', [VoteController::class, 'store']);
        Route::post('/elections/{election_id}/vote', [VoteController::class, 'store']);
        Route::get('/mon-vote/{election_id}', [VoteController::class, 'checkVote']);
        Route::get('/vote/history', [VoteController::class, 'history']);
    });

    // ========================================
    // ROUTES ADMIN + AUDITOR
    // ========================================

    Route::middleware('role:ADMIN,AUDITOR')->group(function () {
        Route::get('/audit/logs', [AuditController::class, 'index']);
        Route::get('/audit/logs/{id}', [AuditController::class, 'show']);
        Route::get('/audit/participations', [AuditController::class, 'participations']);
        Route::get('/audit/elections/{id}/integrity', [AuditController::class, 'checkIntegrity']);
        Route::get('/audit/stats', [AuditController::class, 'stats']);
        Route::get('/audit/export/logs', [AuditController::class, 'exportLogs']);
        Route::get('/audit/export/report/{election_id}', [AuditController::class, 'exportReport']);
    });
});
