<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AuditLog extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'model',
        'model_id',
        'ip_address',
        'user_agent',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];

    protected $keyType = 'string'; // Précise que la clé est une chaîne
    public $incrementing = false;  // Désactive l'auto-incrément

    public $timestamps = false;

    /**
     * Relation : log concernant un utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope : logs récents (7 derniers jours par défaut)
     */
    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Scope : filtrer par action
     */
    public function scopeAction($query, $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope : filtrer par modèle
     */
    public function scopeModel($query, $model)
    {
        return $query->where('model', $model);
    }

    // Empêcher la modification d'un log existant
    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // 1. Si la factory n'a pas mis de date, on en met une
            if (!$model->created_at) {
                $model->created_at = now();
            }

            // 2. On cherche le dernier log inséré par DATE (très important)
            // On utilise latest('created_at') pour être sûr du tri
            $lastLog = self::latest('created_at')->first();
            
            $lastLogHash = $lastLog ? $lastLog->hash_integrity : 'initial_seed_system_v1';

            // 3. Calcul du hash
            $dataToHash = [
                $lastLogHash,
                (string) $model->user_id,
                (string) $model->action,
                (string) $model->model_id,
                json_encode($model->metadata ?? [])
            ];

            $model->hash_integrity = hash('sha256', implode('|', $dataToHash));
        });

        static::updating(function ($model) {
            return false; // Annule toute tentative d'UPDATE
        });

        static::deleting(function ($model) {
            return false; // Annule toute tentative de DELETE
        });
    }
}