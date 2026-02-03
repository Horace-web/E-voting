<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;


Route::get('/test', function () {
    return response()->json([
        'message' => 'API Laravel fonctionne !',
        'timestamp' => now(),
    ]);
});

// Route pour la connexion (à développer plus tard)
Route::post('/login', function () {
    return response()->json(['message' => 'Login endpoint']);
});

// Route pour la demande de code OTP
Route::post('/auth/request-otp', [AuthController::class, 'requestOtp']);

// Route pour la vérification du code OTP
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp'])
    ->middleware('throttle:otp-verify');


// Routes protégées - Admin uniquement
Route::middleware(['auth:sanctum', 'role:ADMIN'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});
