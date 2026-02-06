



Système de Vote Électronique Sécurisé pour Élections Internes

Document d'Architecture Logicielle



Version 1.0
Date : 30 Janvier 2026




Rôle
Nom
Chef de Projet / Développeur Full-Stack
ODOUNLAMI Horace
Développeur Back-End
DOHOU Ercias Audrey
Développeur Front-End
HOUNDETON Jeffry
Développeur Full-Stack
SOGOE Bryan



Contexte et objectifs
Contexte général
Dans de nombreuses institutions universitaires et organisations, les élections internes se déroulent encore majoritairement sur papier. Ce processus traditionnel présente plusieurs limites importantes : lenteur du dépouillement pouvant prendre plusieurs heures voire plusieurs jours, risques d'erreurs humaines dans le comptage des voix, possibilité de doublons ou de fraudes difficiles à détecter, et manque de transparence dans le processus électoral.
Le domaine concerné est celui de la démocratie participative au sein des établissements d'enseignement supérieur et des organisations. L'absence de système numérique fiable entraîne une perte de temps considérable pour les organisateurs, une expérience frustrante pour les votants qui doivent se déplacer physiquement, et un manque de confiance dans les résultats en raison des délais de dépouillement et des risques d'erreurs.
Dans ce contexte, la mise en place d'une plateforme web de vote électronique sécurisé apparaît nécessaire. Un tel système doit permettre de moderniser le processus électoral, de garantir l'intégrité et l'anonymat des votes, et d'offrir des résultats rapides, fiables et transparents à l'ensemble de la communauté. Le projet vise donc à passer d'une logique de vote papier à une plateforme numérique sécurisée, accessible 24h/24 pendant la période électorale et facilement administrable.
Objectifs du système
L'application de vote électronique a pour objectif général de fournir une plateforme web sécurisée, moderne et fiable permettant d'organiser et de conduire des élections internes de manière transparente et efficace. Plus précisément, les objectifs principaux du système sont les suivants :
Garantir l'unicité du vote : mettre en place des mécanismes techniques garantissant qu'un électeur ne puisse voter qu'une seule fois par élection.
Assurer l'anonymat et la confidentialité : séparer complètement l'identité du votant de son choix électoral, afin de garantir le secret du vote.
Renforcer la sécurité : implémenter une authentification forte via OTP envoyé par email institutionnel.
Accélérer le dépouillement : fournir des résultats en temps réel dès la clôture de l'élection.
Améliorer la transparence : offrir un tableau de bord avec exports PDF/CSV pour l'audit.
Simplifier l'organisation : fournir une interface intuitive pour la gestion des élections.
Poser une base évolutive : concevoir le système de manière modulaire et extensible.

Périmètre de la version (MVP)
Cette première version correspond à un MVP (Minimum Viable Product) concentré sur les fonctionnalités essentielles pour organiser et conduire des élections internes sécurisées avec résultats rapides.
Le périmètre inclus :

Application web Laravel (backend) et React (frontend) avec MySQL.
Gestion des utilisateurs (administrateur, électeur, auditeur).
Authentification forte via OTP.
Gestion complète des élections et candidats.
Processus de vote sécurisé avec anonymisation.
Dépouillement automatique et résultats en temps réel.
Tableau de bord avec statistiques et graphiques.
Export PDF et CSV.
Journalisation complète (audit log). Le périmètre exclu du MVP :
Application mobile native.
Technologies avancées (blockchain, chiffrement homomorphe).
Vote pondéré ou préférentiel complexe.
Intégration LDAP/AD/SSO.
Analyse avancée et data mining.
Signature électronique.
Support d'élections multiples simultanées.

Exigences fonctionnelles et non fonctionnelles
Exigences fonctionnelles (vue macro)
Le système est une application web de vote électronique sécurisé. Les fonctionnalités principales sont :
Gestion des élections : Création, configuration et gestion complète des élections avec dates et candidats.

Vote sécurisé et anonyme : Vérification d'unicité, séparation identité/bulletin, anonymisation totale.
Dépouillement automatique : Comptage instantané, résultats en temps réel, statistiques de participation.
Tableau de bord : Consultation statistiques temps réel, export PDF/CSV, consultation audit log.
Gestion des profils : Contrôle d'accès par rôle (admin, électeur, auditeur).

Exigences non fonctionnelles
Performance : Affichage bulletin < 2s, vote confirmé < 3s, dépouillement 5000 votes < 30s.
Sécurité : Authentification OTP, anonymisation complète, chiffrement données sensibles, HTTPS, audit complet.
Disponibilité : 99,9% pendant période électorale, 24h/24, gestion propre des erreurs.
Intégrité : Bulletins non modifiables, aucune perte de vote, contrôles par hachage cryptographique.
Ergonomie : Interface simple et intuitive, responsive (PC/tablette/mobile), processus court.
Auditabilité : Traçage inaltérable de toutes actions sensibles avec horodatage et utilisateur.

Acteurs et vue d'utilisation
Acteurs du système
Administrateur
Responsable de la création, configuration et gestion des élections. Consulte statistiques, clôture élections, accède aux résultats et audit log.

