<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('participations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('election_id');
            $table->timestamp('voted_at');
            $table->timestamps();

            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');

            $table->foreign('election_id')
                  ->references('id')
                  ->on('elections')
                  ->onDelete('cascade');

            // ⚠️ CONTRAINTE CRITIQUE : 1 vote max par user/election
            $table->unique(['user_id', 'election_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('participations');
    }
};
