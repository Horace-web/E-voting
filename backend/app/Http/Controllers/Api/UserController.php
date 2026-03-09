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
use OpenApi\Attributes as OA;

class UserController extends Controller
{
    #[OA\Get(
        path: '/api/users',
        summary: 'Lister tous les utilisateurs (ADMIN uniquement)',
        security: [['sanctum' => []]],
        tags: ['Utilisateurs'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Liste paginée des utilisateurs',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'data', type: 'object'),
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Non autorisé'),
            new OA\Response(response: 403, description: 'Accès refusé'),
        ]
    )]
    public function index()
    {
        $users = User::with('role')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    #[OA\Post(
        path: '/api/users',
        summary: 'Créer un nouvel utilisateur (ADMIN uniquement)',
        security: [['sanctum' => []]],
        tags: ['Utilisateurs'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'nom', 'role_id'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'utilisateur@evoting.bj'),
                    new OA\Property(property: 'nom', type: 'string', example: 'Jean Dupont'),
                    new OA\Property(property: 'role_id', type: 'integer', example: 2),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Utilisateur créé, email de vérification envoyé',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Utilisateur créé. Email de vérification envoyé.'),
                    ]
                )
            ),
            new OA\Response(response: 422, description: 'Données invalides'),
            new OA\Response(response: 500, description: 'Erreur serveur'),
            new OA\Response(response: 401, description: 'Non autorisé'),
            new OA\Response(response: 403, description: 'Accès refusé'),
        ]
    )]
    public function store(StoreUserRequest $request)
    {
        // Débogage temporaire
    Log::info('Role ID reçu : ' . $request->role_id);

    // Vérifier si le rôle existe
    $roleExiste = \App\Models\Role::where('id', $request->role_id)->exists();
    Log::info('Rôle existe : ' . ($roleExiste ? 'Oui' : 'Non'));

        DB::beginTransaction();

        try {
            $user = User::create([
                'email'    => $request->email,
                'nom'      => $request->nom,
                'role_id'  => $request->role_id,
                'statut'   => 'en_attente',
                'password' => null,
            ]);

            $token = Str::random(64);

            EmailVerification::create([
                'user_id'   => $user->id,
                'token'     => $token,
                'expire_at' => now()->addMinutes(30),
            ]);

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

    #[OA\Put(
        path: '/api/users/{id}',
        summary: 'Modifier un utilisateur (ADMIN uniquement)',
        security: [['sanctum' => []]],
        tags: ['Utilisateurs'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'ID de l\'utilisateur'
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'nouveau@evoting.bj'),
                    new OA\Property(property: 'nom', type: 'string', example: 'Nouveau Nom'),
                    new OA\Property(property: 'role_id', type: 'integer', example: 2),
                    new OA\Property(property: 'statut', type: 'string', example: 'actif'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Utilisateur mis à jour avec succès'),
            new OA\Response(response: 404, description: 'Utilisateur non trouvé'),
            new OA\Response(response: 422, description: 'Données invalides'),
            new OA\Response(response: 401, description: 'Non autorisé'),
            new OA\Response(response: 403, description: 'Accès refusé'),
        ]
    )]
    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    #[OA\Delete(
        path: '/api/users/{id}',
        summary: 'Désactiver un utilisateur (ADMIN uniquement)',
        description: 'Ne supprime pas l\'utilisateur, change son statut en "inactif".',
        security: [['sanctum' => []]],
        tags: ['Utilisateurs'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'ID de l\'utilisateur'
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Utilisateur désactivé avec succès'),
            new OA\Response(response: 404, description: 'Utilisateur non trouvé'),
            new OA\Response(response: 401, description: 'Non autorisé'),
            new OA\Response(response: 403, description: 'Accès refusé'),
        ]
    )]
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
