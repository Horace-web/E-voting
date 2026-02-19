<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class ProductionVoterSeeder extends Seeder
{
    /**
     * Seed production voters for testing.
     *
     * Run with: php artisan db:seed --class=ProductionVoterSeeder
     */
    public function run(): void
    {
        $voterRole = Role::where('code', 'VOTER')->first();
        $auditorRole = Role::where('code', 'AUDITOR')->first();

        if (!$voterRole || !$auditorRole) {
            $this->command->error('❌ Roles not found. Run RolesSeeder first.');
            return;
        }

        $this->command->info('👥 Création des utilisateurs de production...');

        // ========================================
        // ÉLECTEURS DE TEST
        // ========================================

        $voters = [
            [
                'nom' => 'Akim ADJOVI',
                'email' => 'akim.adjovi@universite.bj',
                'password' => Hash::make('Password123!'),
                'statut' => 'actif',
                'role_id' => $voterRole->id,
            ],
            [
                'nom' => 'Nadège HOUNGBO',
                'email' => 'nadege.houngbo@universite.bj',
                'password' => Hash::make('Password123!'),
                'statut' => 'actif',
                'role_id' => $voterRole->id,
            ],
            [
                'nom' => 'Franck AMOUSSOU',
                'email' => 'franck.amoussou@universite.bj',
                'password' => Hash::make('Password123!'),
                'statut' => 'actif',
                'role_id' => $voterRole->id,
            ],
            [
                'nom' => 'Sylvie GBAGUIDI',
                'email' => 'sylvie.gbaguidi@universite.bj',
                'password' => Hash::make('Password123!'),
                'statut' => 'actif',
                'role_id' => $voterRole->id,
            ],
            [
                'nom' => 'Eric DOSSOU',
                'email' => 'eric.dossou@universite.bj',
                'password' => Hash::make('Password123!'),
                'statut' => 'actif',
                'role_id' => $voterRole->id,
            ],
            [
                'nom' => 'Rachelle AKPLOGAN',
                'email' => 'rachelle.akplogan@universite.bj',
                'password' => Hash::make('Password123!'),
                'statut' => 'actif',
                'role_id' => $voterRole->id,
            ],
            [
                'nom' => 'Rodrigue HOUNGNINOU',
                'email' => 'rodrigue.houngninou@universite.bj',
                'password' => Hash::make('Password123!'),
                'statut' => 'actif',
                'role_id' => $voterRole->id,
            ],
            [
                'nom' => 'Mireille AGOSSOU',
                'email' => 'mireille.agossou@universite.bj',
                'password' => Hash::make('Password123!'),
                'statut' => 'actif',
                'role_id' => $voterRole->id,
            ],
            [
                'nom' => 'Gilles ZANNOU',
                'email' => 'gilles.zannou@universite.bj',
                'password' => Hash::make('Password123!'),
                'statut' => 'actif',
                'role_id' => $voterRole->id,
            ],
            [
                'nom' => 'Sandrine KPADONOU',
                'email' => 'sandrine.kpadonou@universite.bj',
                'password' => Hash::make('Password123!'),
                'statut' => 'actif',
                'role_id' => $voterRole->id,
            ],
            [
                'nom' => 'Ulrich BABA-MOUSSA',
                'email' => 'ulrich.babamoussa@universite.bj',
                'password' => Hash::make('Password123!'),
                'statut' => 'actif',
                'role_id' => $voterRole->id,
            ],
            [
                'nom' => 'Flore DEGBEY',
                'email' => 'flore.degbey@universite.bj',
                'password' => Hash::make('Password123!'),
                'statut' => 'actif',
                'role_id' => $voterRole->id,
            ],
            [
                'nom' => 'Maxime ALLADAYE',
                'email' => 'maxime.alladaye@universite.bj',
                'password' => Hash::make('Password123!'),
                'statut' => 'actif',
                'role_id' => $voterRole->id,
            ],
            [
                'nom' => 'Jocelyne AZONHIHO',
                'email' => 'jocelyne.azonhiho@universite.bj',
                'password' => Hash::make('Password123!'),
                'statut' => 'actif',
                'role_id' => $voterRole->id,
            ],
            [
                'nom' => 'Serge TOKPANOU',
                'email' => 'serge.tokpanou@universite.bj',
                'password' => Hash::make('Password123!'),
                'statut' => 'actif',
                'role_id' => $voterRole->id,
            ],
        ];

        foreach ($voters as $voter) {
            User::create($voter);
        }


        $this->command->info("✅ " . count($voters) . " électeurs créés");

        // ========================================
        // AUDITEURS
        // ========================================

        $auditors = [
            [
                'nom' => 'Dr. Pascal CHABI',
                'email' => 'pascal.chabi@universite.bj',
                'password' => Hash::make('Auditor123!'),
                'statut' => 'actif',
                'role_id' => $auditorRole->id,
            ],
            [
                'nom' => 'Prof. Yvette SODJINOU',
                'email' => 'yvette.sodjinou@universite.bj',
                'password' => Hash::make('Auditor123!'),
                'statut' => 'actif',
                'role_id' => $auditorRole->id,
            ],
        ];

        foreach ($auditors as $auditor) {
            User::create($auditor);
        }

        $this->command->info("✅ " . count($auditors) . " auditeurs créés");

        // ========================================
        // RÉSUMÉ
        // ========================================

        $this->command->newLine();
        $this->command->info('========================================');
        $this->command->info('📊 RÉSUMÉ DES UTILISATEURS CRÉÉS');
        $this->command->info('========================================');

        $totalUsers = User::count();
        $totalAdmins = User::whereHas('role', function($q) {
            $q->where('code', 'ADMIN');
        })->count();
        $totalVoters = User::whereHas('role', function($q) {
            $q->where('code', 'VOTER');
        })->count();
        $totalAuditors = User::whereHas('role', function($q) {
            $q->where('code', 'AUDITOR');
        })->count();

        $this->command->table(
            ['Rôle', 'Nombre'],
            [
                ['Administrateurs', $totalAdmins],
                ['Électeurs', $totalVoters],
                ['Auditeurs', $totalAuditors],
                ['TOTAL', $totalUsers],
            ]
        );

        $this->command->newLine();
        $this->command->info('🔑 IDENTIFIANTS PAR DÉFAUT');
        $this->command->info('========================================');
        $this->command->info('Admin    : admin@vote.bj / Admin@123');
        $this->command->info('Électeurs : [email] / Password123!');
        $this->command->info('Auditeurs : [email] / Auditor123!');
        $this->command->newLine();
        $this->command->warn('⚠️  SÉCURITÉ : Changez ces mots de passe en production !');
    }
}
