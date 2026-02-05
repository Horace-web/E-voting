<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('codes_otp', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email');
            $table->string('code', 6);
            $table->timestamp('expire_at');
            $table->boolean('utilise')->default(false);
            $table->timestamp('created_at')->useCurrent();

            $table->index(['email', 'created_at']);
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('codes_otp');
    }
};
