<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation pour les trois champs
     */
    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($this->user),
            ],
            'nom' => [
                'required',
                'string',
                'max:255',
                'min:2',
            ],
            'role_id' => [
                'required',
                'integer',
                'exists:roles,id',
            ],
        ];
    }

    /**
     * Messages d'erreur personnalisés en français
     */
    public function messages(): array
    {
        return [
            // Email
            'email.required' => "L'adresse email est obligatoire.",
            'email.email' => "Veuillez fournir une adresse email valide.",
            'email.unique' => "Cette adresse email est déjà utilisée.",
            'email.max' => "L'adresse email ne doit pas dépasser :max caractères.",

            // Nom
            'nom.required' => "Le nom est obligatoire.",
            'nom.string' => "Le nom doit être une chaîne de caractères.",
            'nom.max' => "Le nom ne doit pas dépasser :max caractères.",
            'nom.min' => "Le nom doit contenir au moins :min caractères.",

            // Rôle
            'role_id.required' => "Le rôle est obligatoire.",
            'role_id.integer' => "Le rôle doit être un identifiant valide.",
            'role_id.exists' => "Le rôle sélectionné n'existe pas.",
        ];
    }

    /**
     * Prépare les données pour la validation
     */
    protected function prepareForValidation(): void
    {
        // Nettoie et formate l'email en minuscules
        if ($this->has('email')) {
            $this->merge([
                'email' => strtolower(trim($this->email)),
            ]);
        }

        // Nettoie le nom (supprime les espaces multiples)
        if ($this->has('nom')) {
            $this->merge([
                'nom' => trim(preg_replace('/\s+/', ' ', $this->nom)),
            ]);
        }
    }

    /**
     * Validation supplémentaire après les règles de base
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Vérifie si l'email est un email temporaire
            if ($this->email && $this->isTemporaryEmail($this->email)) {
                $validator->errors()->add(
                    'email',
                    'Les adresses email temporaires ne sont pas autorisées.'
                );
            }

            // Vérifie si le nom contient des caractères spéciaux non autorisés
            if ($this->nom && !preg_match('/^[a-zA-Z\s\-\'\À-ÿ]+$/', $this->nom)) {
                $validator->errors()->add(
                    'nom',
                    'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes.'
                );
            }
        });
    }

    /**
     * Vérifie si l'email provient d'un domaine temporaire
     */
    private function isTemporaryEmail(string $email): bool
    {
        $domainsTemporaires = [
            'yopmail.com', 'temp-mail.org', 'guerrillamail.com',
            'mailinator.com', 'throwawaymail.com', '10minutemail.com',
            'fakeinbox.com', 'tempmail.com', 'disposablemail.com'
        ];

        $domaine = substr(strrchr($email, "@"), 1);
        return in_array(strtolower($domaine), $domainsTemporaires);
    }

    /**
     * Données validées et préparées pour la création
     */
    public function validated($key = null, $default = null)
    {
        $validated = parent::validated();

        // Capitalisation du nom (première lettre en majuscule)
        if (isset($validated['nom'])) {
            $validated['nom'] = ucfirst(strtolower($validated['nom']));
        }

        // S'assurer que l'email est bien en minuscules
        if (isset($validated['email'])) {
            $validated['email'] = strtolower($validated['email']);
        }

        return $validated;
    }
}
