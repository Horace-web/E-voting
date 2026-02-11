<?php

namespace App\Http\Controllers\Api;

use App\Models\Role;
use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        // Récupérer tous les rôles
        $roles = Role::all(['id', 'nom']); // Sélectionne uniquement id et nom

        return response()->json([
            'success' => true,
            'data' => $roles
        ]);

        
    }
}