Vérifie la régularité du processus. Consulte logs, vérifie intégrité, génère rapports (sans modifier données).
Scénarios d'usage principaux
Scénario 1 – Création d'une élection
Administrateur se connecte et accède au tableau de bord.
Sélectionne « Créer une nouvelle élection ».
Renseigne : titre, description, dates ouverture/clôture.
Ajoute candidats (nom, photo, programme).
Valide la création (statut « Brouillon » ou « Programmée »).
Publie l'élection pour la rendre visible aux électeurs.
Scénario 2 – Authentification forte
Électeur accède à l'URL et saisit son email institutionnel.
Système vérifie l'email dans la base.
Génère code OTP (6 chiffres) et l'envoie par email.
Électeur reçoit et saisit le code OTP.
Système vérifie validité (correspondance + expiration < 10 min).
Succès → accès liste élections. Échec → message erreur + option renvoyer code.
Scénario 3 – Vote d'un électeur
Électeur authentifié accède aux élections en cours.
Sélectionne une élection (système vérifie qu'il n'a pas déjà voté).
Système affiche bulletin avec candidats (nom, photo, programme).
Électeur sélectionne candidat et clique « Voter ».
Écran de confirmation s'affiche.
Électeur confirme son choix.

Système enregistre bulletin anonymement, marque électeur comme ayant voté, affiche confirmation.
Électeur ne peut plus voter pour cette élection.
Scénario 4 – Dépouillement et résultats
À la clôture, système déclenche dépouillement automatique.
Comptabilise votes par candidat.
Calcule pourcentages et taux de participation.
Stocke résultats de manière sécurisée.
Admin consulte résultats (graphiques + tableaux).
Admin peut exporter PDF/CSV et rendre résultats publics.

User stories
Administrateur :
En tant qu'administrateur, je veux Créer élection avec titre, description, dates..
En tant qu'administrateur, je veux Ajouter candidats avec infos complètes..
En tant qu'administrateur, je veux Publier élection pour la rendre visible..
En tant qu'administrateur, je veux Consulter participation temps réel..
En tant qu'administrateur, je veux Clôturer élection manuellement si besoin..
En tant qu'administrateur, je veux Consulter résultats (graphiques/tableaux)..
En tant qu'administrateur, je veux Exporter résultats PDF/CSV..
En tant qu'administrateur, je veux Consulter journal d'audit complet..
Électeur :
En tant qu'électeur, je veux M'authentifier via OTP sans mémoriser mot de passe..
En tant qu'électeur, je veux Consulter élections en cours disponibles..
En tant qu'électeur, je veux Visualiser infos candidats (photo, programme)..
En tant qu'électeur, je veux Voter en quelques clics..
En tant qu'électeur, je veux Recevoir confirmation de vote..
En tant qu'électeur, je veux Avoir vote totalement anonyme..
En tant qu'électeur, je veux Être empêché de voter deux fois..
Auditeur :
En tant qu'auditeur, je veux Consulter journal d'audit complet..
En tant qu'auditeur, je veux Filtrer logs (date, action, utilisateur)..
En tant qu'auditeur, je veux Exporter logs en CSV..

Architecture globale du système
Vue d'ensemble
Le système est une application web centralisée accessible via navigateur par les trois types d'utilisateurs. L'architecture s'organise autour de cinq grands blocs :
Frontend web (React) : Pages web pour admin (gestion), électeurs (vote), auditeurs (logs).
Backend Laravel : Authentification OTP, règles métier, API REST, orchestration base de données.
Base MySQL : Utilisateurs, rôles, élections, candidats, bulletins anonymisés, participation, logs.
Service email (SMTP) : Envoi codes OTP.
Services futurs : Blockchain, signature électronique, LDAP (hors MVP).

Principes d'architecture
Style architectural
Architecture monolithique : une application Laravel backend regroupant toutes fonctionnalités (authentification, élections, vote, audit). Code organisé en couches MVC. Frontend React = SPA consommant API REST du backend. Adapté niveau licence, simplifie compréhension et déploiement.
Types de communication
Échanges HTTP/HTTPS : React envoie requêtes HTTP au backend Laravel, qui renvoie JSON ou codes statut. Pas de communication asynchrone dans MVP. Transactions pour opérations critiques (vote, dépouillement).
Principes structurants
Séparation présentation/métier/persistance : Frontend React (UI), Backend Laravel (logique), Modèles Eloquent (persistance).
API REST structurée : Endpoints sur ressources métier (/api/elections, /api/votes,
/api/results, /api/audit).
Gestion rôles/droits : Admin (gestion complète), Électeurs (vote uniquement), Auditeurs (lecture logs). Contrôle frontend et backend.
Sécurité by design : OTP obligatoire, anonymisation garantie, chiffrement données sensibles, audit complet.

Conception des modules
Vue d'ensemble des modules
La solution s'organise en cinq modules fonctionnels principaux :

Utilisateurs et authentification : Gestion comptes, authentification OTP, contrôle droits par rôle.
Gestion des élections : Création, configuration, gestion cycle de vie élections et candidats.
Vote : Vérification autorisation, unicité, enregistrement bulletin anonyme, confirmation.
Dépouillement et résultats : Comptage automatique, calcul statistiques, génération graphiques/tableaux.
Audit et traçabilité : Enregistrement inaltérable actions sensibles, consultation pour audit.

Description détaillée des modules
Module « Utilisateurs et authentification »
Rôle et responsabilité
Gestion des comptes (admin, électeurs, auditeurs) et contrôle droits. Garantit que chaque action sensible est effectuée par utilisateur authentifié et autorisé. Protège intégrité processus électoral.
Fonctionnalités
Authentification OTP : génération code 6 chiffres, envoi email, vérification (validité + expiration < 10min), session sécurisée.
Gestion comptes : création (email, rôle), consultation, mise à jour, désactivation/réactivation.
Gestion rôles : association rôle (Admin/Électeur/Auditeur), contrôle d'accès.
Déconnexion : invalidation session.
Entités du module
Entité Utilisateur

Attribut
Type
Description
Contraintes
id
UUID
Identifiant unique
PK, unique, obligatoire
email
Texte(255)
Email institutionnel
Obligatoire, unique, format email
nom
Texte(255)
Nom complet
Obligatoire
role_id
UUID
Référence rôle
Obligatoire, FK
statut
Enum
actif/inactif
Défaut actif
created_at
DateTime
Date création
Auto
updated_at
DateTime
Date MAJ
Auto

