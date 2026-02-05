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
}
