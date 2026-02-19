<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProductionSeeder extends Seeder
{
    /**
     * Run all production seeders in the correct order.
     *
     * Usage:
     * php artisan db:seed --class=ProductionSeeder
     *
     * Or in production:
     * php artisan migrate:fresh --seed --seeder=ProductionSeeder
     */
    public function run(): void
    {
        $this->command->info('');
        $this->command->info('╔════════════════════════════════════════════════╗');
        $this->command->info('║   🗳️  E-VOTING PRODUCTION SEEDER              ║');
        $this->command->info('╚════════════════════════════════════════════════╝');
        $this->command->info('');

        // ========================================
        // 1. ROLES
        // ========================================
        $this->command->info('📦 Étape 1/4 : Création des rôles...');
        $this->call(RolesSeeder::class);
        $this->command->info('');

        // ========================================
        // 2. ADMIN
        // ========================================
        $this->command->info('📦 Étape 2/4 : Création de l\'administrateur...');
        $this->call(AdminSeeder::class);
        $this->command->info('');

        // ========================================
        // 3. USERS (Voters + Auditors)
        // ========================================
        $this->command->info('📦 Étape 3/4 : Création des utilisateurs...');
        $this->call(ProductionVoterSeeder::class);
        $this->command->info('');

        // ========================================
        // 4. ELECTIONS + CANDIDATS
        // ========================================
        $this->command->info('📦 Étape 4/4 : Création des élections...');
        $this->call(ProductionElectionSeeder::class);
        $this->command->info('');

        // ========================================
        // RÉSUMÉ FINAL
        // ========================================
        $this->command->info('');
        $this->command->info('╔════════════════════════════════════════════════╗');
        $this->command->info('║   ✅ PRODUCTION DATABASE READY                 ║');
        $this->command->info('╚════════════════════════════════════════════════╝');
        $this->command->info('');

        $this->displayFinalSummary();
    }

    private function displayFinalSummary()
    {
        $this->command->info('📊 BASE DE DONNÉES INITIALISÉE');
        $this->command->info('========================================');

        $stats = [
            ['Rôles', \App\Models\Role::count()],
            ['Utilisateurs', \App\Models\User::count()],
            ['  └─ Admins', \App\Models\User::whereHas('role', fn($q) => $q->where('code', 'ADMIN'))->count()],
            ['  └─ Électeurs', \App\Models\User::whereHas('role', fn($q) => $q->where('code', 'VOTER'))->count()],
            ['  └─ Auditeurs', \App\Models\User::whereHas('role', fn($q) => $q->where('code', 'AUDITOR'))->count()],
            ['Élections', \App\Models\Election::count()],
            ['Candidats', \App\Models\Candidat::count()],
            ['Votes', \App\Models\Vote::count()],
        ];

        $this->command->table(['Ressource', 'Quantité'], $stats);

        $this->command->warn('⚠️  SÉCURITÉ IMPORTANTE');
        $this->command->warn('========================================');
        $this->command->warn('→ Changez TOUS les mots de passe par défaut');
        $this->command->warn('→ Activez la vérification email en production');
        $this->command->warn('→ Configurez les limites de rate limiting');
        $this->command->warn('→ Activez HTTPS sur le serveur');
        $this->command->info('');
    }
}
