<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ElectionController;
use App\Http\Controllers\Api\CandidatController;

// ========================================
// ROUTES PUBLIQUES (pas de connexion)
// ========================================
// Route::post('/auth/request-otp', [AuthController::class, 'requestOtp']);
// Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp'])
//     ->middleware('throttle:otp-verify');

Route::post('/auth/verify-account', [AuthController::class, 'verifyAccount']);
Route::post('/auth/login', [AuthController::class, 'login']);

// ========================================
// ROUTES PROTÉGÉES (connexion requise)
// ========================================
Route::middleware('protected')->group(function () {
    Route::middleware('auth:sanctum')->post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// ========================================
// ROUTES ADMIN UNIQUEMENT
// ========================================
Route::middleware(['protected', 'role:ADMIN'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});

// ========================================
// ROUTES VOTER UNIQUEMENT
// ========================================
Route::middleware(['protected', 'role:VOTER'])->group(function () {
    // Futures routes vote
});

// ========================================
// ROUTES AUDITOR UNIQUEMENT
// ========================================
Route::middleware(['protected', 'role:AUDITOR'])->group(function () {
    // Futures routes audit
});

// ========================================
// ROUTES ADMIN + AUDITOR
// ========================================
Route::middleware(['protected', 'role:ADMIN,AUDITOR'])->group(function () {
    // Futures routes (ex: consultation logs)
});

//lister les élections actives
Route::get('/elections', [ElectionController::class, 'index']);

//Détails d'une élection
Route::get('/elections/{id}', [ElectionController::class, 'show']);

//Créer une élection (admin)
Route::middleware('auth:sanctum' , 'role:ADMIN')->group(function () {
    Route::post('/elections', [ElectionController::class, 'store']);
});

//Ajouter un candidat à une élection (admin)
Route::middleware('auth:sanctum' , 'role:ADMIN')->group(function () {
    Route::post('/elections/{election_id}/candidats', [CandidatController::class, 'store']);
});

//Publier une élection (admin)
Route::middleware(['auth:sanctum', 'role:ADMIN'])->group(function () {
    Route::post('/elections/{id}/publier', [ElectionController::class, 'publier']);
});

//Cloturer une élection (admin)
Route::middleware(['auth:sanctum', 'role:ADMIN'])->group(function () {
    Route::post('/elections/{id}/cloturer', [ElectionController::class, 'cloturer']);
});
