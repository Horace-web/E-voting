<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CandidatResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'programme' => $this->programme,
            'photo_url' => $this->photo
                ? asset('storage/' . $this->photo)
                : null, // ✅ URL complète pour le frontend
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
