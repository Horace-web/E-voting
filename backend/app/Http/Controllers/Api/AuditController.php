<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Participation;
use App\Models\Election;
use App\Models\Vote;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\AuditLog;
use OpenApi\Attributes as OA;

class AuditController extends Controller
{
    #[OA\Get(
        path: '/api/audit/logs',
        summary: 'Lister les logs avec filtres',
        security: [['sanctum' => []]],
        tags: ['Audit'],
        parameters: [
            new OA\Parameter(name: 'user_id', in: 'query', required: false,
                schema: new OA\Schema(type: 'integer'), description: 'Filtrer par ID utilisateur'),
            new OA\Parameter(name: 'action', in: 'query', required: false,
                schema: new OA\Schema(type: 'string'), description: 'Filtrer par action'),
            new OA\Parameter(name: 'model', in: 'query', required: false,
                schema: new OA\Schema(type: 'string'), description: 'Filtrer par modèle'),
            new OA\Parameter(name: 'days', in: 'query', required: false,
                schema: new OA\Schema(type: 'integer'), description: 'Filtrer par nombre de jours'),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Liste des logs'),
            new OA\Response(response: 401, description: 'Non autorisé'),
            new OA\Response(response: 403, description: 'Accès refusé'),
        ]
    )]
    public function index(Request $request)
    {
        $query = AuditLog::with('user:id')
            ->orderBy('created_at', 'desc');

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('model')) {
            $query->where('model', $request->model);
        }

        if ($request->filled('days')) {
            $query->where('created_at', '>=', now()->subDays($request->days));
        }

        $logs = $query->paginate(50);

        return response()->json([
            'success' => true,
            'nb_resultats' => $logs->count(),
            'data' => $logs
        ]);
    }

    #[OA\Get(
        path: '/api/audit/logs/{id}',
        summary: 'Détails d\'un log',
        security: [['sanctum' => []]],
        tags: ['Audit'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true,
                schema: new OA\Schema(type: 'integer'), description: 'ID du log'),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Détails du log'),
            new OA\Response(response: 404, description: 'Log non trouvé'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function show($id)
    {
        $cleanId = trim($id, '{}');

        try {
            $log = AuditLog::with('user')->findOrFail($cleanId);

            return response()->json([
                'success' => true,
                'data' => $log
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => "Le log avec l'ID $cleanId n'existe pas dans la base."
            ], 404);
        }
    }

    #[OA\Get(
        path: '/api/audit/participations',
        summary: 'Lister les participations',
        security: [['sanctum' => []]],
        tags: ['Audit'],
        parameters: [
            new OA\Parameter(name: 'election_id', in: 'query', required: false,
                schema: new OA\Schema(type: 'integer'), description: 'Filtrer par élection'),
            new OA\Parameter(name: 'date_from', in: 'query', required: false,
                schema: new OA\Schema(type: 'string', format: 'date'), description: 'Date de début'),
            new OA\Parameter(name: 'date_to', in: 'query', required: false,
                schema: new OA\Schema(type: 'string', format: 'date'), description: 'Date de fin'),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Liste des participations'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function participations(Request $request)
    {
        $query = Participation::with([
            'user:id,email,nom',
            'election:id,titre'
        ])->orderBy('voted_at', 'desc');

        if ($request->has('election_id')) {
            $query->where('election_id', $request->election_id);
        }

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

    #[OA\Get(
        path: '/api/audit/elections/{id}/integrity',
        summary: 'Vérifier l\'intégrité d\'une élection',
        security: [['sanctum' => []]],
        tags: ['Audit'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true,
                schema: new OA\Schema(type: 'integer'), description: 'ID de l\'élection'),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Résultat de la vérification d\'intégrité'),
            new OA\Response(response: 404, description: 'Élection non trouvée'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function checkIntegrity($election_id)
    {
        $election = Election::findOrFail($election_id);

        $participations_count = $election->participations()->count();
        $votes_count = $election->votes()->count();
        $is_coherent = ($participations_count === $votes_count);

        $duplicates = \DB::table('participations')
            ->select('user_id', \DB::raw('count(*) as total'))
            ->where('election_id', $election_id)
            ->groupBy('user_id')
            ->having('total', '>', 1)
            ->get();

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

    #[OA\Get(
        path: '/api/audit/stats',
        summary: 'Statistiques générales du système',
        security: [['sanctum' => []]],
        tags: ['Audit'],
        responses: [
            new OA\Response(response: 200, description: 'Statistiques du système'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function stats()
    {
        $total_users = User::count();
        $total_elections = Election::count();
        $elections_actives = Election::active()->count();
        $total_votes = Vote::count();
        $total_logs = AuditLog::count();

        $logs_recent = AuditLog::recent(7)->count();

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

    #[OA\Get(
        path: '/api/audit/export/logs',
        summary: 'Exporter les logs en CSV',
        security: [['sanctum' => []]],
        tags: ['Audit'],
        parameters: [
            new OA\Parameter(name: 'days', in: 'query', required: false,
                schema: new OA\Schema(type: 'integer'), description: 'Nombre de jours à exporter'),
            new OA\Parameter(name: 'user_id', in: 'query', required: false,
                schema: new OA\Schema(type: 'integer'), description: 'Filtrer par utilisateur'),
            new OA\Parameter(name: 'search', in: 'query', required: false,
                schema: new OA\Schema(type: 'string'), description: 'Recherche par modèle'),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Fichier CSV des logs'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function exportLogs(Request $request)
    {
        $query = AuditLog::with('user:id,email')
            ->orderBy('created_at', 'desc');

        if ($request->filled('days')) {
            $query->where('created_at', '>=', now()->subDays($request->days));
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('search')) {
            $query->where('model', 'LIKE', "%{$request->search}%");
        }

        $filename = 'audit_logs_' . now()->format('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function() use ($query) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            fwrite($file, "sep=;\n");

            fputcsv($file, ['ID', 'Utilisateur', 'Nom Client', 'Action', 'Modèle', 'ID Modèle', 'IP', 'Date'], ';');

            foreach ($query->cursor() as $log) {
                fputcsv($file, [
                    $log->id,
                    $log->user?->email ?? 'Système',
                    $log->user?->nom ?? '-',
                    $log->action,
                    $log->model,
                    $log->model_id,
                    $log->ip_address,
                    $log->created_at->format('d/m/Y H:i'),
                ], ';');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    #[OA\Get(
        path: '/api/audit/export/report/{election_id}',
        summary: 'Exporter le rapport PDF d\'une élection',
        security: [['sanctum' => []]],
        tags: ['Audit'],
        parameters: [
            new OA\Parameter(name: 'election_id', in: 'path', required: true,
                schema: new OA\Schema(type: 'integer'), description: 'ID de l\'élection'),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Fichier PDF du rapport'),
            new OA\Response(response: 404, description: 'Élection non trouvée'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function exportReport($election_id)
    {
        $election = Election::with('candidats')->findOrFail($election_id);

        $participations = $election->participations()->count();
        $votes = $election->votes()->count();

        $resultats = $election->candidats->map(function ($candidat) {
            return [
                'nom' => $candidat->nom,
                'voix' => $candidat->votes()->count(),
                'pourcentage' => 0,
            ];
        })->sortByDesc('voix')->values();

        $total_votes = $resultats->sum('voix');
        $resultats = $resultats->map(function ($r) use ($total_votes) {
            $r['pourcentage'] = $total_votes > 0 ? round(($r['voix'] / $total_votes) * 100, 2) : 0;
            return $r;
        });

        $logs = AuditLog::with('user')
            ->where('model', 'Election')
            ->where('model_id', $election_id)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

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