<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Election;
use App\Models\Candidat;
use App\Models\User;
use App\Models\Role;

class ElectionSeeder extends Seeder
{
    public function run()
    {
        $admin = User::whereHas('role', function($q) {
            $q->where('code', 'ADMIN');
        })->first();

        if (!$admin) {
            $this->command->error('Aucun admin trouvé. Exécutez RoleSeeder et AdminSeeder d\'abord.');
            return;
        }

        // Élection 1 : Active
        $election1 = Election::create([
            'titre' => 'Élection du Délégué de Classe 2026',
            'description' => 'Élection pour désigner le délégué de la promotion L3 Informatique',
            'date_debut' => now()->subDays(1),
            'date_fin' => now()->addDays(7),
            'statut' => 'EnCours',
            'created_by' => $admin->id,
        ]);

        Candidat::create([
            'election_id' => $election1->id,
            'nom' => 'Alice KOFFI',
            'programme' => 'Plus d\'activités culturelles et amélioration de la communication.',
        ]);

        Candidat::create([
            'election_id' => $election1->id,
            'nom' => 'Bob MENSAH',
            'programme' => 'Meilleure organisation des travaux pratiques.',
        ]);

        Candidat::create([
            'election_id' => $election1->id,
            'nom' => 'Clara ASSOGBA',
            'programme' => 'Renforcement de l\'entraide entre étudiants.',
        ]);

        // Élection 2 : En préparation
        $election2 = Election::create([
            'titre' => 'Élection Bureau des Étudiants 2026',
            'description' => 'Élection du nouveau bureau des étudiants',
            'date_debut' => now()->addDays(10),
            'date_fin' => now()->addDays(17),
            'statut' => 'Brouillon',
            'created_by' => $admin->id,
        ]);

        Candidat::create([
            'election_id' => $election2->id,
            'nom' => 'David TOGBE',
            'programme' => 'Transparence et événements inclusifs.',
        ]);

        Candidat::create([
            'election_id' => $election2->id,
            'nom' => 'Emma DOSSOU',
            'programme' => 'Innovation et collaboration.',
        ]);

        $this->command->info('✅ Élections et candidats créés avec succès.');
    }
}