Entité Rôle

Attribut
Type
Description
Contraintes
id
UUID
Identifiant unique
PK
code
Texte(50)
Code (ADMIN/VOTER/AUDITOR)
Obligatoire, unique
nom
Texte(100)
Libellé lisible
Obligatoire
description
Texte
Description rôle
Optionnel
created_at
DateTime
Date création
Auto
updated_at
DateTime
Date MAJ
Auto



Entité CodeOTP

Attribut
Type
Description
Contraintes
id
UUID
Identifiant unique
PK
email
Texte(255)
Email destination
Obligatoire
code
Texte(6)
Code 6 chiffres
Obligatoire
expire_at
DateTime
Expiration (10min)
Obligatoire
utilisé
Boolean
Code déjà utilisé
Défaut false
created_at
DateTime
Date création
Auto


Interfaces exposées
POST /api/auth/request-otp : demande envoi OTP
POST /api/auth/verify-otp : vérification OTP + création session
POST /api/auth/logout : déconnexion
GET /api/users : liste utilisateurs (admin)
POST /api/users : création utilisateur (admin)
PUT /api/users/{id} : MAJ utilisateur (admin)
Flux principaux
Authentification OTP : Électeur saisit email → système génère OTP → envoi email → électeur saisit code → vérification validité → succès = session créée.

Dépendances
Utilisé par tous modules pour vérifier identité, contrôler droits, enregistrer auteur actions dans audit log.
Règles métier
OTP utilisable une seule fois, expire après 10 minutes.
Un utilisateur = un seul rôle actif.
Seuls admins créent/modifient comptes.
Électeurs inactifs ne peuvent s'authentifier ni voter.

Module « Gestion des élections »
Rôle et responsabilité
Création, configuration et gestion du cycle de vie des élections. Permet admin de définir paramètres (titre, dates, candidats), publier/clôturer élections. Garantit cohérence données électorales.
Fonctionnalités
Création élection (titre, description, dates ouverture/clôture).
Gestion candidats (ajout, MAJ, suppression avec nom, photo, programme).
Changement statut élection (brouillon, publiée, en cours, clôturée).
Consultation liste élections avec filtres.
Validation cohérence dates (ouverture < clôture).
Entités du module
Entité Élection

Attribut
Type
Description
Contraintes
id
UUID
Identifiant unique
PK
titre
Texte(255)
Titre élection
Obligatoire
description
Texte
Description détaillée
Optionnel
date_ouverture
DateTime
Début vote
Obligatoire
date_cloture
DateTime
Fin vote
Obligatoire, > ouverture
statut
Enum
Brouillon/Publiée/EnCours/Clôturée
Défaut Brouillon
created_by
UUID
Admin créateur
FK Utilisateur
created_at
DateTime
Date création
Auto
updated_at
DateTime
Date MAJ
Auto

Entité Candidat

Attribut
Type
Description
Contraintes
id
UUID
Identifiant unique
PK
election_id
UUID
Référence élection
FK, obligatoire
nom
Texte(255)
Nom complet
Obligatoire
photo_url
Texte(500)
URL photo
Optionnel
programme
Texte
Programme/présentation
Optionnel




ordre_affichage
Integer
Ordre liste
Optionnel
created_at
DateTime
Date création
Auto
updated_at
DateTime
Date MAJ
Auto


Interfaces exposées
GET /api/elections : liste élections
POST /api/elections : création élection (admin)
PUT /api/elections/{id} : MAJ élection (admin)
POST /api/elections/{id}/publish : publier élection (admin)
POST /api/elections/{id}/close : clôturer élection (admin)
GET /api/elections/{id}/candidates : liste candidats
POST /api/elections/{id}/candidates : ajout candidat (admin)
PUT /api/candidates/{id} : MAJ candidat (admin)
DELETE /api/candidates/{id} : suppression candidat (admin)
Flux principaux
Création élection : Admin remplit formulaire (titre, dates, desc) → validation cohérence dates →
sauvegarde statut Brouillon → ajout candidats → publication pour rendre visible électeurs.

Dépendances
Dépend de : module Utilisateurs (vérif droits admin). Fournit données à : module Vote (élections disponibles, candidats), module Dépouillement (élections à dépouiller).
Règles métier
Date clôture obligatoirement > date ouverture.
Élection publiée ne peut être supprimée (seulement clôturée).
Candidats modifiables uniquement si élection pas encore ouverte.
Minimum 2 candidats pour publier élection.
Seuls admins créent/modifient élections.

