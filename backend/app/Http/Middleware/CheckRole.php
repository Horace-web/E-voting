<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        if (!in_array($request->user()->role->code, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé'
            ], 403);
        }

        return $next($request);
    }
}
