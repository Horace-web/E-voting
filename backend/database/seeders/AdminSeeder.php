<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Vérifier si le rôle ADMIN existe, sinon le créer
        $adminRole = Role::firstOrCreate(
            ['code' => 'ADMIN'],
            [
                'nom' => 'Administrateur',
                'description' => 'Administrateur système avec tous les droits'
            ]
        );

        // Vérifier si l'admin existe déjà
        $adminExists = User::where('email', 'admin@vote.bj')->exists();

        if (!$adminExists) {
            User::create([
                'nom' => 'Super Admin',
                'email' => 'admin@vote.bj',
                'password' => Hash::make('Admin@123'),
                'statut' => 'actif',
                'role_id' => $adminRole->id,
            ]);

            $this->command->info('✅ Administrateur créé avec succès !');
            $this->command->info('📧 Email: admin@vote.bj');
            $this->command->info('🔑 Mot de passe: Admin@123');
        } else {
            $this->command->warn('⚠️  L\'administrateur existe déjà.');
        }
    }
}
