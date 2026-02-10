<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCandidatRequest extends FormRequest
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
            'nom' => 'required|string|max:255',
            'programme' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png|max:2048', // ✅ Max 2MB
        ];
    }

    public function messages()
    {
        return [
            'photo.image' => 'Le fichier doit être une image.',
            'photo.mimes' => 'Formats acceptés : JPEG, JPG, PNG.',
            'photo.max' => 'La taille maximale est de 2 MB.',
        ];
    }
}
