<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Lister tous les utilisateurs
     */
    public function index()
    {
        $users = User::with('role')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Créer un nouvel utilisateur
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create([
            'email' => $request->email,
            'nom' => $request->nom,
            'role_id' => $request->role_id,
            'statut' => 'actif',
        ]);

        return response()->json([
            'success' => true,
            'data' => $user
        ], 201);
    }

    /**
     * Modifier un utilisateur
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Désactiver un utilisateur (soft delete)
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->update(['statut' => 'inactif']);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur désactivé'
        ]);
    }
}
