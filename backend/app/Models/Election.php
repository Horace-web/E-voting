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


        // Scope pour élections brouillon
    public function scopeBrouillon($query)
    {
        return $query->where('statut', 'Brouillon');
    }

    // Scope pour élections publiées (visibles mais pas encore ouvertes)
    public function scopePubliee($query)
    {
        return $query->where('statut', 'Publiée');
    }

    // Scope pour élections en cours
    public function scopeEnCours($query)
    {
        return $query->where('statut', 'EnCours')
                    ->where('date_debut', '<=', now())
                    ->where('date_fin', '>=', now());
    }

    // Scope pour élections clôturées
    public function scopeCloturee($query)
    {
        return $query->where('statut', 'Clôturée');
    }

    /*
     ** Scope pour élections ACTIVES (statut EnCours + dates valides)
     */
    public function scopeActive($query)
    {
        return $query->where('statut', 'EnCours')
                    ->where('date_debut', '<=', now())
                    ->where('date_fin', '>=', now());
    }
}
