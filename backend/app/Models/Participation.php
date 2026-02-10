<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Participation extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'election_id',
        'voted_at',
    ];

    protected $casts = [
        'voted_at' => 'datetime',
    ];

    /**
     * Relation : participation d'un utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation : participation à une élection
     */
    public function election()
    {
        return $this->belongsTo(Election::class);
    }
}
