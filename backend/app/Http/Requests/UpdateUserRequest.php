<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation pour la mise à jour
     */
    public function rules(): array
    {
        $userId = $this->route('id') ?? $this->route('user');

        return [
            'email' => [
                'sometimes',
                'email',
                'max:255',
                Rule::unique('users')->ignore($userId),
            ],
            'nom' => [
                'sometimes',
                'string',
                'max:255',
                'min:2',
            ],
            'role_id' => [
                'sometimes',
                'integer',
                'exists:roles,id',
            ],
            'statut' => [
                'sometimes',
                'string',
                Rule::in(['actif', 'inactif']),
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
            'email.email' => "Veuillez fournir une adresse email valide.",
            'email.unique' => "Cette adresse email est déjà utilisée.",
            'email.max' => "L'adresse email ne doit pas dépasser :max caractères.",

            // Nom
            'nom.string' => "Le nom doit être une chaîne de caractères.",
            'nom.max' => "Le nom ne doit pas dépasser :max caractères.",
            'nom.min' => "Le nom doit contenir au moins :min caractères.",

            // Rôle
            'role_id.integer' => "Le rôle doit être un identifiant valide.",
            'role_id.exists' => "Le rôle sélectionné n'existe pas.",

            // Statut
            'statut.in' => "Le statut doit être 'actif' ou 'inactif'.",
        ];
    }

    /**
     * Prépare les données pour la validation
     */
    protected function prepareForValidation(): void
    {
        // Nettoie et formate l'email en minuscules si présent
        if ($this->has('email')) {
            $this->merge([
                'email' => strtolower(trim($this->email)),
            ]);
        }

        // Nettoie le nom si présent
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
            // Vérifie si l'email est temporaire (uniquement si un nouvel email est fourni)
            if ($this->email && $this->isTemporaryEmail($this->email)) {
                $validator->errors()->add(
                    'email',
                    'Les adresses email temporaires ne sont pas autorisées.'
                );
            }

            // Vérifie le format du nom (uniquement si un nouveau nom est fourni)
            if ($this->nom && !preg_match('/^[a-zA-Z\s\-\'\À-ÿ]+$/', $this->nom)) {
                $validator->errors()->add(
                    'nom',
                    'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes.'
                );
            }

            // Vérifie si l'utilisateur existe (optionnel)
            if ($this->route('id') && !$this->userExists($this->route('id'))) {
                $validator->errors()->add(
                    'user',
                    "L'utilisateur à modifier n'existe pas."
                );
            }
        });
    }

    /**
     * Vérifie si l'email provient d'un domaine temporaire
     */
    private function isTemporaryEmail(string $email): bool
    {
        $domainesTemporaires = [
            'yopmail.com', 'temp-mail.org', 'guerrillamail.com',
            'mailinator.com', 'throwawaymail.com', '10minutemail.com',
            'fakeinbox.com', 'tempmail.com', 'disposablemail.com'
        ];

        $domaine = substr(strrchr($email, "@"), 1);
        return in_array(strtolower($domaine), $domainesTemporaires);
    }

    /**
     * Vérifie si l'utilisateur existe
     */
    private function userExists(int $userId): bool
    {
        return \App\Models\User::where('id', $userId)->exists();
    }

    /**
     * Données validées et préparées pour la mise à jour
     */
    public function validated($key = null, $default = null)
    {
        $validated = parent::validated();

        // Capitalisation du nom si présent
        if (isset($validated['nom'])) {
            $validated['nom'] = ucfirst(strtolower($validated['nom']));
        }

        // S'assurer que l'email est bien en minuscules si présent
        if (isset($validated['email'])) {
            $validated['email'] = strtolower($validated['email']);
        }

        return $validated;
    }

    /**
     * Récupère l'ID de l'utilisateur depuis la route
     */
    protected function getUserIdFromRoute(): ?int
    {
        return $this->route('id') ?? $this->route('user');
    }
}
