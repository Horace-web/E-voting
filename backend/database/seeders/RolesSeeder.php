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
    DB::table('roles')->insert([
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
    ]);
}
}
