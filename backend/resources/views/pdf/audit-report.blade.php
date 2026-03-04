<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Rapport d'Audit — {{ $election->titre }}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        h1 { color: #2c3e50; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #ecf0f1; }
        .footer { margin-top: 30px; font-size: 12px; color: #7f8c8d; }
    </style>
</head>
<body>
    <h1>Rapport d'Audit — {{ $election->titre }}</h1>
    
    <p><strong>Date de génération :</strong> {{ $generated_at->format('d/m/Y H:i:s') }}</p>

    <h2>Informations générales</h2>
    <table>
        <tr>
            <th>Titre</th>
            <td>{{ $election->titre }}</td>
        </tr>
        <tr>
            <th>Période</th>
            <td>{{ $election->date_debut->format('d/m/Y H:i') }} — {{ $election->date_fin->format('d/m/Y H:i') }}</td>
        </tr>
        <tr>
            <th>Statut</th>
            <td>{{ $election->statut }}</td>
        </tr>
        <tr>
            <th>Participations</th>
            <td>{{ $participations }}</td>
        </tr>
        <tr>
            <th>Votes comptabilisés</th>
            <td>{{ $votes }}</td>
        </tr>
        <tr>
            <th>Intégrité</th>
            <td>{{ $participations === $votes ? '✅ OK' : '⚠️ ANOMALIE' }}</td>
        </tr>
    </table>

    <h2>Résultats</h2>
    <table>
        <thead>
            <tr>
                <th>Candidat</th>
                <th>Voix</th>
                <th>Pourcentage</th>
            </tr>
        </thead>
        <tbody>
            @foreach($resultats as $r)
            <tr>
                <td>{{ $r['nom'] }}</td>
                <td>{{ $r['voix'] }}</td>
                <td>{{ $r['pourcentage'] }}%</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <h2>Logs récents</h2>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Utilisateur</th>
            </tr>
        </thead>
        <tbody>
            @foreach($logs as $log)
            <tr>
                <td>{{ $log->created_at->format('d/m/Y H:i:s') }}</td>
                <td>{{ $log->action }}</td>
                <td>{{ $log->user?->email ?? 'Système' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Document généré automatiquement — Système de Vote Électronique</p>
    </div>
</body>
</html>