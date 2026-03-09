<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuditLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // On crée 100 entrées d'audit
        AuditLog::factory()->count(50)->create();
    }
}
