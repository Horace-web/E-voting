<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Election;
use App\Models\Candidat;
use App\Http\Requests\StoreCandidatRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\CandidatResource;
use Illuminate\Support\Facades\Log;
use OpenApi\Attributes as OA;

class CandidatController extends Controller
{
    #[OA\Post(
        path: '/api/elections/{election_id}/candidats',
        summary: 'Ajouter un candidat à une élection',
        security: [['sanctum' => []]],
        tags: ['Candidats'],
        parameters: [
            new OA\Parameter(
                name: 'election_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'ID de l\'élection'
            ),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['nom'],
                properties: [
                    new OA\Property(property: 'nom', type: 'string', example: 'Jean Dupont'),
                    new OA\Property(property: 'programme', type: 'string', example: 'Mon programme électoral'),
                    new OA\Property(property: 'photo_path', type: 'string', example: 'candidats/photo.jpg'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Candidat ajouté avec succès'),
            new OA\Response(response: 404, description: 'Élection non trouvée'),
            new OA\Response(response: 422, description: 'Données invalides'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function store(StoreCandidatRequest $request, $election_id)
    {
        $election = Election::findOrFail($election_id);

        $candidat = Candidat::create([
            'election_id' => $election->id,
            'nom' => $request->nom,
            'programme' => $request->programme,
            'photo' => $request->photo_path,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Candidat ajouté avec succès',
            'data' => [
                'id' => $candidat->id,
                'nom' => $candidat->nom,
                'programme' => $candidat->programme,
                'photo_url' => $candidat->photo
                    ? asset('storage/' . $candidat->photo)
                    : null,
            ]
        ], 201);
    }

    #[OA\Put(
        path: '/api/candidats/{id}',
        summary: 'Modifier un candidat',
        security: [['sanctum' => []]],
        tags: ['Candidats'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'ID du candidat'
            ),
        ],
        requestBody: new OA\RequestBody(
            required: false,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'nom', type: 'string', example: 'Jean Dupont'),
                    new OA\Property(property: 'programme', type: 'string', example: 'Mon programme mis à jour'),
                    new OA\Property(property: 'photo', type: 'string', format: 'binary', description: 'Photo du candidat'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Candidat mis à jour avec succès'),
            new OA\Response(response: 403, description: 'Élection déjà ouverte ou clôturée'),
            new OA\Response(response: 404, description: 'Candidat non trouvé'),
            new OA\Response(response: 422, description: 'Données invalides'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function update(Request $request, $id)
    {
        $candidat = Candidat::with('election')->findOrFail($id);

        if (in_array($candidat->election->statut, ['EnCours', 'Clôturée'])) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de modifier un candidat : l\'élection est déjà ouverte ou clôturée'
            ], 403);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'programme' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($candidat->photo) {
                Storage::disk('public')->delete($candidat->photo);
            }
            $validated['photo'] = $request->file('photo')->store('candidats', 'public');
        }

        $candidat->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Candidat mis à jour avec succès',
            'data' => new CandidatResource($candidat)
        ]);
    }

    #[OA\Delete(
        path: '/api/candidats/{id}',
        summary: 'Supprimer un candidat',
        security: [['sanctum' => []]],
        tags: ['Candidats'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'ID du candidat'
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Candidat supprimé avec succès'),
            new OA\Response(response: 403, description: 'Élection déjà ouverte ou clôturée'),
            new OA\Response(response: 404, description: 'Candidat non trouvé'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function destroy($id)
    {
        $candidat = Candidat::with('election')->findOrFail($id);

        if (in_array($candidat->election->statut, ['EnCours', 'Clôturée'])) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer un candidat : l\'élection est déjà ouverte ou clôturée'
            ], 403);
        }

        if ($candidat->photo) {
            Storage::disk('public')->delete($candidat->photo);
        }

        $candidat->delete();

        return response()->json([
            'success' => true,
            'message' => 'Candidat supprimé avec succès'
        ]);
    }
}