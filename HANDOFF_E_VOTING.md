# Handoff court pour reprise du projet E-voting

## Projet de référence

Utiliser uniquement ce projet :

```text
C:\Users\LENOVO\IA De Zéro à Héros\E-voting\E-voting
```

### Dossiers importants
- Frontend :
  - `C:\Users\LENOVO\IA De Zéro à Héros\E-voting\E-voting\Frontend`
- Backend :
  - `C:\Users\LENOVO\IA De Zéro à Héros\E-voting\E-voting\backend`

Attention :
- il existe d'autres copies du projet sur la machine
- elles ont déjà causé de la confusion
- ne pas travailler sur les autres copies

---

## URLs de production

- Frontend prod :
  - `https://e-voting-esgis.netlify.app`
- Backend prod :
  - `https://evoting-api.rps-benin.com/api`

---

## État global actuel

## Ce qui marche

### Production
- login admin : OK
- login d'au moins un autre utilisateur : OK
- CORS backend prod : corrigé
- `GET /api/auth/me` : OK
- dashboard admin : OK
- création d'élection : OK
- audit : OK

### Backend
- Laravel démarre
- routes principales présentes
- auth / users / elections / candidats / votes / audit exposés

### Local
- les flux locaux ont déjà été beaucoup débogués :
  - création utilisateur
  - mail d'activation
  - confirmation compte
  - login selon rôle

---

## Bug principal à traiter

### Admin > Candidats
Le backend semble créer correctement, mais le frontend n'affiche pas bien.

Symptôme :
- l'admin crée une élection
- tente d'ajouter des candidats
- rien ou presque ne s'affiche à l'écran
- pas de retour utilisateur clair

Cause la plus probable :
- parsing incorrect des réponses API paginées dans le frontend

---

## Problème technique principal

Plusieurs pages frontend supposent ceci :

```js
const list = Array.isArray(response) ? response : response?.data || [];
```

Mais le backend peut renvoyer :

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [...]
  }
}
```

Donc il faut souvent lire :
- `payload`
- `payload.data`
- `payload.data.data`

et aujourd'hui ce n'est pas fait proprement partout.

---

## Fichiers frontend à ouvrir en priorité

### Priorité 1
- `Frontend/src/pages/admin/Candidats.jsx`

### Priorité 2
- `Frontend/src/pages/admin/Elections.jsx`
- `Frontend/src/pages/admin/Resultats.jsx`
- `Frontend/src/pages/electeur/ElecteurDashboardNew.jsx`
- `Frontend/src/pages/electeur/ElecteurResultats.jsx`
- `Frontend/src/pages/electeur/ElecteurVoteNew.jsx`

### Services à inspecter
- `Frontend/src/services/election.service.js`
- `Frontend/src/services/candidate.service.js`

---

## Ce qui est fragile ou faux

### Frontend
- parsing API incohérent dans plusieurs pages
- feedback d'erreur trop faible sur `Candidats.jsx`
- certaines fonctions `Utilisateurs` sont encore simulées
  - suppression utilisateur
  - import CSV

### Backend
- les routes existent, donc le backend n'est pas le suspect principal sur le bug candidats
- tests métier insuffisants
- `php artisan test` passe mais seulement sur les tests d'exemple

### Qualité
- dette technique dans certains services
- textes parfois mal encodés
- build local pas totalement fiabilisé dans un environnement de test (`spawn EPERM` observé)

---

## Hypothèse actuelle sur le bug candidats

Le plus probable est :

1. le backend crée bien le candidat
2. le frontend recharge mal la liste
3. la réponse est mal interprétée
4. le candidat n'apparaît pas

Donc :
- priorité frontend avant backend sur ce point

---

## Ce qu'il faut faire en premier

### Étape 1
Créer une fonction utilitaire unique pour normaliser toutes les réponses API.

Objectif :
gérer correctement les cas suivants :
- tableau direct
- `payload.data`
- `payload.data.data`
- `payload.items`

### Étape 2
Corriger `Frontend/src/pages/admin/Candidats.jsx`
- chargement des élections
- chargement des candidats
- affichage d'erreur intégré à l'écran
- affichage de succès après création

### Étape 3
Retester le flux admin complet :
1. login admin
2. création élection
3. upload photo
4. création candidat
5. affichage candidat
6. création d'un second candidat
7. publication élection

### Étape 4
Ensuite seulement, tester le flux électeur :
1. login électeur
2. affichage élections publiées
3. vote
4. anti double-vote
5. historique
6. résultats

---

## Requêtes API utiles pour debug

### Headers attendus
```http
Accept: application/json
Authorization: Bearer <vrai_token>
```

### À tester
- `GET /api/elections`
- `GET /api/elections/{id}/candidats`
- `POST /api/upload/photo`
- `POST /api/elections/{id}/candidats`
- `POST /api/elections/{id}/publier`

---

## Résumé ultra court

### OK
- prod login
- CORS prod
- dashboard admin
- création élection
- audit

### KO / fragile
- affichage candidats admin
- parsing réponses API frontend
- feedback d'erreur frontend
- fonctions utilisateurs partiellement simulées
- pas de vrais tests métier

### Mission prioritaire
Réparer la consommation frontend des réponses API, en priorité sur :
- `admin/Candidats.jsx`
