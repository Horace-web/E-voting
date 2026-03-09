<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RequestOtpRequest;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use App\Models\CodeOtp;
use App\Mail\OtpMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\VerifyOtpRequest;
use Illuminate\Http\Request;
use App\Http\Requests\VerifyAccountRequest;
use App\Models\EmailVerification;
use Illuminate\Support\Facades\Hash;
use App\Services\AuditService;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
        path: '/api/auth/request-otp',
        summary: 'Demander un code OTP',
        tags: ['Authentification'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'electeur@universite.bj')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'OTP envoyé'),
            new OA\Response(response: 404, description: 'Email non reconnu')
        ]
    )]
    public function requestOtp(RequestOtpRequest $request)
    {
        $email = $request->email;

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email non reconnu'
            ], 404);
        }

        if ($user->statut !== 'actif') {
            return response()->json([
                'success' => false,
                'message' => 'Compte désactivé'
            ], 403);
        }

        DB::beginTransaction();

        try {
            CodeOtp::where('email', $email)
                ->where('expire_at', '<', now())
                ->delete();

            $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

            CodeOtp::create([
                'email'     => $email,
                'code'      => $code,
                'type'      => CodeOtp::TYPE_LOGIN,
                'expire_at' => now()->addMinutes(10),
                'utilise'   => false,
            ]);

            Mail::to($email)->send(new OtpMail($email, $code));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Code OTP envoyé par email. Vérifiez votre boîte de réception.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Erreur envoi OTP', [
                'email' => $email,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi du code'
            ], 500);
        }
    }


        #[OA\Post(
            path: '/api/auth/verify-otp',
            summary: 'Vérifier le code OTP',
            tags: ['Authentification'],
            requestBody: new OA\RequestBody(
                required: true,
                content: new OA\JsonContent(
                    required: ['email', 'code'],
                    properties: [
                        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'electeur@universite.bj'),
                        new OA\Property(property: 'code', type: 'string', example: '123456')
                    ]
                )
            ),
            responses: [
                new OA\Response(response: 200, description: 'Connexion réussie'),
                new OA\Response(response: 401, description: 'Code invalide ou expiré')
            ]
        )]
        public function verifyOtp(VerifyOtpRequest $request)
        {
            $email = $request->email;
            $code  = $request->code;

            DB::beginTransaction();

            try {
                $otpRecord = CodeOtp::where('email', $email)
                    ->where('code', $code)
                    ->where('type', CodeOtp::TYPE_LOGIN)  // ✅ Filtrer par type
                    ->where('utilise', false)
                    ->where('expire_at', '>', now())
                    ->first();

                if (!$otpRecord) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Code invalide ou expiré'
                    ], 401);
                }

                // Marquer OTP comme utilisé
                $otpRecord->update(['utilise' => true]);

                // Récupérer l'utilisateur + rôle
                $user = User::where('email', $email)
                    ->with('role')
                    ->first();

                if ($user->statut !== 'actif') {
                    return response()->json([
                        'success' => false,
                        'message' => 'Compte désactivé'
                    ], 403);
                }

                // Générer token Sanctum
                $token = $user->createToken('auth_token')->plainTextToken;

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Connexion réussie',
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'email' => $user->email,
                        'nom' => $user->nom,
                        'role' => $user->role->code,
                    ]
                ], 200);

            } catch (\Exception $e) {
                DB::rollBack();

                Log::error('Erreur vérification OTP', [
                    'email' => $email,
                    'error' => $e->getMessage()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Erreur serveur'
                ], 500);
            }
        }

    #[OA\Get(
        path: '/api/auth/me',
        summary: 'Utilisateur connecté',
        security: [['sanctum' => []]],
        tags: ['Authentification'],
        responses: [
            new OA\Response(response: 200, description: 'Infos utilisateur')
        ]
    )]
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $request->user()->id,
                'email' => $request->user()->email,
                'nom' => $request->user()->nom,
                'role' => $request->user()->role->code,
                'statut' => $request->user()->statut,
            ]
        ]);
    }

     #[OA\Post(
        path: '/api/auth/logout',
        summary: 'Déconnexion',
        security: [['sanctum' => []]],
        tags: ['Authentification'],
        responses: [
            new OA\Response(response: 200, description: 'Déconnexion réussie')
        ]
    )]
    public function logout(Request $request)
    {

        // ✅ LOG AUDIT AVANT suppression token
        AuditService::logLogout($request->user());

        // Supprimer le token actuel
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);

        dd($request->user(), $request->user()?->currentAccessToken());

    }


   #[OA\Post(
        path: '/api/auth/verify-account',
        summary: 'Vérification du compte via token',
        tags: ['Authentification'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['token', 'password'],
                properties: [
                    new OA\Property(property: 'token', type: 'string', example: 'abc123'),
                    new OA\Property(property: 'password', type: 'string', example: 'monMotDePasse')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Compte activé'),
            new OA\Response(response: 401, description: 'Token invalide ou expiré')
        ]
    )]
    public function verifyAccount(VerifyAccountRequest $request)
    {
        DB::beginTransaction();

        try {
            $verification = EmailVerification::where('token', $request->token)
                ->where('expire_at', '>', now())
                ->first();

            if (!$verification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token invalide ou expiré'
                ], 401);
            }

            $user = $verification->user;

            // Définir le mot de passe choisi par l'utilisateur
            $user->update([
                'password' => Hash::make($request->password),
                'statut'   => 'actif',
            ]);

            // Supprimer le token utilisé
            $verification->delete();

            // Générer token Sanctum (connexion automatique)
            $token = $user->createToken('auth_token')->plainTextToken;

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Compte activé avec succès',
                'token'   => $token,
                'user'    => [
                    'id'    => $user->id,
                    'email' => $user->email,
                    'nom'   => $user->nom,
                    'role'  => $user->role->code,
                ]
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Erreur vérification compte', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur'
            ], 500);
        }
    }


    #[OA\Post(
        path: '/api/auth/login',
        summary: 'Connexion avec email et mot de passe',
        tags: ['Authentification'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'admin@evoting.bj'),
                    new OA\Property(property: 'password', type: 'string', example: 'password123')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Connexion réussie'),
            new OA\Response(response: 401, description: 'Identifiants incorrects')
        ]
    )]
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)
            ->with('role')
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Identifiants incorrects'
            ], 401);
        }

        if ($user->statut !== 'actif') {
            return response()->json([
                'success' => false,
                'message' => 'Compte non activé ou désactivé'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        AuditService::logLogin($user);

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'token'   => $token,
            'user'    => [
                'id'    => $user->id,
                'email' => $user->email,
                'nom'   => $user->nom,
                'role'  => $user->role->code,
            ]
        ], 200);


    } 
    
}
