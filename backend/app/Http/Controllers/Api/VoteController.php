<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Election;
use App\Models\Candidat;
use App\Models\Participation;
use App\Models\Vote;
use App\Http\Requests\StoreVoteRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VoteController extends Controller
{
    //
    public function store(StoreVoteRequest $request)
        {
            $user = $request->user();
            $election_id = $request->election_id;
            $candidat_id = $request->candidat_id;

            DB::beginTransaction();

            try {
                // 1️⃣ Vérifier que l'élection est active
                $election = Election::active()->findOrFail($election_id);

                // 2️⃣ Vérifier que le candidat appartient à cette élection
                $candidat = Candidat::where('id', $candidat_id)
                    ->where('election_id', $election_id)
                    ->firstOrFail();

                // 3️⃣ Vérifier que l'utilisateur n'a pas déjà voté
                $dejaVote = Participation::where('user_id', $user->id)
                    ->where('election_id', $election_id)
                    ->exists();

                if ($dejaVote) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Vous avez déjà voté pour cette élection'
                    ], 403);
                }

                // 4️⃣ Enregistrer la participation (traçabilité)
                Participation::create([
                    'user_id'     => $user->id,
                    'election_id' => $election_id,
                    'voted_at'    => now(),
                ]);

                // 5️⃣ Enregistrer le vote anonyme
                $hash_anonyme = hash('sha256', $user->id . $election_id . now()->timestamp . rand());

                Vote::create([
                    'election_id'  => $election_id,
                    'candidat_id'  => $candidat_id,
                    'hash_anonyme' => $hash_anonyme,
                ]);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Vote enregistré avec succès'
                ], 201);

            } catch (\Exception $e) {
                DB::rollBack();

                Log::error('Erreur lors du vote', [
                    'user_id' => $user->id,
                    'election_id' => $election_id,
                    'error' => $e->getMessage()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de l\'enregistrement du vote'
                ], 500);
            }
        }
        public function checkVote(Request $request, $election_id)
            {
                Log::info('checkVote appelé', [
                    'user_id'     => $request->user()->id,
                    'election_id' => $election_id
                ]);

                $aVote = Participation::where('user_id', $request->user()->id)
                    ->where('election_id', $election_id)
                    ->exists();

                Log::info('Résultat', ['a_vote' => $aVote]);

                return response()->json([
                    'success' => true,
                    'a_vote'  => $aVote
                ]);
            }

}
