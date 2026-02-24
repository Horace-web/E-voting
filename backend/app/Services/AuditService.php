<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

class AuditService
{
    /**
     * Enregistrer une action dans les logs
     */
    public static function log(
        string $action,
        ?string $model = null,
        ?string $model_id = null,
        ?array $metadata = null
    ) {
        try {
            $user = Auth::user();

            AuditLog::create([
                'user_id'    => $user?->id,
                'action'     => $action,
                'model'      => $model,
                'model_id'   => $model_id,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'metadata'   => $metadata,
            ]);
        } catch (\Exception $e) {
            // Ne jamais bloquer l'application si l'audit échoue
            \Log::error('Erreur audit log', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Log de connexion
     */
    public static function logLogin($user)
    {
        self::log('login', 'User', $user->id, [
            'email' => $user->email,
            'role' => $user->role->code,
        ]);
    }

    /**
     * Log de déconnexion
     */
    public static function logLogout($user)
    {
        self::log('logout', 'User', $user->id);
    }

    /**
     * Log de vote
     */
    public static function logVote($user, $election_id)
    {
        self::log('vote', 'Election', $election_id, [
            'user_id' => $user->id,
            'user_email' => $user->email,
            // ❌ JAMAIS le candidat_id
        ]);
    }

    /**
     * Log de création d'élection
     */
    public static function logElectionCreated($election)
    {
        self::log('created', 'Election', $election->id, [
            'titre' => $election->titre,
        ]);
    }

    /**
     * Log de modification d'élection
     */
    public static function logElectionUpdated($election)
    {
        self::log('updated', 'Election', $election->id, [
            'titre' => $election->titre,
        ]);
    }

    /**
     * Log de suppression d'élection
     */
    public static function logElectionDeleted($election_id)
    {
        self::log('deleted', 'Election', $election_id);
    }
}