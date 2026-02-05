<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PasswordTemporary extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'passwords_temporary';

    protected $fillable = [
        'user_id',
        'password_plain',
        'expire_at',
    ];

    protected $casts = [
        'expire_at' => 'datetime',
    ];

    /**
     * Relation : mot de passe temporaire → utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
