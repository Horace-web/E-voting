<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('id');

        return [
            'email' => 'email|unique:users,email,' . $userId,
            'nom' => 'string|max:255',
            'role_id' => 'exists:roles,id',
            'statut' => 'in:actif,inactif',
        ];
    }
    public function messages(): array
    {
        return [
            'email.email' => 'L\'email doit être une adresse email valide.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'nom.string' => 'Le nom doit être une chaîne de caractères.',
            'nom.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'role_id.exists' => 'Le rôle spécifié n\'existe pas.',
            'statut.in' => 'Le statut doit être soit "actif" soit "inactif".',
        ];
    }   
}
