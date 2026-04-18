<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Carbon\Carbon;

class StoreElectionRequest extends FormRequest
{
    public function authorize()
    {
        // ✅ Le middleware s'occupe déjà du rôle ADMIN
        return true;
    }

    public function rules()
    {
        return [
            'titre'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_debut'  => 'required|date',
            'date_fin'    => 'required|date',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->date_debut && $this->date_fin) {
                try {
                    $debut = Carbon::parse($this->date_debut);
                    $fin   = Carbon::parse($this->date_fin);

                    if ($debut->lt(now()->subHour())) {
                        $validator->errors()->add(
                            'date_debut',
                            'La date d\'ouverture doit être maintenant ou dans le futur proche.'
                        );
                    }

                    if ($fin->lte($debut)) {
                        $validator->errors()->add(
                            'date_fin',
                            'La date de clôture doit être postérieure à la date d\'ouverture.'
                        );
                    }
                } catch (\Exception $e) {
                    // Laisser la validation 'date' gérer les dates invalides
                }
            }
        });
    }

    public function messages()
    {
        return [
            'date_debut.required' => 'La date d\'ouverture est obligatoire.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors'  => $validator->errors()
            ], 422)
        );
    }
}
