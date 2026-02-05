<?php

$allowedOrigins = [];

// Environnement de développement
if (app()->environment('local', 'development')) {
    $allowedOrigins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ];
}

// Environnement de staging
if (app()->environment('staging')) {
    $allowedOrigins = [
        'https://staging.votresite.com',
        'https://staging-frontend.votresite.com',
    ];
}

// Environnement de production
if (app()->environment('production')) {
    $allowedOrigins = [
        'https://votresite.com',
        'https://www.votresite.com',
    ];
}

return [
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => $allowedOrigins,

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
