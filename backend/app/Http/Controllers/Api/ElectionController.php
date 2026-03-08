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
use OpenApi\Attributes as OA;

class ElectionController extends Controller
{
    #[OA\Get(
        path: '/api/elections',
        summary: 'Lister les élections',
        description: 'ADMIN : toutes les élections. VOTER : élections EN COURS uniquement.',
        security: [['sanctum' => []]],
        tags: ['Elections'],
        responses: [
            new OA\Response(response: 200, description: 'Liste des élections'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function index(Request $request)
    {
        $user = $request->user();

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

        $elections = Election::where('statut', 'EnCours')
            ->where('date_debut', '<=', now())
            ->where('date_fin', '>=', now())
            ->with('candidats')
            ->get()
            ->map(function ($election) use ($user) {
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
                    'a_vote' => $aVote,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $elections
        ]);
    }

    #[OA\Post(
        path: '/api/elections',
        summary: 'Créer une élection (ADMIN uniquement)',
        security: [['sanctum' => []]],
        tags: ['Elections'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['titre', 'date_debut', 'date_fin'],
                properties: [
                    new OA\Property(property: 'titre', type: 'string', example: 'Élection du bureau 2025'),
                    new OA\Property(property: 'description', type: 'string', example: 'Description de l\'élection'),
                    new OA\Property(property: 'date_debut', type: 'string', format: 'datetime', example: '2025-06-01 08:00:00'),
                    new OA\Property(property: 'date_fin', type: 'string', format: 'datetime', example: '2025-06-01 18:00:00'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Élection créée avec succès'),
            new OA\Response(response: 422, description: 'Données invalides'),
            new OA\Response(response: 401, description: 'Non autorisé'),
            new OA\Response(response: 403, description: 'Accès refusé'),
        ]
    )]
    public function store(StoreElectionRequest $request)
    {
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
            'statut' => 'Brouillon',
            'created_by' => optional(\Illuminate\Support\Facades\Auth::user())->id,
        ]);

        AuditService::logElectionCreated($election);
        DB::commit();

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

    #[OA\Get(
        path: '/api/elections/{id}',
        summary: 'Afficher les détails d\'une élection',
        security: [['sanctum' => []]],
        tags: ['Elections'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'ID de l\'élection'
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Détails de l\'élection'),
            new OA\Response(response: 404, description: 'Élection non trouvée'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
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

    #[OA\Put(
        path: '/api/elections/{id}',
        summary: 'Modifier une élection (ADMIN uniquement)',
        security: [['sanctum' => []]],
        tags: ['Elections'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'ID de l\'élection'
            ),
        ],
        requestBody: new OA\RequestBody(
            required: false,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'titre', type: 'string', example: 'Nouveau titre'),
                    new OA\Property(property: 'description', type: 'string', example: 'Nouvelle description'),
                    new OA\Property(property: 'date_debut', type: 'string', format: 'datetime', example: '2025-06-01 08:00:00'),
                    new OA\Property(property: 'date_fin', type: 'string', format: 'datetime', example: '2025-06-01 18:00:00'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Élection mise à jour avec succès'),
            new OA\Response(response: 403, description: 'Élection déjà ouverte ou clôturée'),
            new OA\Response(response: 404, description: 'Élection non trouvée'),
            new OA\Response(response: 422, description: 'Données invalides'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function update(UpdateElectionRequest $request, $id)
    {
        $election = Election::findOrFail($id);

        if (in_array($election->statut, ['EnCours', 'Clôturée'])) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de modifier une élection déjà ouverte ou clôturée'
            ], 403);
        }

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

        $data = $request->only(['titre', 'description', 'date_debut', 'date_fin']);

        $election->fill($data);

        if ($election->isDirty()) {
            $election->save();
        }

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

    #[OA\Delete(
        path: '/api/elections/{id}',
        summary: 'Supprimer une élection (ADMIN uniquement)',
        security: [['sanctum' => []]],
        tags: ['Elections'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'ID de l\'élection'
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Élection supprimée avec succès'),
            new OA\Response(response: 403, description: 'Élection ouverte/clôturée ou avec des votes'),
            new OA\Response(response: 404, description: 'Élection non trouvée'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function destroy($id)
    {
        $election = Election::findOrFail($id);

        if (in_array($election->statut, ['EnCours', 'Clôturée'])) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer une élection déjà ouverte ou clôturée'
            ], 403);
        }

        if ($election->votes()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer une élection ayant déjà des votes'
            ], 403);
        }

        $election->candidats()->delete();
        $election->delete();

        return response()->json([
            'success' => true,
            'message' => 'Élection supprimée avec succès'
        ]);
    }

    #[OA\Post(
        path: '/api/elections/{id}/publier',
        summary: 'Publier une élection (Brouillon → Publiée)',
        security: [['sanctum' => []]],
        tags: ['Elections'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'ID de l\'élection'
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Élection publiée avec succès'),
            new OA\Response(response: 400, description: 'Conditions de publication non remplies'),
            new OA\Response(response: 404, description: 'Élection non trouvée'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function publier($id)
    {
        $election = Election::findOrFail($id);

        if ($election->statut !== 'Brouillon') {
            return response()->json([
                'success' => false,
                'message' => 'Seules les élections en brouillon peuvent être publiées'
            ], 400);
        }

        $nbCandidats = $election->candidats()->count();
        if ($nbCandidats < 2) {
            return response()->json([
                'success' => false,
                'message' => "Impossible de publier : l'élection doit avoir au moins 2 candidats (actuellement : {$nbCandidats})"
            ], 400);
        }

        if ($election->date_fin <= $election->date_debut) {
            return response()->json([
                'success' => false,
                'message' => 'Les dates ne sont pas cohérentes'
            ], 400);
        }

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

    #[OA\Post(
        path: '/api/elections/{id}/cloturer',
        summary: 'Clôturer une élection (EnCours → Clôturée)',
        security: [['sanctum' => []]],
        tags: ['Elections'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'ID de l\'élection'
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Élection clôturée avec succès + résultats'),
            new OA\Response(response: 400, description: 'Élection non en cours'),
            new OA\Response(response: 404, description: 'Élection non trouvée'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function cloturer($id)
    {
        $election = Election::findOrFail($id);

        if ($election->statut !== 'EnCours') {
            return response()->json([
                'success' => false,
                'message' => 'Seules les élections en cours peuvent être clôturées'
            ], 400);
        }

        $election->update(['statut' => 'Clôturée']);

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

    #[OA\Get(
        path: '/api/elections/{id}/resultats',
        summary: 'Résultats d\'une élection',
        security: [['sanctum' => []]],
        tags: ['Elections'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'ID de l\'élection'
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Résultats de l\'élection'),
            new OA\Response(response: 404, description: 'Élection non trouvée'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function resultats($id)
    {
        $election = Election::with('candidats')->findOrFail($id);

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

        $resultatsAvecPourcentages = $resultats->map(function ($resultat) use ($totalVotes) {
            $resultat['pourcentage'] = $totalVotes > 0
                ? round(($resultat['voix'] / $totalVotes) * 100, 2)
                : 0;
            return $resultat;
        })->sortByDesc('voix')->values();

        return $resultatsAvecPourcentages;
    }
}