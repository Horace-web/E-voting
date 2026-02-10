<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('votes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('election_id');
            $table->uuid('candidat_id');
            $table->string('hash_anonyme', 64); // SHA256
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('election_id')
                  ->references('id')
                  ->on('elections')
                  ->onDelete('cascade');

            $table->foreign('candidat_id')
                  ->references('id')
                  ->on('candidats')
                  ->onDelete('cascade');

            // Index pour performances
            $table->index('election_id');
            $table->index('candidat_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('votes');
    }
};
