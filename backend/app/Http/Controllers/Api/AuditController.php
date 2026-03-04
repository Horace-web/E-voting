<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Participation;
use App\Models\Election;
use App\Models\Vote;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;

class AuditController extends Controller
{
    /**
     * Lister les logs avec filtres
     */
    public function index(Request $request)
    {
        $query = AuditLog::with('user:id,email,nom')
            ->orderBy('created_at', 'desc');

        // Filtres optionnels
        if ($request->has('action')) {
            $query->action($request->action);
        }

        if ($request->has('model')) {
            $query->model($request->model);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('days')) {
            $query->recent($request->days);
        }

        $logs = $query->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    public function show($id)
    {
        $log = AuditLog::with('user')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $log
        ]);
    }

    public function participations(Request $request)
    {
        $query = Participation::with([
            'user:id,email,nom',
            'election:id,titre'
        ])->orderBy('voted_at', 'desc');

        // Filtre par élection
        if ($request->has('election_id')) {
            $query->where('election_id', $request->election_id);
        }

        // Filtre par période
        if ($request->has('date_from')) {
            $query->where('voted_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('voted_at', '<=', $request->date_to);
        }

        $participations = $query->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $participations
        ]);
    }

    public function checkIntegrity($election_id)
    {
        $election = Election::findOrFail($election_id);

        // Comptage participations
        $participations_count = $election->participations()->count();

        // Comptage votes
        $votes_count = $election->votes()->count();

        // Vérification cohérence
        $is_coherent = ($participations_count === $votes_count);

        // Vérification doublons (normalement impossible grâce à UNIQUE)
        $duplicates = \DB::table('participations')
            ->select('user_id', \DB::raw('count(*) as total'))
            ->where('election_id', $election_id)
            ->groupBy('user_id')
            ->having('total', '>', 1)
            ->get();

        // Vérification votes hors période
        $votes_hors_periode = Vote::where('election_id', $election_id)
            ->where(function($query) use ($election) {
                $query->where('created_at', '<', $election->date_debut)
                    ->orWhere('created_at', '>', $election->date_fin);
            })
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'election' => $election->titre,
                'participations' => $participations_count,
                'votes' => $votes_count,
                'coherent' => $is_coherent,
                'duplicates' => $duplicates,
                'votes_hors_periode' => $votes_hors_periode,
                'integrity_status' => $is_coherent && $duplicates->isEmpty() && $votes_hors_periode === 0
                    ? 'OK' 
                    : 'ANOMALIE DÉTECTÉE'
            ]
        ]);
    }

    public function stats()
    {
        $total_users = User::count();
        $total_elections = Election::count();
        $elections_actives = Election::active()->count();
        $total_votes = Vote::count();
        $total_logs = AuditLog::count();

        // Logs des 7 derniers jours
        $logs_recent = AuditLog::recent(7)->count();

        // Top actions
        $top_actions = AuditLog::select('action', \DB::raw('count(*) as total'))
            ->groupBy('action')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'utilisateurs' => $total_users,
                'elections' => $total_elections,
                'elections_actives' => $elections_actives,
                'votes_totaux' => $total_votes,
                'logs_totaux' => $total_logs,
                'logs_7_jours' => $logs_recent,
                'top_actions' => $top_actions,
            ]
        ]);
    }

    public function exportLogs(Request $request)
    {
        $query = AuditLog::with('user:id,email')
            ->orderBy('created_at', 'desc');

        // Filtres (mêmes que index)
        if ($request->has('action')) {
            $query->action($request->action);
        }

        if ($request->has('days')) {
            $query->recent($request->days);
        }

        $logs = $query->get();

        // Génération CSV
        $filename = 'audit_logs_' . now()->format('Y-m-d_His') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function() use ($logs) {
            $file = fopen('php://output', 'w');

            // En-tête
            fputcsv($file, [
                'ID',
                'Utilisateur',
                'Action',
                'Modèle',
                'ID Modèle',
                'IP',
                'Date',
            ]);

            // Données
            foreach ($logs as $log) {
                fputcsv($file, [
                    $log->id,
                    $log->user?->email ?? 'Système',
                    $log->action,
                    $log->model,
                    $log->model_id,
                    $log->ip_address,
                    $log->created_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportReport($election_id)
    {
        $election = Election::with('candidats')->findOrFail($election_id);

        // Statistiques
        $participations = $election->participations()->count();
        $votes = $election->votes()->count();

        // Résultats
        $resultats = $election->candidats->map(function ($candidat) {
            return [
                'nom' => $candidat->nom,
                'voix' => $candidat->votes()->count(),
                'pourcentage' => 0, // calculé après
            ];
        })->sortByDesc('voix')->values();

        // Calcul pourcentages
        $total_votes = $resultats->sum('voix');
        $resultats = $resultats->map(function ($r) use ($total_votes) {
            $r['pourcentage'] = $total_votes > 0 
                ? round(($r['voix'] / $total_votes) * 100, 2) 
                : 0;
            return $r;
        });

        // Logs de l'élection
        $logs = AuditLog::where('model', 'Election')
            ->where('model_id', $election_id)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        // Génération PDF
        $pdf = Pdf::loadView('pdf.audit-report', [
            'election' => $election,
            'participations' => $participations,
            'votes' => $votes,
            'resultats' => $resultats,
            'logs' => $logs,
            'generated_at' => now(),
        ]);

        return $pdf->download('rapport_audit_' . $election->id . '.pdf');
    }


}
