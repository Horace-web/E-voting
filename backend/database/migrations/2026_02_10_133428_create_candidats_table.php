<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('candidats', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('election_id');
            $table->string('nom');
            $table->string('photo')->nullable();
            $table->text('programme')->nullable();
            $table->timestamps();

            $table->foreign('election_id')
                  ->references('id')
                  ->on('elections')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('candidats');
    }
};
