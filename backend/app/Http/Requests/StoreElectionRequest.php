<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreElectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return $this->user()->role->code === 'ADMIN';
    }

        public function rules()
    {
        return [
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_debut' => 'required|date|after:now',
            'date_fin' => 'required|date|after:date_debut', // ✅ Validation critique
        ];
    }

    public function messages()
    {
        return [
            'date_fin.after' => 'La date de clôture doit être postérieure à la date d\'ouverture.',
            'date_debut.after' => 'La date d\'ouverture doit être dans le futur.',
        ];
    }
}
