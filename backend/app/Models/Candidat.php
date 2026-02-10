<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Candidat extends Model
{
    use HasUuids;

    protected $fillable = [
        'election_id',
        'nom',
        'photo',
        'programme',
    ];

    /**
     * Relation : candidat appartient à une élection
     */
    public function election()
    {
        return $this->belongsTo(Election::class);
    }

    /**
     * Relation : votes reçus par le candidat
     */
    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}
