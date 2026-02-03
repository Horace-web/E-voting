<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RequestOtpRequest;
use App\Models\User;
use App\Models\CodeOtp;
use App\Mail\OtpMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\VerifyOtpRequest;

class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/auth/request-otp",
     *     tags={"Authentification"},
     *     summary="Demander un code OTP",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="electeur@universite.bj")
     *         )
     *     ),
     *     @OA\Response(response=200, description="OTP envoyé"),
     *     @OA\Response(response=404, description="Email non reconnu")
     * )
     */
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
                'email' => $email,
                'code' => $code,
                'expire_at' => now()->addMinutes(10),
                'utilise' => false,
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



        public function verifyOtp(VerifyOtpRequest $request)
        {
            $email = $request->email;
            $code  = $request->code;

            DB::beginTransaction();

            try {
                $otpRecord = CodeOtp::where('email', $email)
                    ->where('code', $code)
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


}
