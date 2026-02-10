<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Election extends Model
{
    use HasUuids;

    protected $fillable = [
        'titre',
        'description',
        'date_debut',
        'date_fin',
        'statut',
        'created_by',
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin'   => 'datetime',
    ];

    /**
     * Relation : élection créée par un admin
     */
    public function createur()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relation : candidats de l'élection
     */
    public function candidats()
    {
        return $this->hasMany(Candidat::class);
    }

    /**
     * Relation : participations à l'élection
     */
    public function participations()
    {
        return $this->hasMany(Participation::class);
    }

    /**
     * Relation : votes de l'élection
     */
    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    /**
     * Scope : élections actives
     */
    public function scopeActive($query)
    {
        return $query->where('statut', 'active')
                     ->where('date_debut', '<=', now())
                     ->where('date_fin', '>=', now());
    }
}
