<?php

$env = env('APP_ENV', 'production');

$allowedOrigins = match ($env) {
    'local', 'development' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ],
    'staging' => [
        'https://staging.votresite.com',
        'https://staging-frontend.votresite.com',
    ],
    'production' => [
        'https://votresite.com',
        'https://www.votresite.com',
    ],
    default => [],
};

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
