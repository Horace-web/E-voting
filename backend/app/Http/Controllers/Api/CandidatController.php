<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Election;
use App\Models\Candidat;
use App\Http\Requests\StoreCandidatRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\CandidatResource;

class CandidatController extends Controller
{
    //

    public function store(StoreCandidatRequest $request, $election_id)
    {
        $election = Election::findOrFail($election_id);

        $photoPath = null;

        // Gestion upload photo
        if ($request->hasFile('photo')) {
            // Stocker dans storage/app/public/candidats
            $photoPath = $request->file('photo')->store('candidats', 'public');
        }

        $candidat = Candidat::create([
            'election_id' => $election->id,
            'nom'         => $request->nom,
            'programme'   => $request->programme,
            'photo'       => $photoPath,
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
                    : null, // ✅ URL complète pour le frontend
            ]
        ], 201);
    }

        public function update(Request $request, $id)
    {
        $candidat = Candidat::with('election')->findOrFail($id);

        // ✅ Vérification critique : élection pas encore ouverte
        if (in_array($candidat->election->statut, ['EnCours', 'Clôturée'])) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de modifier un candidat : l\'élection est déjà ouverte ou clôturée'
            ], 403);
        }

        // Validation
        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'programme' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        // Gestion photo si nouvelle
        if ($request->hasFile('photo')) {
            // Supprimer ancienne photo si existe
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

        public function destroy($id)
    {
        $candidat = Candidat::with('election')->findOrFail($id);

        // ✅ Vérification : élection pas encore ouverte
        if (in_array($candidat->election->statut, ['EnCours', 'Clôturée'])) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer un candidat : l\'élection est déjà ouverte ou clôturée'
            ], 403);
        }

        // Supprimer photo si existe
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


