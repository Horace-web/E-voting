<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\CheckRole;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', // ← AJOUTE CETTE LIGNE
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Ta configuration middleware ici
        $middleware->alias([
            'role' => CheckRole::class,
        ]);

        // IMPORTANT : Autoriser CORS pour React
        $middleware->validateCsrfTokens([
            'http://localhost:5173',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
