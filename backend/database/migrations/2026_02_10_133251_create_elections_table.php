<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('elections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('titre');
            $table->text('description')->nullable();
            $table->dateTime('date_debut');
            $table->dateTime('date_fin');
            $table->enum('statut', ['en_preparation', 'active', 'cloturee'])
                  ->default('en_preparation');
            $table->uuid('created_by'); // admin qui l'a créée
            $table->timestamps();

            $table->foreign('created_by')
                  ->references('id')
                  ->on('users')
                  ->onDelete('restrict');
        });
    }

    public function down()
    {
        Schema::dropIfExists('elections');
    }
};
