<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ElectionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'description' => $this->description,
            'date_debut' => $this->date_debut->format('Y-m-d H:i:s'),
            'date_fin' => $this->date_fin->format('Y-m-d H:i:s'),
            'statut' => $this->statut,
            'nb_candidats' => $this->candidats->count(),
            'created_by' => [
                'id' => $this->createur->id,
                'nom' => $this->createur->nom,
            ],
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
