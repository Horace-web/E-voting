<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    protected $fillable = [
        'nom',
        'email',
        'password',
        'statut',
        'role_id',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Relation : utilisateur → rôle
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Relation : token de confirmation
     */
    public function confirmationToken()
    {
        return $this->hasOne(TokenConfirmation::class);
    }

    /**
     * Relation : mot de passe temporaire
     */
    public function temporaryPassword()
    {
        return $this->hasOne(PasswordTemporary::class);
    }
}
