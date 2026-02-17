<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use App\Models\Candidat;

class StoreVoteRequest extends FormRequest
{
    /**
     * Autorisation
     */
    public function authorize(): bool
    {
        return $this->user()?->role?->code === 'VOTER';
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
            'election_id.required' => 'L’élection est obligatoire.',
            'election_id.uuid' => 'L’identifiant de l’élection est invalide.',
            'election_id.exists' => 'L’élection sélectionnée est introuvable.',

            'candidat_id.required' => 'Le candidat est obligatoire.',
            'candidat_id.uuid' => 'L’identifiant du candidat est invalide.',
            'candidat_id.exists' => 'Le candidat sélectionné est introuvable.',
        ];
    }

    /**
     * Attributs personnalisés (pour messages plus propres)
     */
    public function attributes(): array
    {
        return [
            'election_id' => 'élection',
            'candidat_id' => 'candidat',
        ];
    }

    /**
     * Validation supplémentaire après règles
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {

            if ($this->election_id && $this->candidat_id) {

                $candidat = Candidat::find($this->candidat_id);

                if ($candidat && $candidat->election_id !== $this->election_id) {
                    $validator->errors()->add(
                        'candidat_id',
                        'Le candidat sélectionné n’appartient pas à cette élection.'
                    );
                }
            }
        });
    }
}
