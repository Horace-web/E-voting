<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Models\PasswordTemporary;
use App\Models\TokenConfirmation;
use App\Mail\UserCreatedMail;
use App\Models\EmailVerification;
use App\Mail\AccountVerificationMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;


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
        DB::beginTransaction();

        try {
            // 1️⃣ Création utilisateur (statut = en_attente, password = null)
            $user = User::create([
                'email'   => $request->email,
                'nom'     => $request->nom,
                'role_id' => $request->role_id,
                'statut'  => 'en_attente',
                'password'=> null, // sera défini lors de la vérification
            ]);

            // 2️⃣ Génération token de vérification
            $token = Str::random(64);

            EmailVerification::create([
                'user_id'  => $user->id,
                'token'    => $token,
                'expire_at'=> now()->addMinutes(30),
            ]);

            // 3️⃣ Envoi email
            Mail::to($user->email)->send(
                new AccountVerificationMail($user, $token)
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur créé. Email de vérification envoyé.'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Erreur création utilisateur', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création'
            ], 500);
        }
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
