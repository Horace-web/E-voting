<?php

namespace App\Http\Controllers\Api;

use App\Models\Role;
use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class RoleController extends Controller
{
    #[OA\Get(
        path: '/api/roles',
        summary: 'Lister tous les rôles',
        tags: ['Rôles'],
        responses: [
            new OA\Response(response: 200, description: 'Liste des rôles'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function index()
    {
        $roles = Role::all(['id', 'nom']);

        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }
}