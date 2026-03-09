<?php

namespace Database\Factories;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AuditLog>
 */
class AuditLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = AuditLog::class;
    public function definition(): array
    {
        $actions = ['created', 'updated', 'deleted', 'login', 'vote'];
        $models = ['Election', 'User', 'Vote', 'Candidate'];
        return [
            // Pas d'ID ici, HasUuids s'en occupe
            'user_id' => User::inRandomOrder()->first()?->id, 
            'action' => $this->faker->randomElement(['created', 'updated', 'deleted', 'login', 'vote']),
            'model' => $this->faker->randomElement(['Election', 'User', 'Vote']),
            'model_id' => $this->faker->uuid,
            'ip_address' => $this->faker->ipv4,
            'user_agent' => $this->faker->userAgent,
            'metadata' => [
                'browser' => 'Chrome',
                'os' => 'Windows',
                'old_value' => null,
                'new_value' => 'active'
            ],
            // On laisse created_at car ton modèle ne gère pas les timestamps auto (public $timestamps = false)
            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
