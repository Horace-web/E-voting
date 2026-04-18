# 🛠 Rapport d'Intervention Backend - E-voting

Ce rapport liste les points de blocage identifiés lors de l'intégration du nouveau Frontend.

## 1. CandidatController - Méthode manquante
*   **Problème :** L'appel `GET /api/elections/{id}/candidats` échoue avec une erreur 500.
*   **Erreur :** `Method App\Http\Controllers\Api\CandidatController::index does not exist.`
*   **Action :** Le fichier `api.php` pointe vers `CandidatController@index`, mais la méthode n'est pas définie dans le contrôleur. Il faut implémenter une méthode qui retourne la liste des candidats filtrés par `election_id`.

## 2. Routes de Résultats - 404 Not Found
*   **Problème :** L'appel `GET /api/elections/{id}/results` renvoie une 404.
*   **Action :** S'assurer que les deux alias existent dans `api.php` (pour la compatibilité) et pointent vers la fonction de calcul des votes :
    ```php
    Route::get('/elections/{id}/resultats', [ElectionController::class, 'resultats']);
    Route::get('/elections/{id}/results', [ElectionController::class, 'resultats']);
    ```

## 3. Gestion des Rôles & Permissions - 403 Forbidden
*   **Problème :** L'accès à `/audit/logs` renvoie une 403 même pour l'administrateur.
*   **Action :** Vérifier le middleware `CheckRole`. Il semble y avoir un conflit entre le rôle stocké en base (`ADMIN` ou `admin`) et celui attendu par le middleware. 
*   **Note :** Le Frontend attend que le profil utilisateur renvoie les champs `prenom` et `nom` (en minuscules).

## 4. Création d'utilisateur - 500 Error
*   **Problème :** Le `POST /api/users` échoue avec message `"Erreur lors de la création"`.
*   **Action :** Vérifier les validations dans `UserController@store`. Le Frontend envoie les champs classiques (`nom`, `email`, `role_id`, `password`). Vérifier si un champ obligatoire en base de données est manquant dans la requête.

## 5. Format des Réponses (Consistance)
*   **Important :** Pour les listes, merci de toujours envelopper les données dans une clé `data` ou de renvoyer le tableau directement.
*   **Exemple idéal :** `{ "success": true, "data": [...] }` ou `{ "success": true, "candidates": [...] }`
