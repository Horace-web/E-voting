<?php

use Illuminate\Support\Facades\Route;

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