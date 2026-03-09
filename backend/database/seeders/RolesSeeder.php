<?php

namespace Database\Seeders;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
{
    DB::table('roles')->upsert([
        [
            'id' => Str::uuid(),
            'code' => 'ADMIN',
            'nom' => 'Administrateur',
            'description' => 'Gestion complète du système',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => Str::uuid(),
            'code' => 'VOTER',
            'nom' => 'Électeur',
            'description' => 'Peut voter aux élections',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => Str::uuid(),
            'code' => 'AUDITOR',
            'nom' => 'Auditeur',
            'description' => 'Consultation des logs uniquement',
            'created_at' => now(),
            'updated_at' => now(),
        ],
    ], ['code'], ['nom', 'description', 'updated_at']); 
    // ^ Le 2ème argument ['code'] est la colonne à vérifier pour l'unicité.
    // ^ Le 3ème argument liste les colonnes à mettre à jour si le code existe déjà.
}
}
