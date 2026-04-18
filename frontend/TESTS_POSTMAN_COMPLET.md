# 🧪 GUIDE DE TESTS POSTMAN COMPLET
## Module Élections & Candidats - Tests Backend Laravel

---

## 📋 TABLE DES MATIÈRES

1. [Configuration Postman](#configuration-postman)
2. [Authentification](#authentification)
3. [Tests CRUD Élections](#tests-crud-élections)
4. [Tests CRUD Candidats](#tests-crud-candidats)
5. [Tests Workflow Élections](#tests-workflow-élections)
6. [Tests Vote](#tests-vote)
7. [Tests Résultats](#tests-résultats)
8. [Tests Cas d'erreur](#tests-cas-derreur)
9. [Collection Postman](#collection-postman)

---

## 🔧 CONFIGURATION POSTMAN

### Créer les variables d'environnement

1. **Créer un environnement "E-Voting Local"**
   - Nom : `E-Voting Local`
   - Variables :

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:8000/api` | `http://localhost:8000/api` |
| `admin_token` | (vide) | (sera rempli après login) |
| `voter_token` | (vide) | (sera rempli après login) |
| `election_id` | (vide) | (sera rempli après création) |
| `candidat_id` | (vide) | (sera rempli après création) |

2. **Activer l'environnement**
   - Sélectionner "E-Voting Local" dans le dropdown en haut à droite

---

## 🔐 AUTHENTIFICATION

### TEST 1.1 : Connexion ADMIN

**Endpoint :**
```
POST {{base_url}}/auth/login
```

**Headers :**
```
Content-Type: application/json
Accept: application/json
```

**Body (JSON) :**
```json
{
  "email": "admin@universite.bj",
  "password": "password123"
}
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "1|abc123def456...",
  "user": {
    "id": "uuid",
    "email": "admin@universite.bj",
    "nom": "Admin Test",
    "role": "ADMIN"
  }
}
```

**✅ Script Post-request (Tests tab) :**
```javascript
// Sauvegarder le token admin
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("admin_token", jsonData.token);
    console.log("✅ Token admin sauvegardé");
}
```

---

### TEST 1.2 : Connexion VOTER

**Endpoint :**
```
POST {{base_url}}/auth/login
```

**Body (JSON) :**
```json
{
  "email": "electeur1@universite.bj",
  "password": "password123"
}
```

**✅ Script Post-request :**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("voter_token", jsonData.token);
    console.log("✅ Token voter sauvegardé");
}
```

---

## 📝 TESTS CRUD ÉLECTIONS

### TEST 2.1 : Créer une élection (ADMIN)

**Endpoint :**
```
POST {{base_url}}/elections
```

**Headers :**
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {{admin_token}}
```

**Body (JSON) :**
```json
{
  "titre": "Élection Présidentielle 2026",
  "description": "Élection pour le poste de président de l'université",
  "date_debut": "2026-02-15 08:00:00",
  "date_fin": "2026-02-20 18:00:00"
}
```

**Réponse attendue (201 Created) :**
```json
{
  "success": true,
  "message": "Élection créée avec succès",
  "data": {
    "id": "uuid-election",
    "titre": "Élection Présidentielle 2026",
    "description": "...",
    "date_debut": "2026-02-15T08:00:00.000000Z",
    "date_fin": "2026-02-20T18:00:00.000000Z",
    "statut": "Brouillon",
    "created_at": "2026-02-04T..."
  }
}
```

**✅ Script Post-request :**
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("election_id", jsonData.data.id);
    console.log("✅ Election ID sauvegardé : " + jsonData.data.id);
}

// Tests automatiques
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Statut est Brouillon", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.statut).to.eql("Brouillon");
});
```

---

### TEST 2.2 : Lister les élections (ADMIN)

**Endpoint :**
```
GET {{base_url}}/elections
```

**Headers :**
```
Authorization: Bearer {{admin_token}}
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "titre": "Élection Présidentielle 2026",
      "description": "...",
      "date_debut": "...",
      "date_fin": "...",
      "statut": "Brouillon",
      "nb_candidats": 0,
      "created_by": "Admin Test",
      "created_at": "..."
    }
  ]
}
```

**✅ Tests :**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Array non vide", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an('array');
    pm.expect(jsonData.data.length).to.be.above(0);
});
```

---

### TEST 2.3 : Afficher une élection

**Endpoint :**
```
GET {{base_url}}/elections/{{election_id}}
```

**Headers :**
```
Authorization: Bearer {{admin_token}}
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "titre": "Élection Présidentielle 2026",
    "description": "...",
    "date_debut": "...",
    "date_fin": "...",
    "statut": "Brouillon",
    "created_by": {
      "id": "uuid",
      "nom": "Admin Test"
    },
    "candidats": [],
    "nb_candidats": 0,
    "created_at": "..."
  }
}
```

---

### TEST 2.4 : Modifier une élection (ADMIN)

**Endpoint :**
```
PUT {{base_url}}/elections/{{election_id}}
```

**Headers :**
```
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```

**Body (JSON) :**
```json
{
  "titre": "Élection Présidentielle 2026 - Modifiée",
  "description": "Description mise à jour"
}
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Élection mise à jour avec succès",
  "data": {
    "id": "uuid",
    "titre": "Élection Présidentielle 2026 - Modifiée",
    "description": "Description mise à jour",
    "date_debut": "...",
    "date_fin": "...",
    "statut": "Brouillon"
  }
}
```

**✅ Tests :**
```javascript
pm.test("Titre mis à jour", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.titre).to.include("Modifiée");
});
```

---

### TEST 2.5 : Supprimer une élection (ADMIN)

**Endpoint :**
```
DELETE {{base_url}}/elections/{{election_id}}
```

**Headers :**
```
Authorization: Bearer {{admin_token}}
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Élection supprimée avec succès"
}
```

**⚠️ Note :** Ne pas exécuter si vous voulez continuer les tests suivants !

---

## 👤 TESTS CRUD CANDIDATS

### TEST 3.1 : Ajouter un candidat (ADMIN)

**Endpoint :**
**Workflow de création d'un candidat**
⚠️ IMPORTANT : La création d'un candidat se fait en 2 étapes distinctes :

Upload de la photo (multipart/form-data)

Création du candidat (application/json)

**📸 ÉTAPE 1 : Upload de la photo**
Endpoint dédié pour uploader l'image du candidat.

Requête
text
POST {{base_url}}/upload/photo
Headers :

http
Authorization: Bearer {{admin_token}}
Content-Type: multipart/form-data
Body (form-data) :

Key	Value	Type	Description
photo	(fichier)	file	Image (JPEG, JPG, PNG max 2MB)
Réponse - Succès (200 OK)
```json
{
  "success": true,
  "message": "Photo uploadée avec succès",
  "data": {
    "photo_path": "candidats/abc123.jpg",
    "photo_url": "https://evoting-api.rps-benin.com/storage/candidats/abc123.jpg"
  }
}
Champ	Description
photo_path	✅ À conserver - Chemin à envoyer à l'étape 2
photo_url	URL complète pour affichage immédiat
Réponse - Erreur (422 Unprocessable Entity)
json
{
  "message": "The given data was invalid.",
  "errors": {
    "photo": ["Le fichier doit être une image."],
    "photo": ["Formats acceptés : JPEG, JPG, PNG."],
    "photo": ["La taille maximale est de 2 MB."]
  }
}
👤 ÉTAPE 2 : Création du candidat
Requête
text
POST {{base_url}}/elections/{{election_id}}/candidats
Headers :

http
Authorization: Bearer {{admin_token}}
Content-Type: application/json   ⚠️ OBLIGATOIRE
Body (raw JSON) :

````json
{
    "nom": "Jean Dupont",
    "programme": "Programme axé sur l'éducation et l'innovation",
    "photo_path": "candidats/abc123.jpg"
}
Champ	Type	Requis	Description
nom	string	✅ Oui	Nom complet du candidat (max 255)
programme	string	❌ Non	Description du programme
photo_path	string	❌ Non	Chemin reçu de l'étape 1
Réponse - Succès (201 Created)
json
{
  "success": true,
  "message": "Candidat ajouté avec succès",
  "data": {
    "id": "019c543a-f1d5-71e1-8ede-84214b2a4d74",
    "nom": "Jean Dupont",
    "programme": "Programme axé sur l'éducation et l'innovation",
    "photo_url": "https://evoting-api.rps-benin.com/storage/candidats/abc123.jpg"
  }
}
Champ	Description
id	UUID du candidat généré automatiquement
photo_url	URL complète de la photo (prête à afficher)
Réponse - Erreur (404 Not Found)
json
{
  "success": false,
  "message": "Élection non trouvée"
}
Réponse - Erreur (403 Forbidden)
json
{
  "success": false,
  "message": "Action non autorisée. Rôle administrateur requis."
}
```

**✅ Script Post-request :**
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("candidat_id", jsonData.data.id);
    console.log("✅ Candidat ID sauvegardé");
}
```
1. [Frontend] Sélectionne une photo
       ↓
2. [Frontend] Upload vers POST /api/upload/photo (multipart)
       ↓
3. [Backend] Stocke dans storage/app/public/candidats/
       ↓
4. [Backend] Retourne le chemin "candidats/photo.jpg"
       ↓
5. [Frontend] Envoie ce chemin avec les données JSON
       ↓
6. [Backend] Sauvegarde le chemin en base
       ↓
7. [Frontend] Affiche avec asset('storage/' + chemin)

```

---

## 🔄 TESTS WORKFLOW ÉLECTIONS

### TEST 4.1 : Publier une élection (Brouillon → Publiée)

**Endpoint :**
```
POST {{base_url}}/elections/{{election_id}}/publier
```

**Headers :**
```
Authorization: Bearer {{admin_token}}
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Élection publiée avec succès",
  "data": {
    "id": "uuid",
    "titre": "...",
    "statut": "Publiée"
  }
}
```

**✅ Tests :**
```javascript
pm.test("Statut est Publiée", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.statut).to.eql("Publiée");
});
```

---

### TEST 4.2 : Erreur publication sans 2 candidats

**Prérequis :** Créer une nouvelle élection avec 0 ou 1 candidat

**Endpoint :**
```
POST {{base_url}}/elections/{{election_id}}/publier
```

**Réponse attendue (400 Bad Request) :**
```json
{
  "success": false,
  "message": "Impossible de publier : l'élection doit avoir au moins 2 candidats (actuellement : 1)"
}
```

**✅ Tests :**
```javascript
pm.test("Status code is 400", function () {
    pm.response.to.have.status(400);
});

pm.test("Message d'erreur min 2 candidats", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.include("au moins 2 candidats");
});
```

---

---

### TEST 4.3 : Clôturer une élection

**Endpoint :**
```
POST {{base_url}}/elections/{{election_id}}/cloturer
```

**Headers :**
```
Authorization: Bearer {{admin_token}}
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "message": "Élection clôturée avec succès",
  "data": {
    "election": {
      "id": "uuid",
      "titre": "...",
      "statut": "Clôturée"
    },
    "resultats": [
      {
        "candidat_id": "uuid",
        "nom": "Jean Dupont",
        "voix": 15,
        "pourcentage": 60
      },
      {
        "candidat_id": "uuid",
        "nom": "Marie Martin",
        "voix": 10,
        "pourcentage": 40
      }
    ]
  }
}
```

**✅ Tests :**
```javascript
pm.test("Statut est Clôturée", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.election.statut).to.eql("Clôturée");
});

pm.test("Résultats présents", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.resultats).to.be.an('array');
});
```

---

## 🗳️ TESTS VOTE

### TEST 5.1 : Lister élections EN COURS (VOTER)

**Endpoint :**
```
GET {{base_url}}/elections
```

**Headers :**
```
Authorization: Bearer {{voter_token}}
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "titre": "Élection Présidentielle 2026",
      "description": "...",
      "date_debut": "...",
      "date_fin": "...",
      "nb_candidats": 2,
      "a_vote": false
    }
  ]
}
```

**✅ Tests :**
```javascript
pm.test("a_vote est false initialement", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data[0].a_vote).to.eql(false);
});
```

---

### TEST 5.2 : Voter pour un candidat (VOTER)

**Endpoint :**
```
POST {{base_url}}/vote
```

**Headers :**
```
Content-Type: application/json
Authorization: Bearer {{voter_token}}
```

**Body (JSON) :**
```json
{
  "election_id": "{{election_id}}",
  "candidat_id": "{{candidat_id}}"
}
```

**Réponse attendue (201 Created) :**
```json
{
  "success": true,
  "message": "Vote enregistré avec succès"
}
```

**✅ Tests :**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Message de succès", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});
```

---

### TEST 5.3 : Erreur vote double

**Endpoint :**
```
POST {{base_url}}/vote
```

**Headers :**
```
Authorization: Bearer {{voter_token}}
```

**Body (JSON) :**
```json
{
  "election_id": "{{election_id}}",
  "candidat_id": "{{candidat_id}}"
}
```

**Réponse attendue (403 Forbidden) :**
```json
{
  "success": false,
  "message": "Vous avez déjà voté pour cette élection"
}
```

**✅ Tests :**
```javascript
pm.test("Status code is 403", function () {
    pm.response.to.have.status(403);
});

pm.test("Message double vote", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.include("déjà voté");
});
```

---

### TEST 5.4 : Vérifier participation

**Endpoint :**
```
GET {{base_url}}/mon-vote/{{election_id}}
```

**Headers :**
```
Authorization: Bearer {{voter_token}}
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "a_vote": true
}
```

---

## 📊 TESTS RÉSULTATS

### TEST 6.1 : Consulter résultats

**Endpoint :**
```
GET {{base_url}}/elections/{{election_id}}/resultats
```

**Headers :**
```
Authorization: Bearer {{admin_token}}
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "data": {
    "election": {
      "id": "uuid",
      "titre": "Élection Présidentielle 2026",
      "statut": "Clôturée"
    },
    "statistiques": {
      "total_votes": 25,
      "total_electeurs_ayant_vote": 25,
      "taux_participation": 100
    },
    "resultats": [
      {
        "candidat_id": "uuid",
        "nom": "Jean Dupont",
        "voix": 15,
        "pourcentage": 60
      },
      {
        "candidat_id": "uuid",
        "nom": "Marie Martin",
        "voix": 10,
        "pourcentage": 40
      }
    ]
  }
}
```

**✅ Tests :**
```javascript
pm.test("Résultats triés par nombre de voix", function () {
    const jsonData = pm.response.json();
    const resultats = jsonData.data.resultats;
    for (let i = 0; i < resultats.length - 1; i++) {
        pm.expect(resultats[i].voix).to.be.at.least(resultats[i + 1].voix);
    }
});
```

---

## ❌ TESTS CAS D'ERREUR

### TEST 7.1 : Créer élection sans token (401)

**Endpoint :**
```
POST {{base_url}}/elections
```

**Headers :**
```
Content-Type: application/json
(PAS de Authorization)
```

**Body :**
```json
{
  "titre": "Test",
  "date_debut": "2026-02-15 08:00:00",
  "date_fin": "2026-02-20 18:00:00"
}
```

**Réponse attendue (401 Unauthorized)**

---

### TEST 7.2 : VOTER essaie de créer élection (403)

**Endpoint :**
```
POST {{base_url}}/elections
```

**Headers :**
```
Authorization: Bearer {{voter_token}}
```

**Réponse attendue (403 Forbidden)**

---

### TEST 7.3 : Dates incohérentes (422)

**Endpoint :**
```
POST {{base_url}}/elections
```

**Headers :**
```
Authorization: Bearer {{admin_token}}
```

**Body :**
```json
{
  "titre": "Test dates",
  "date_debut": "2026-02-20 18:00:00",
  "date_fin": "2026-02-15 08:00:00"
}
```

**Réponse attendue (422 Unprocessable Entity) :**
```json
{
  "success": false,
  "message": "La date de clôture doit être après la date d'ouverture"
}
```

---

### TEST 7.4 : Upload photo > 2MB (422)

**Endpoint :**
```
POST {{base_url}}/elections/{{election_id}}/candidats
```

**Body (form-data) :**
| Key | Value |
|-----|-------|
| `nom` | Test |
| `photo` | (fichier > 2MB) |

**Réponse attendue (422) :**
```json
{
  "message": "The photo field must not be greater than 2048 kilobytes.",
  "errors": {
    "photo": [
      "The photo field must not be greater than 2048 kilobytes."
    ]
  }
}
```

---

### TEST 7.5 : Modifier élection déjà ouverte (403)

**Prérequis :** Élection avec statut "EnCours"

**Endpoint :**
```
PUT {{base_url}}/elections/{{election_id}}
```

**Headers :**
```
Authorization: Bearer {{admin_token}}
```

**Body :**
```json
{
  "titre": "Tentative modification"
}
```

**Réponse attendue (403 Forbidden) :**
```json
{
  "success": false,
  "message": "Impossible de modifier une élection déjà ouverte ou clôturée"
}
```

---

## 📦 COLLECTION POSTMAN EXPORTABLE

### Importer la collection

1. **Créer un fichier `E-Voting.postman_collection.json`**

2. **Structure minimale :**
```json
{
  "info": {
    "name": "E-Voting API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login Admin",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@universite.bj\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": ["{{base_url}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Elections",
      "item": []
    },
    {
      "name": "Candidats",
      "item": []
    },
    {
      "name": "Vote",
      "item": []
    }
  ]
}
```

3. **Importer dans Postman :**
   - File → Import → Choisir le fichier JSON

---

## ✅ CHECKLIST FINALE DE TESTS

| Test | Statut | Notes |
|------|--------|-------|
| Login Admin | ⬜ | Token sauvegardé |
| Login Voter | ⬜ | Token sauvegardé |
| Créer élection | ⬜ | Statut Brouillon |
| Lister élections | ⬜ | Array non vide |
| Modifier élection | ⬜ | Brouillon uniquement |
| Ajouter candidat 1 | ⬜ | Avec photo |
| Ajouter candidat 2 | ⬜ | Avec photo |
| Publier élection | ⬜ | Min 2 candidats |
| Lister élections (VOTER) | ⬜ | EnCours uniquement |
| Voter | ⬜ | Status 201 |
| Vote double (erreur) | ⬜ | Status 403 |
| Clôturer élection | ⬜ | Dépouillement auto |
| Consulter résultats | ⬜ | Triés par voix |
| Erreur dates | ⬜ | Status 422 |
| Erreur photo > 2MB | ⬜ | Status 422 |
| Erreur modification ouverte | ⬜ | Status 403 |

---

## 🎯 ORDRE D'EXÉCUTION RECOMMANDÉ

1. ✅ Login Admin (sauvegarder token)
2. ✅ Login Voter (sauvegarder token)
3. ✅ Créer élection (sauvegarder ID)
4. ✅ Ajouter candidat 1 (sauvegarder ID)
5. ✅ Ajouter candidat 2
6. ✅ Publier élection
7. ✅ Ouvrir élection (manuel ou auto)
8. ✅ Lister élections (VOTER)
9. ✅ Voter
10. ✅ Vérifier double vote (erreur)
11. ✅ Clôturer élection
12. ✅ Consulter résultats

---

**Document généré par Claude**  
**Date : 04 février 2026**  
**Version : 1.0 - Tests complets backend**
