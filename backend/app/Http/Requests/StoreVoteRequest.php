<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use App\Models\Candidat;

class StoreVoteRequest extends FormRequest
{
    /**
     * Autorisation
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation
     */
    public function rules(): array
    {
        return [
            'election_id' => [
                'required',
                'uuid',
                'exists:elections,id',
            ],
            'candidat_id' => [
                'required',
                'uuid',
                'exists:candidats,id',
            ],
        ];
    }

    /**
     * Messages personnalisés
     */
    public function messages(): array
    {
        return [
            'election_id.required' => "L'élection est obligatoire.",
            'election_id.uuid'     => "L'identifiant de l'élection est invalide.",
            'election_id.exists'   => "L'élection sélectionnée est introuvable.",
            'candidat_id.required' => 'Le candidat est obligatoire.',
            'candidat_id.uuid'     => "L'identifiant du candidat est invalide.",
            'candidat_id.exists'   => 'Le candidat sélectionné est introuvable.',
        ];
    }

  

}
