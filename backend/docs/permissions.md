# Matrice des Permissions

| Endpoint                  | ADMIN | VOTER | AUDITOR | Public |
|---------------------------|-------|-------|---------|--------|
| POST /auth/request-otp    | ✅    | ✅    | ✅      | ✅     |
| POST /auth/verify-otp     | ✅    | ✅    | ✅      | ✅     |
| GET /me                   | ✅    | ✅    | ✅      | ❌     |
| POST /logout              | ✅    | ✅    | ✅      | ❌     |
| GET /users                | ✅    | ❌    | ❌      | ❌     |
| POST /users               | ✅    | ❌    | ❌      | ❌     |
| PUT /users/{id}           | ✅    | ❌    | ❌      | ❌     |
| DELETE /users/{id}        | ✅    | ❌    | ❌      | ❌     |

## Légende
- ✅ : Accès autorisé
- ❌ : Accès refusé (403)
- Public ✅ : Accessible sans authentification

## Notes
- Toutes les routes protégées vérifient que le compte est actif
- Un compte avec `statut = 'inactif'` retourne 403 sur toutes les routes protégées
