<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Route de test
Route::get('/test', function () {
    return response()->json([
        'message' => 'API Laravel fonctionne !',
        'timestamp' => now(),
    ]);
});

// Routes d'authentification (publiques)
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées (nécessitent un token valide)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});