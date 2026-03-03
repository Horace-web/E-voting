<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class StoreUserRequest extends FormRequest
{
    public function authorize()
    {
        Log::info('StoreUserRequest authorize appelé');
        return true; // Vérifiez que ça retourne bien true
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email|unique:users',
            'nom' => 'required|string|max:255',
            'role_id' => 'required|exists:roles,id',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'L\'email est requis.',
            'email.email' => 'L\'email doit être une adresse email valide.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'nom.required' => 'Le nom est requis.',
            'nom.string' => 'Le nom doit être une chaîne de caractères.',
            'nom.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'role_id.required' => 'Le rôle est requis.',
            'role_id.exists' => 'Le rôle spécifié n\'existe pas.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        Log::error('Échec validation', ['errors' => $validator->errors()]);
        throw new HttpResponseException(response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422));
    }

}
