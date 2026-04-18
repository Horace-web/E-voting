<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVoteRequest;
use App\Models\Candidat;
use App\Models\Election;
use App\Models\Participation;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VoteController extends Controller
{
    public function store(StoreVoteRequest $request, $election_id = null)
    {
        $user = $request->user();
        $electionId = $request->election_id ?: $election_id;
        $candidatId = $request->candidat_id;

        DB::beginTransaction();

        try {
            $election = Election::active()->findOrFail($electionId);

            $candidat = Candidat::query()
                ->where('id', $candidatId)
                ->where('election_id', $electionId)
                ->firstOrFail();

            $dejaVote = Participation::query()
                ->where('user_id', $user->id)
                ->where('election_id', $electionId)
                ->exists();

            if ($dejaVote) {
                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'Vous avez déjà voté pour cette élection'
                ], 403);
            }

            Participation::create([
                'user_id' => $user->id,
                'election_id' => $electionId,
                'voted_at' => now(),
            ]);

            $hashAnonyme = hash('sha256', $user->id . $electionId . now()->timestamp . random_int(1000, 999999));

            Vote::create([
                'election_id' => $electionId,
                'candidat_id' => $candidat->id,
                'hash_anonyme' => $hashAnonyme,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Vote enregistré avec succès'
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Erreur lors du vote', [
                'user_id' => $user?->id,
                'election_id' => $electionId,
                'candidat_id' => $candidatId,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'enregistrement du vote'
            ], 500);
        }
    }

    public function checkVote(Request $request, $election_id)
    {
        $aVote = Participation::query()
            ->where('user_id', $request->user()->id)
            ->where('election_id', $election_id)
            ->exists();

        return response()->json([
            'success' => true,
            'a_vote' => $aVote
        ]);
    }

    public function history(Request $request)
    {
        $participations = Participation::with('election')
            ->where('user_id', $request->user()->id)
            ->latest('voted_at')
            ->get()
            ->map(function ($participation) {
                return [
                    'id' => $participation->id,
                    'election_id' => $participation->election_id,
                    'election_titre' => optional($participation->election)->titre,
                    'date_vote' => optional($participation->voted_at)?->toISOString(),
                    'resultat' => 'enregistre',
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => $participations,
        ]);
    }
}
