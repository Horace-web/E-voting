<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tokens_confirmation', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->unique();
            $table->string('token', 64)->unique();
            $table->timestamp('expire_at');
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            // Optionnel : index pour améliorer les performances
            $table->index(['token', 'expire_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tokens_confirmation');
    }
};