Module « Vote »
Rôle et responsabilité
Cœur métier pour électeurs. Vérifie autorisation voter, unicité vote, enregistre bulletin totalement anonyme, confirme enregistrement. Garantit un électeur = un vote par élection, anonymat complet.
Fonctionnalités
Vérification électeur autorisé (authentifié, actif).
Vérification unicité (électeur n'a pas déjà voté).
Affichage bulletin (liste candidats avec infos).
Enregistrement vote anonyme (séparation identité/bulletin).
Marquage électeur comme ayant voté (sans lien bulletin).
Confirmation vote à l'électeur.
Protection contre vote multiple.
Entités du module
Entité Bulletin (Vote anonyme)

Attribut
Type
Description
Contraintes
id
UUID
Identifiant unique bulletin
PK
election_id
UUID
Référence élection
FK, obligatoire
candidat_id
UUID
Candidat choisi
FK, obligatoire
hash_verification
Texte(64)
Hash intégrité
Obligatoire
created_at
DateTime
Date/heure vote
Auto, immuable

Note : AUCUNE référence à l'utilisateur. Anonymat total garanti par conception.

Entité Participation (Qui a voté, sans lien bulletin)

Attribut
Type
Description
Contraintes
id
UUID
Identifiant unique
PK
election_id
UUID
Référence élection
FK, obligatoire
user_id
UUID
Électeur ayant voté
FK, obligatoire
a_vote
Boolean
Indicateur vote
Défaut true
created_at
DateTime
Date/heure participation
Auto

Contrainte unique : (election_id, user_id) pour empêcher votes multiples.

Interfaces exposées
GET /api/elections/{id}/ballot : récupération bulletin (vérif pas déjà voté)
POST /api/elections/{id}/vote : soumission vote
GET /api/elections/{id}/has-voted : vérification si électeur a voté
Flux principaux
Processus de vote : Électeur sélectionne élection → système vérifie dans Participation (pas déjà voté) → affiche bulletin candidats → électeur choisit → confirmation → TRANSACTION : (1) création Bulletin anonyme (election_id + candidat_id + hash), (2) création Participation (election_id + user_id) → commit → confirmation électeur. En cas erreur : rollback complet.
Dépendances
Dépend de : module Utilisateurs (identité électeur), module Gestion Élections (élections disponibles, candidats). Fournit à : module Dépouillement (bulletins à compter).
Règles métier
Un électeur vote max 1 fois par élection (contrainte unique Participation).
Vote possible uniquement si élection statut EnCours.
Anonymat absolu : AUCUN lien Bulletin ↔ Utilisateur.
Bulletin immuable après création (hash vérification intégrité).
Transaction atomique : succès complet ou échec complet (pas état partiel).

Module « Dépouillement et résultats »
Rôle et responsabilité
Comptage automatique votes à clôture, calcul statistiques (pourcentages, participation), génération résultats visuels (graphiques, tableaux). Garantit résultats précis, rapides, transparents.
Fonctionnalités
Déclenchement automatique dépouillement à date_cloture.
Comptage votes par candidat (requête sur Bulletin).
Calcul statistiques : total votes, votes par candidat, pourcentages, taux participation.
Stockage résultats sécurisés.
Génération graphiques (camembert, barres).
Export PDF et CSV résultats.
Publication résultats (si admin décide).
Entités du module
Entité Résultat

Attribut
Type
Description
Contraintes
id
UUID
Identifiant unique
PK
election_id
UUID
Référence élection
FK, unique
total_votes
Integer
Nombre total votes
Obligatoire, >= 0
total_electeurs
Integer
Nombre électeurs potentiels
Optionnel
taux_participation
Decimal(5,2)
% participation
Calculé
resultats_json
JSON
Détails par candidat
Obligatoire
publie
Boolean
Résultats publics
Défaut false
created_at
DateTime
Date dépouillement
Auto, immuable
updated_at
DateTime
Date MAJ
Auto

resultats_json contient : [{candidat_id, nom, nb_votes, pourcentage}, ...]


Interfaces exposées
GET /api/elections/{id}/results : consultation résultats (admin ou si publié)
POST /api/elections/{id}/count : déclencher dépouillement manuel (admin)
POST /api/elections/{id}/publish-results : publier résultats (admin)
GET /api/elections/{id}/results/export/pdf : export PDF

GET /api/elections/{id}/results/export/csv : export CSV
GET /api/elections/{id}/statistics : statistiques participation temps réel
Flux principaux
Dépouillement automatique : À date_cloture, job planifié s'exécute → compte votes (GROUP BY candidat_id) → calcule total, pourcentages, taux participation → génère resultats_json → crée/MAJ entité Résultat → résultats disponibles dashboard admin.

Dépendances
Dépend de : module Vote (bulletins à compter), module Gestion Élections (infos élection, candidats). Utilisé par : module Audit (traçage consultation résultats).
Règles métier
Dépouillement uniquement si élection statut Clôturée.
Résultats immuables après génération (sauf republication si erreur détectée).
Accès résultats : admin toujours, autres uniquement si publie=true.
Exports (PDF/CSV) tracés dans audit log.
Calculs doivent être vérifiables : total votes = somme votes candidats.

Module « Audit et traçabilité »
Rôle et responsabilité
Enregistrement inaltérable toutes actions sensibles (création élection, vote, consultation résultats, export). Permet vérification régularité processus, détection anomalies. Garantit traçabilité complète, transparence.
Fonctionnalités
Enregistrement automatique actions sensibles.
Stockage : horodatage précis, utilisateur, type action, détails, résultat (succès/échec).
Consultation logs par admin/auditeur.
Filtrage logs (date, utilisateur, type action, résultat).
Export logs CSV.
Protection logs contre modification/suppression.
Entités du module
Entité AuditLog

Attribut
Type
Description
Contraintes
id
UUID
Identifiant unique
PK
user_id
UUID
Utilisateur (si applicable)
FK, nullable
action_type
Enum
Type (CREATE_ELECTION, VOTE, etc.)
Obligatoire
description
Texte
Description action
Obligatoire
details_json
JSON
Détails techniques
Optionnel
ip_address
Texte(45)
IP origine
Optionnel
resultat
Enum
SUCCESS/FAILURE
Obligatoire
created_at
DateTime
Horodatage précis
Auto, immuable, index

Table immuable : INSERT only, pas UPDATE/DELETE.


Interfaces exposées
GET /api/audit/logs : consultation logs (admin/auditeur)
GET /api/audit/logs/export/csv : export CSV (admin/auditeur)
GET /api/audit/logs/filter : filtrage avancé (admin/auditeur)

Flux principaux
Enregistrement action : À chaque action sensible (vote, création élection, export...) → middleware Laravel intercepte → extrait infos (user, action, détails, IP) → INSERT AuditLog → action continue. Consultation : Admin/auditeur filtre logs → affichage tableau → export CSV si besoin.
Dépendances
S'accroche à TOUS modules pour tracer actions. Dépend de : module Utilisateurs (identité auteur). Indépendant fonctionnellement (consultation audit ne modifie pas autres modules).
Règles métier
TOUTE action sensible DOIT être tracée (politique zéro exception).
Logs immuables : aucune modification/suppression après création.
Horodatage précis (timestamp avec millisecondes).
Anonymisation si vote : action_type=VOTE mais details_json ne contient PAS choix candidat.
Rétention minimale : 5 ans (conformité réglementaire potentielle).

Vue globale du modèle d'information
Inventaire des entités par module

Module
Entités principales gérées
Utilisateurs et authentification
Utilisateur, Rôle, CodeOTP
Gestion des élections
Élection, Candidat
Vote
Bulletin, Participation
Dépouillement et résultats
Résultat
Audit et traçabilité
AuditLog


Relations entre entités
Relations principales du modèle de données :
Utilisateur (1) ←→ (N) CodeOTP : un utilisateur peut avoir plusieurs codes OTP générés.
Rôle (1) ←→ (N) Utilisateur : un rôle est attribué à plusieurs utilisateurs.
Élection (1) ←→ (N) Candidat : une élection contient plusieurs candidats.
Élection (1) ←→ (N) Bulletin : une élection reçoit plusieurs bulletins (votes anonymes).
Candidat (1) ←→ (N) Bulletin : un candidat reçoit plusieurs votes.
Élection (1) ←→ (N) Participation : une élection a plusieurs participations (qui a voté).
Utilisateur (1) ←→ (N) Participation : un utilisateur peut participer à plusieurs élections.
Élection (1) ←→ (1) Résultat : une élection a un résultat unique après dépouillement.
Utilisateur (1) ←→ (N) AuditLog : un utilisateur génère plusieurs entrées d'audit.
SÉPARATION CRITIQUE : AUCUNE relation directe Bulletin ↔ Utilisateur (anonymat garanti).

Note : Le schéma conceptuel complet (MCD) est fourni dans le document Diagrammes.pdf annexé.

Architecture applicative et technique
Couches logicielles
L'application suit une architecture en couches claire :

Couche Présentation (Frontend React) : Composants React, gestion états (Redux/Context), appels API, affichage UI responsive. Rôle : interaction utilisateur sans logique métier.
Couche Application (Controllers Laravel) : Controllers, Middleware, FormRequest validation. Orchestre cas d'usage (créer élection, voter, dépouiller). Rôle : coordination entre présentation, domaine, infrastructure.
Couche Domaine (Models Laravel) : Models Eloquent (Utilisateur, Élection, Bulletin...), règles métier, validations domaine. Rôle : représentation concepts métier, garantie cohérence.
Couche Infrastructure (Database, Services) : Base MySQL, Migrations, Seeders, Services externes (SMTP). Rôle : persistance données, intégrations techniques.
Technologies et frameworks
Frontend
React 18+ : construction interface utilisateur composants.
React Router : navigation SPA.
Axios : communication API REST.
Tailwind CSS : styling responsive moderne.
Chart.js ou Recharts : visualisation résultats graphiques.
React Hook Form : gestion formulaires validation côté client.
Backend
PHP 8.2+ : langage serveur.
Laravel 10+ : framework structurant (MVC, routing, ORM Eloquent, migrations).
Laravel Sanctum : authentification API tokens (sessions sécurisées).
Laravel Queue : gestion jobs asynchrones (envoi emails, dépouillement).
Composer : gestion dépendances PHP.
Base de données
MySQL 8.0+ : SGBD relationnel.
Migrations Laravel : versionnement schéma.
Eloquent ORM : mapping objet-relationnel.
Index optimisés : performance requêtes critiques (recherche élections, comptage votes).

Communication
API	REST	:	endpoints	JSON	(GET,	POST,	PUT,	DELETE).	HTTPS	:	chiffrement communications. CORS configuré : autoriser frontend React accéder backend Laravel.
Services externes
Serveur SMTP (ou service cloud type SendGrid, Mailgun) : envoi OTP emails.
Stockage fichiers : système fichiers serveur pour photos candidats (ou S3 en évolution).

Sécurité et qualités techniques
Sécurité
Authentification et autorisation
Authentification forte : OTP 6 chiffres envoyé email, validité 10 min.
Sessions sécurisées : Laravel Sanctum tokens, expiration configurable.
Contrôle accès : Middleware Laravel vérifie rôles avant accès endpoints sensibles.
Protection CSRF : tokens CSRF pour formulaires.
Rate limiting : limitation tentatives authentification (anti brute-force).
Protection des données
HTTPS obligatoire : chiffrement TLS 1.3 communications.
Chiffrement base données : données sensibles (si nécessaire) chiffrées au repos.
Anonymisation votes : séparation TOTALE Bulletin ↔ Utilisateur par conception.
Hachage intégrité : bulletins ont hash vérification (détection altération).
Pas de stockage mots de passe : authentification OTP uniquement (pas password DB).
Journalisation et audit
Audit log complet : TOUTE action sensible tracée (immuable).
Horodatage précis : timestamps millisecondes.
IP tracking : enregistrement adresse IP actions critiques.
Protection logs : table INSERT-only (pas UPDATE/DELETE).
Rétention 5 ans : conformité réglementaire.

Autres qualités techniques
Performance
Objectifs : bulletin < 2s, vote < 3s, dépouillement 5000 votes < 30s.
Pagination : listes (élections, candidats, logs) paginées (éviter surcharge).
Index base : index sur champs recherchés (election_id, user_id, created_at).
Eager loading : relations Eloquent chargées efficacement (éviter N+1 queries).
Cache : résultats statiques (liste rôles) mis en cache Redis (évolution).
Robustesse
Validation complète : FormRequest Laravel valide TOUTES entrées utilisateur.
Transactions : opérations critiques (vote) dans transactions DB atomiques.
Gestion erreurs : try-catch, messages clairs utilisateur, logs détaillés développeurs.
Timeouts : requêtes API timeout configuré (éviter blocages).
Idempotence : certaines opérations (vote) vérifiées idempotentes (pas double effet).

Observabilité
Logs applicatifs : Laravel logs (erreurs, warnings, infos) dans storage/logs.
Monitoring basique : logs consultables, alertes sur erreurs critiques (optionnel).
Métriques : nombre requêtes, temps réponse moyen (évolution avec monitoring tools).

Déploiement et environnements
Environnements prévus
Développement (local)
Machines développeurs. Laravel en mode debug. Base MySQL locale ou Docker. Affichage erreurs détaillé. Hot reload frontend.
Test/Démonstration
Serveur partagé (école ou hébergeur). HTTPS configuré. Jeu données test réaliste. Tests intégration. Démos encadrants/administration.
Production (optionnel MVP)
Environnement réel si déploiement officiel. HTTPS strict. Mode production Laravel (cache, optimisations). Sauvegardes automatiques DB. Monitoring logs/erreurs.
Vue de déploiement
Architecture déploiement simplifiée adaptée projet académique :

Serveur web (Apache/Nginx) : Héberge application Laravel + assets React buildés. Gère requêtes HTTP/HTTPS. Reverse proxy vers application.
Serveur applicatif (PHP-FPM) : Exécute code Laravel backend. Traite requêtes API. Gère logique métier.
Base de données MySQL : Instance dédiée. Accessible uniquement serveur applicatif (réseau interne). Sauvegardes régulières (quotidiennes minimum).
Service email : SMTP configuré Laravel (.env). Envoi OTP. Peut être service cloud (SendGrid) ou serveur local.
Stockage fichiers : Photos candidats stockées : storage/app/public Laravel (lien symbolique public/storage). Évolution : S3 ou équivalent.
Configuration réseau typique :
Utilisateurs → Internet → HTTPS (443) → Serveur web.
Serveur web → Serveur applicatif (réseau interne).
Serveur applicatif → Base MySQL (réseau interne, pas exposition publique).
Serveur applicatif → Service SMTP (Internet ou réseau interne).

Organisation du développement et gestion du code
Gestion du code source
Code géré avec Git, hébergé sur plateforme (GitHub/GitLab). Structure dépôt :

Backend Laravel : app/, routes/, database/migrations/, database/seeders/, config/,
.env.example.
Frontend React : src/ (composants, services, styles), public/, package.json.
Documentation : docs/ (architecture, guide installation, manuel utilisateur).
Configuration : .env.example (template config), .gitignore (exclure .env, node_modules, vendor).
Stratégie de branches et contributions
Branches principales
main : branche stable référence. Code testé, validé. Utilisée livrables (démos, soutenance).
develop : branche intégration. Features validées fusionnées ici avant main.
Branches de fonctionnalité (feature branches)
Pour chaque nouvelle fonctionnalité/module, création branche dédiée depuis develop. Exemples
: feature/auth-otp, feature/gestion-elections, feature/vote-anonyme, feature/dashboard-admin. Chaque étudiant/groupe travaille sur sa feature branch, isolant développements.
Processus de contribution (Pull Requests)
Feature terminée → tests locaux → création Pull Request (PR) vers develop.
Revue code : autre membre équipe (ou encadrant) vérifie conformité cahier charges, conventions code, sécurité basique.
Validation → fusion dans develop.
Périodiquement : develop fusionnée dans main (versions stables démo).
Conventions de code
PHP : PSR-12 (standards Laravel).
JavaScript : ESLint + Prettier (config standardisée).
Commits : messages clairs descriptifs (ex: 'feat: ajout authentification OTP', 'fix: correction bug vote double').
Tests : unitaires (PHPUnit backend, Jest frontend) avant fusion PR.

Risques, limites et évolutions
Risques principaux
Sécurité votes
Risque : attaque sophistiquée compromettant anonymat ou intégrité. Mitigation : audit code sécurité, tests pénétration, revue architecture séparation Bulletin/Utilisateur.
Indisponibilité pendant élection
Risque : crash serveur, surcharge. Mitigation : tests charge préalables, monitoring, plan secours (backup serveur).
Dépendance service email
Risque : service SMTP défaillant → OTP non reçus. Mitigation : service email fiable (SLA élevé), fallback service alternatif.
Complexité technique équipe
Risque : niveau licence, certaines techno complexes. Mitigation : formation préalable, documentation claire, support encadrant.
Deadlines projet
Risque : retards fonctionnalités critiques. Mitigation : planification réaliste (7 semaines), priorisation MVP strict, revues hebdomadaires.
Limites connues de la version actuelle
Pas application mobile native (web responsive uniquement).
Pas chiffrement homomorphe ou blockchain (complexité excessive MVP).
Support une seule élection active simultanément (architecture permet évolution facile).
Pas intégration annuaires externes (LDAP/AD) - gestion manuelle utilisateurs.
Statistiques basiques uniquement (pas analytics avancé comportements vote).
Export PDF/CSV simples (pas personnalisation templates avancée).
Pas signature électronique bulletins (ajout futur possible).

Pistes d'évolution
Court terme (post-MVP)
Support élections multiples simultanées. Application mobile React Native. Amélioration dashboard (graphiques temps réel WebSocket). Notifications push/email automatiques.
Moyen terme
Intégration LDAP/AD authentification entreprise. Vote pondéré/préférentiel. Analytics avancé (taux participation segments, corrélations). Internationalisation (i18n) multilingue.

Long terme
Intégration blockchain traçabilité inaltérable votes. Chiffrement homomorphe (vote chiffré bout en bout). Signature électronique qualifiée. Audit automatisé IA détection anomalies. Fédération identités (SSO multi-organismes).

Annexes
Diagrammes UML
Les diagrammes UML complets (cas d'utilisation, classes, séquence, MCD, MLD) sont disponibles dans le document séparé « Diagrammes.pdf » fourni avec cette architecture.
Diagrammes inclus :

Diagramme de cas d'utilisation : vue complète acteurs et fonctionnalités.
Modèle Conceptuel de Données (MCD) : entités et relations.
Modèle Logique de Données (MLD) : schéma relationnel détaillé.
Diagramme de classes : structure orientée objet système.
Diagrammes de séquence : flux authentification OTP, vote électronique, consultation résultats.
Spécifications API (exemple)
Documentation API REST complète sera générée via Swagger/OpenAPI. Exemple endpoint :


POST /api/auth/verify-otp
Description : Vérification code OTP et création session Request Body :
{
"email": "etudiant@universite.bj", "code": "123456"
}
Response 200 OK :
{
"success": true,
"token": "eyJ0eXAiOiJKV1...", "user": {
"id": "uuid",
"email": "etudiant@universite.bj", "nom": "Nom Complet",
"role": "VOTER"
}
}
Response 401 Unauthorized :
{
"success": false,
"message": "Code OTP invalide ou expiré"
}

Guide d'installation rapide
Cloner dépôt : git clone [url-repo]

Backend : cd backend && composer install && cp .env.example .env && php artisan key:generate
Database : créer base MySQL, configurer .env, php artisan migrate --seed
Frontend : cd frontend && npm install && npm run build
Lancer : php artisan serve (backend) + npm run dev (frontend dev) ou servir build production
Accéder : http://localhost:3000 (frontend) → http://localhost:8000/api (backend)

Glossaire

Terme
Définition
OTP
One-Time Password - Code usage unique temporaire
MVP
Minimum Viable Product - Version minimale fonctionnelle
API REST
Interface programmation basée HTTP/JSON
Anonymisation
Séparation totale identité votant / bulletin
Audit Log
Journal traçabilité actions système
JWT
JSON Web Token - Standard authentification API
HTTPS
HTTP Secure - Protocole chiffré TLS/SSL
SMTP
Simple Mail Transfer Protocol - Protocole envoi emails


FIN DU DOCUMENT

Pour toute question ou clarification sur cette architecture, veuillez contacter l'équipe projet.

Système de Vote Électronique Sécurisé
pour Élections Internes

Document d'Architecture Logicielle
Version 1.1 - Workflow Authentification par Mot de Passe
Date : 04 Février 2026

Rôle
Nom
Chef de Projet / Développeur Full-Stack
ODOUNLAMI Horace
Développeur Back-End
DOHOU Ercias Audrey
Développeur Front-End
HOUNDETON Jeffry


1. Contexte et objectifs
1.1 Contexte général
Dans de nombreuses institutions universitaires et organisations, les élections internes se déroulent encore majoritairement sur papier. Ce processus traditionnel présente plusieurs limites importantes : lenteur du dépouillement pouvant prendre plusieurs heures voire plusieurs jours, risques d'erreurs humaines dans le comptage des voix, possibilité de doublons ou de fraudes difficiles à détecter, et manque de transparence dans le processus électoral.
1.2 Objectifs du système
L'application de vote électronique a pour objectif général de fournir une plateforme web sécurisée, moderne et fiable permettant d'organiser et de conduire des élections internes de manière transparente et efficace. Plus précisément, les objectifs principaux du système sont les suivants :
Garantir l'unicité du vote : mettre en place des mécanismes techniques garantissant qu'un électeur ne puisse voter qu'une seule fois par élection.
Assurer l'anonymat et la confidentialité : séparer complètement l'identité du votant de son choix électoral.
Renforcer la sécurité : implémenter une authentification par email et mot de passe avec confirmation d'inscription par lien email (expire 48h).
Accélérer le dépouillement : fournir des résultats en temps réel dès la clôture de l'élection.
Améliorer la transparence : offrir un tableau de bord avec exports PDF/CSV pour l'audit.

5. Conception des modules
5.2.1 Module « Utilisateurs et authentification »
1. Rôle et responsabilité
Gestion des comptes utilisateurs et authentification sécurisée par email et mot de passe. Ce module garantit que seuls les utilisateurs ayant confirmé leur inscription peuvent accéder au système. Il gère le workflow complet : création de compte par admin avec génération de mot de passe aléatoire → envoi email de confirmation avec lien unique (48h) → activation du compte après clic sur le lien → envoi des identifiants (email + mot de passe) → authentification classique.
2. Fonctionnalités principales
Création de compte par administrateur avec génération automatique d'un mot de passe aléatoire sécurisé (12 caractères).
Envoi email de confirmation avec lien unique (token 64 caractères, expiration 48h).
Confirmation d'inscription par l'utilisateur via clic sur le lien (changement statut Inactif → Actif).
Envoi automatique email avec identifiants de connexion (email + mot de passe) après confirmation.
Authentification classique email + mot de passe (vérification hash bcrypt).
Stockage temporaire sécurisé du mot de passe en clair (table passwords_temporary, suppression automatique après envoi).
Gestion des rôles (Admin, Électeur, Auditeur) et contrôle d'accès par middleware.
3. Entités du module avec relations
Entité User (Utilisateur)
Attribut
Type
Description
Contraintes
id
UUID
Identifiant unique
PK, unique
email
VARCHAR(255)
Email institutionnel
Obligatoire, unique, index
nom
VARCHAR(255)
Nom complet
Obligatoire
password_hash
VARCHAR(255)
Hash bcrypt mot de passe
Obligatoire (bcrypt cost=10)
role_id
UUID
Référence rôle
FK → roles.id
statut
ENUM
Inactif / Actif
Défaut Inactif
created_at
TIMESTAMP
Date création
Auto
updated_at
TIMESTAMP
Date MAJ
Auto


Entité TokenConfirmation
Attribut
Type
Description
Contraintes
id
UUID
Identifiant unique
PK
user_id
UUID
Référence utilisateur
FK → users.id, UNIQUE
token
VARCHAR(64)
Token unique
Obligatoire, unique, index
expire_at
TIMESTAMP
Expiration (+48h)
Obligatoire


Entité PasswordTemporary (Stockage temporaire)
Attribut
Type
Description
Contraintes
id
UUID
Identifiant unique
PK
user_id
UUID
Référence utilisateur
FK → users.id, UNIQUE
password_plain
TEXT
Mot de passe CLAIR
Obligatoire (temporaire)
expire_at
TIMESTAMP
Expiration (+48h)
Obligatoire


Relations entre entités :
users.role_id → roles.id (Many-to-One)
tokens_confirmation.user_id → users.id (One-to-One, UNIQUE)
passwords_temporary.user_id → users.id (One-to-One, UNIQUE)
4. Workflow complet (4 étapes)
Étape 1 : Création utilisateur par admin
Admin remplit formulaire (email, nom, rôle) → Système génère password aléatoire 12 caractères → TRANSACTION : (1) User (password_hash=bcrypt, statut=Inactif), (2) TokenConfirmation (token 64 char, expire 48h), (3) PasswordTemporary (password_plain clair, expire 48h) → Email 1 : Lien confirmation SEULEMENT.
Étape 2 : Confirmation par utilisateur
User clique lien → Vérif token (existe + non expiré) → Statut Inactif → Actif → Récupération password depuis PasswordTemporary → Email 2 : email + password → SUPPRESSION immédiate TokenConfirmation + PasswordTemporary.
Étape 3 : Première connexion
User saisit email + password → Vérif Hash::check(password, password_hash) → Génération token JWT Sanctum → Redirection selon rôle.
Étape 4 : Connexions suivantes
Email + password → Vérif bcrypt → Token Sanctum → Session.
5. Interfaces API
POST /api/auth/login : Connexion (email + password)
POST /api/auth/logout : Déconnexion
GET /api/auth/confirm/{token} : Confirmation inscription
POST /api/users (admin) : Création user
GET /api/users (admin) : Liste users
6. Règles métier critiques
Connexion possible UNIQUEMENT si statut = Actif
Lien confirmation expire 48h (expire_at vérifié)
Password plain stocké UNIQUEMENT dans passwords_temporary, SUPPRIMÉ après envoi email
Passwords générés : 12 caractères (majuscules, minuscules, chiffres, spéciaux)
TOUS passwords hashés bcrypt (cost=10, salt auto)
JAMAIS password clair dans table users
Rate limiting : 5 tentatives max / 15 min / IP
Contraintes UNIQUE sur user_id (tokens_confirmation + passwords_temporary)
Cron job nettoie tokens/passwords expirés toutes les heures

8. Sécurité et qualités techniques
8.1 Sécurité de l'authentification
Hachage bcrypt des mots de passe
Tous les mots de passe sont hachés avec bcrypt (cost=10). Bcrypt est un algorithme cryptographique à sens unique avec salt automatique, résistant au brute-force. Laravel utilise Hash::make() pour créer le hash et Hash::check() pour vérifier. Le password clair n'est JAMAIS stocké dans users.
Stockage temporaire sécurisé
Le password clair est temporairement stocké dans passwords_temporary UNIQUEMENT pour l'envoi par email. Durée de vie max : 48h. SUPPRESSION immédiate après envoi email identifiants. Cron job nettoie les entrées expirées toutes les heures. Compromis sécurité/fonctionnalité : password clair existe temporairement dans table dédiée séparée.
Sessions sécurisées (Laravel Sanctum)
Après authentification : token JWT généré via Sanctum. Token authentifie toutes requêtes API suivantes. Durée vie configurable (défaut 2h). Révocable à tout moment (déconnexion). Transmission : header Authorization: Bearer TOKEN.
Protections contre attaques
Rate limiting : 5 tentatives max / 15 min / IP
HTTPS obligatoire : TLS 1.3
CSRF protection : tokens Laravel auto
SQL Injection : Eloquent ORM protège
XSS : React échappe données auto

12. Annexes
12.1 Schéma base de données
Tables principales du module authentification :
users : Compte utilisateur (password_hash bcrypt, statut Inactif/Actif)
roles : Rôles système (ADMIN, VOTER, AUDITOR)
tokens_confirmation : Tokens confirmation inscription (expire 48h, user_id UNIQUE)
passwords_temporary : Stockage temporaire passwords clair (expire 48h, user_id UNIQUE, suppression auto)
12.2 Avantages du workflow
Sécurité : Hash bcrypt + stockage temporaire séparé + suppression automatique
UX : Workflow standard email + password familier
Confirmation : Double email (confirmation + identifiants) garantit réception
Autonomie : Pas dépendance SMTP pour chaque connexion
Traçabilité : Statut Inactif/Actif permet audit
