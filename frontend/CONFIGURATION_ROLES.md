# Configuration des IDs de Rôles

## ⚠️ Action Requise : Remplacer les UUIDs des Rôles

Pour que la création d'utilisateurs fonctionne, vous devez remplacer les IDs temporaires par les **vrais UUIDs** de votre table `roles`.

---

## 📋 Étape 1 : Récupérer les UUIDs depuis la base de données

Connectez-vous à votre base de données MySQL et exécutez :

```sql
SELECT id, code, nom FROM roles;
```

**Résultat attendu** (exemple) :
```
+--------------------------------------+---------+----------------+
| id                                   | code    | nom            |
+--------------------------------------+---------+----------------+
| a1b2c3d4-e5f6-7890-abcd-ef1234567890 | ADMIN   | Administrateur |
| b2c3d4e5-f6a7-8901-bcde-f12345678901 | VOTER   | Électeur       |
| c3d4e5f6-a7b8-9012-cdef-123456789012 | AUDITOR | Auditeur       |
+--------------------------------------+---------+----------------+
```

---

## 📝 Étape 2 : Remplacer les IDs dans le code

Ouvrez le fichier : **`src/pages/admin/Utilisateurs.jsx`**

Recherchez la fonction `loadRoles()` (lignes ~60-90) et remplacez :

```javascript
setRoles([
  { 
    id: "REMPLACER_PAR_ADMIN_UUID", // ← REMPLACEZ PAR LE VRAI UUID
    value: "admin", 
    label: "Administrateur", 
    color: "bg-purple-100 text-purple-700" 
  },
  { 
    id: "REMPLACER_PAR_VOTER_UUID", // ← REMPLACEZ PAR LE VRAI UUID
    value: "voter", 
    label: "Électeur", 
    color: "bg-blue-100 text-blue-700" 
  },
  { 
    id: "REMPLACER_PAR_AUDITOR_UUID", // ← REMPLACEZ PAR LE VRAI UUID
    value: "auditor", 
    label: "Auditeur", 
    color: "bg-green-100 text-green-700" 
  },
]);
```

**Par les vrais UUIDs** (exemple avec les UUIDs ci-dessus) :

```javascript
setRoles([
  { 
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", // UUID ADMIN
    value: "admin", 
    label: "Administrateur", 
    color: "bg-purple-100 text-purple-700" 
  },
  { 
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901", // UUID VOTER
    value: "voter", 
    label: "Électeur", 
    color: "bg-blue-100 text-blue-700" 
  },
  { 
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012", // UUID AUDITOR
    value: "auditor", 
    label: "Auditeur", 
    color: "bg-green-100 text-green-700" 
  },
]);
```

---

## ✅ Étape 3 : Redémarrer le serveur

Après modification, redémarrez le serveur :

```bash
# Arrêter le serveur (Ctrl+C)
# Relancer
npm run dev
```

---

## 🧪 Étape 4 : Tester la création d'utilisateur

1. **Connectez-vous** en tant qu'admin (`admin@Vote.bj` / `Admin@123`)
2. **Allez sur** `/admin/utilisateurs`
3. **Cliquez** sur "Créer utilisateur"
4. **Remplissez** le formulaire :
   - Nom : Votre nom complet
   - Email : **Votre vrai email** (pour recevoir la notification)
   - Rôle : Sélectionnez un rôle
5. **Soumettez** le formulaire

---

## 📧 Workflow de Confirmation (selon note.markdown)

Après création :

1. ✉️ **Email 1 (Confirmation)** : L'utilisateur reçoit un lien de confirmation (valide 48h)
2. 🔗 **Clic sur le lien** : Active le compte (statut: Inactif → Actif)
3. ✉️ **Email 2 (Identifiants)** : L'utilisateur reçoit :
   - Son email
   - Son mot de passe temporaire (12 caractères)
4. 🔐 **Connexion** : L'utilisateur peut se connecter avec ces identifiants

---

## ⚠️ Si GET /api/roles est implémenté plus tard

Lorsque le backend implémentera `GET /api/roles`, le système chargera automatiquement les rôles depuis l'API et **ignorera** les IDs hardcodés.

Aucune modification de code ne sera nécessaire ! 🎉

---

## 🆘 Problèmes Courants

### Erreur : "role_id is required"
→ Vérifiez que les UUIDs sont bien renseignés (pas de "REMPLACER_PAR_...")

### Erreur 422 : "role_id does not exist"
→ Les UUIDs ne correspondent pas à ceux de votre base. Re-vérifiez avec `SELECT id FROM roles;`

### Email non reçu
→ Vérifiez la configuration SMTP du backend (fichier `.env` Laravel)
