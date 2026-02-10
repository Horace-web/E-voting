<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Election;
use App\Models\Participation;
use App\Models\Vote;
use App\Http\Requests\StoreElectionRequest;
use App\Http\Requests\UpdateElectionRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ElectionController extends Controller
{
    /**
     * Lister les élections
     * - ADMIN : toutes les élections
     * - VOTER : élections EN COURS uniquement
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Si admin : toutes les élections
        if ($user->role->code === 'ADMIN') {
            $elections = Election::with('candidats', 'createur')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $elections->map(function ($election) {
                    return [
                        'id' => $election->id,
                        'titre' => $election->titre,
                        'description' => $election->description,
                        'date_debut' => $election->date_debut,
                        'date_fin' => $election->date_fin,
                        'statut' => $election->statut,
                        'nb_candidats' => $election->candidats->count(),
                        'created_by' => $election->createur->nom,
                        'created_at' => $election->created_at,
                    ];
                })
            ]);
        }

        // Si électeur : élections EN COURS uniquement
        $elections = Election::where('statut', 'EnCours')
            ->where('date_debut', '<=', now())
            ->where('date_fin', '>=', now())
            ->with('candidats')
            ->get()
            ->map(function ($election) use ($user) {
                // Vérifier si l'utilisateur a déjà voté
                $aVote = Participation::where('user_id', $user->id)
                    ->where('election_id', $election->id)
                    ->exists();

                return [
                    'id' => $election->id,
                    'titre' => $election->titre,
                    'description' => $election->description,
                    'date_debut' => $election->date_debut,
                    'date_fin' => $election->date_fin,
                    'nb_candidats' => $election->candidats->count(),
                    'a_vote' => $aVote, // ✅ Indication si déjà voté
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $elections
        ]);
    }

    /**
     * Créer une élection (ADMIN uniquement)
     */
    public function store(StoreElectionRequest $request)
    {
        // Validation supplémentaire : date_fin > date_debut
        if (Carbon::parse($request->date_fin)->lte(Carbon::parse($request->date_debut))) {
            return response()->json([
                'success' => false,
                'message' => 'La date de clôture doit être après la date d\'ouverture'
            ], 422);
        }

        $election = Election::create([
            'titre' => $request->titre,
            'description' => $request->description,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'statut' => 'Brouillon', // ✅ Statut par défaut
             'created_by' => optional(\Illuminate\Support\Facades\Auth::user())->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Élection créée avec succès',
            'data' => [
                'id' => $election->id,
                'titre' => $election->titre,
                'description' => $election->description,
                'date_debut' => $election->date_debut,
                'date_fin' => $election->date_fin,
                'statut' => $election->statut,
                'created_at' => $election->created_at,
            ]
        ], 201);
    }

    /**
     * Afficher une élection
     */
    public function show($id)
    {
        $election = Election::with('candidats', 'createur')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $election->id,
                'titre' => $election->titre,
                'description' => $election->description,
                'date_debut' => $election->date_debut,
                'date_fin' => $election->date_fin,
                'statut' => $election->statut,
                'created_by' => [
                    'id' => $election->createur->id,
                    'nom' => $election->createur->nom,
                ],
                'candidats' => $election->candidats->map(function ($candidat) {
                    return [
                        'id' => $candidat->id,
                        'nom' => $candidat->nom,
                        'programme' => $candidat->programme,
                        'photo_url' => $candidat->photo
                            ? asset('storage/' . $candidat->photo)
                            : null,
                    ];
                }),
                'nb_candidats' => $election->candidats->count(),
                'created_at' => $election->created_at,
            ]
        ]);
    }

    /**
     * Modifier une élection (ADMIN uniquement)
     */
    public function update(UpdateElectionRequest $request, $id)
    {
        $election = Election::findOrFail($id);

        // ✅ Vérification : modification interdite si élection déjà ouverte ou clôturée
        if (in_array($election->statut, ['EnCours', 'Clôturée'])) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de modifier une élection déjà ouverte ou clôturée'
            ], 403);
        }

        // Validation dates si modifiées
        if ($request->has(['date_debut', 'date_fin'])) {
            $dateDebut = $request->date_debut ?? $election->date_debut;
            $dateFin = $request->date_fin ?? $election->date_fin;

            if (Carbon::parse($dateFin)->lte(Carbon::parse($dateDebut))) {
                return response()->json([
                    'success' => false,
                    'message' => 'La date de clôture doit être après la date d\'ouverture'
                ], 422);
            }
        }

        $election->update($request->only([
            'titre',
            'description',
            'date_debut',
            'date_fin',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Élection mise à jour avec succès',
            'data' => [
                'id' => $election->id,
                'titre' => $election->titre,
                'description' => $election->description,
                'date_debut' => $election->date_debut,
                'date_fin' => $election->date_fin,
                'statut' => $election->statut,
            ]
        ]);
    }

    /**
     * Supprimer une élection (ADMIN uniquement)
     */
    public function destroy($id)
    {
        $election = Election::findOrFail($id);

        // ✅ Vérification : suppression interdite si élection déjà ouverte ou clôturée
        if (in_array($election->statut, ['EnCours', 'Clôturée'])) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer une élection déjà ouverte ou clôturée'
            ], 403);
        }

        // ✅ Vérification : suppression interdite si des votes existent
        if ($election->votes()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer une élection ayant déjà des votes'
            ], 403);
        }

        // Supprimer les candidats associés (cascade automatique normalement)
        $election->candidats()->delete();

        // Supprimer l'élection
        $election->delete();

        return response()->json([
            'success' => true,
            'message' => 'Élection supprimée avec succès'
        ]);
    }

    /**
     * Publier une élection (Brouillon → Publiée)
     */
    public function publier($id)
    {
        $election = Election::findOrFail($id);

        // Vérification 1 : Élection en brouillon
        if ($election->statut !== 'Brouillon') {
            return response()->json([
                'success' => false,
                'message' => 'Seules les élections en brouillon peuvent être publiées'
            ], 400);
        }

        // Vérification 2 : Minimum 2 candidats ✅
        $nbCandidats = $election->candidats()->count();
        if ($nbCandidats < 2) {
            return response()->json([
                'success' => false,
                'message' => "Impossible de publier : l'élection doit avoir au moins 2 candidats (actuellement : {$nbCandidats})"
            ], 400);
        }

        // Vérification 3 : Dates cohérentes
        if ($election->date_fin <= $election->date_debut) {
            return response()->json([
                'success' => false,
                'message' => 'Les dates ne sont pas cohérentes'
            ], 400);
        }

        // Changement statut
        $election->update(['statut' => 'Publiée']);

        return response()->json([
            'success' => true,
            'message' => 'Élection publiée avec succès',
            'data' => [
                'id' => $election->id,
                'titre' => $election->titre,
                'statut' => $election->statut,
            ]
        ]);
    }

    /**
     * Clôturer une élection (EnCours → Clôturée)
     */
    public function cloturer($id)
    {
        $election = Election::findOrFail($id);

        // Vérification : élection doit être en cours
        if ($election->statut !== 'EnCours') {
            return response()->json([
                'success' => false,
                'message' => 'Seules les élections en cours peuvent être clôturées'
            ], 400);
        }

        // Changement statut
        $election->update(['statut' => 'Clôturée']);

        // ✅ Dépouillement automatique
        $resultats = $this->depouiller($election);

        return response()->json([
            'success' => true,
            'message' => 'Élection clôturée avec succès',
            'data' => [
                'election' => [
                    'id' => $election->id,
                    'titre' => $election->titre,
                    'statut' => $election->statut,
                ],
                'resultats' => $resultats
            ]
        ]);
    }

    /**
     * Résultats d'une élection
     */
    public function resultats($id)
    {
        $election = Election::with('candidats')->findOrFail($id);

        // Calculer résultats
        $resultats = $election->candidats->map(function ($candidat) {
            $nbVoix = Vote::where('candidat_id', $candidat->id)->count();
            return [
                'candidat_id' => $candidat->id,
                'nom' => $candidat->nom,
                'voix' => $nbVoix,
            ];
        });

        $totalVotes = $election->votes()->count();
        $totalElecteurs = Participation::where('election_id', $election->id)->count();

        // Ajouter pourcentages
        $resultatsAvecPourcentages = $resultats->map(function ($resultat) use ($totalVotes) {
            $resultat['pourcentage'] = $totalVotes > 0
                ? round(($resultat['voix'] / $totalVotes) * 100, 2)
                : 0;
            return $resultat;
        })->sortByDesc('voix')->values();

        return response()->json([
            'success' => true,
            'data' => [
                'election' => [
                    'id' => $election->id,
                    'titre' => $election->titre,
                    'statut' => $election->statut,
                ],
                'statistiques' => [
                    'total_votes' => $totalVotes,
                    'total_electeurs_ayant_vote' => $totalElecteurs,
                    'taux_participation' => $totalElecteurs > 0
                        ? round(($totalElecteurs / $totalElecteurs) * 100, 2)
                        : 0,
                ],
                'resultats' => $resultatsAvecPourcentages,
            ]
        ]);
    }

    /**
     * Méthode privée de dépouillement
     */
    private function depouiller(Election $election)
    {
        $resultats = $election->candidats->map(function ($candidat) {
            $nbVoix = Vote::where('candidat_id', $candidat->id)->count();
            return [
                'candidat_id' => $candidat->id,
                'nom' => $candidat->nom,
                'voix' => $nbVoix,
            ];
        });

        $totalVotes = $election->votes()->count();

        // Calculer pourcentages
        $resultatsAvecPourcentages = $resultats->map(function ($resultat) use ($totalVotes) {
            $resultat['pourcentage'] = $totalVotes > 0
                ? round(($resultat['voix'] / $totalVotes) * 100, 2)
                : 0;
            return $resultat;
        })->sortByDesc('voix')->values();

        return $resultatsAvecPourcentages;
    }
}
