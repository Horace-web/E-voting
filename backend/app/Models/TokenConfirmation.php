<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TokenConfirmation extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'tokens_confirmation';

    protected $fillable = [
        'user_id',
        'token',
        'expire_at',
    ];

    protected $casts = [
        'expire_at' => 'datetime',
    ];

    /**
     * Relation : token → utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
