<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
{
    $roles = DB::table('roles')->pluck('id', 'code');

    // Admins
    for ($i = 1; $i <= 2; $i++) {
        DB::table('users')->insert([
            'id' => Str::uuid(),
            'email' => "admin{$i}@universite.bj",
            'nom' => "Admin {$i}",
            'role_id' => $roles['ADMIN'],
            'statut' => 'actif',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    // Voters
    for ($i = 1; $i <= 10; $i++) {
        DB::table('users')->insert([
            'id' => Str::uuid(),
            'email' => "electeur{$i}@universite.bj",
            'nom' => "Électeur {$i}",
            'role_id' => $roles['VOTER'],
            'statut' => 'actif',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    // Auditor
    DB::table('users')->insert([
        'id' => Str::uuid(),
        'email' => "auditeur@universite.bj",
        'nom' => "Auditeur",
        'role_id' => $roles['AUDITOR'],
        'statut' => 'actif',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
}
}
