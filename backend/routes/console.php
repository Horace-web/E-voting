<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Log;


Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Planification de la commande pour ouvrir les élections
Schedule::command('elections:ouvrir')
    ->everyMinute()
    ->withoutOverlapping()
    ->runInBackground()
    ->before(function () {
        Log::info('🟡 Début de elections:ouvrir', ['time' => now()]);
    })
    ->after(function () {
        Log::info('🟢 Fin de elections:ouvrir', ['time' => now()]);
    })
    ->onSuccess(function () {
        Log::info('✅ elections:ouvrir réussi');
    })
    ->onFailure(function () {
        Log::error('❌ elections:ouvrir échoué');
    });

// ✅ TEST POUR CONFIRMER QUE LE CRON TOURNE
Schedule::call(function () {
    Log::info('🕐 CRON actif - ' . now()->toDateTimeString());
})->everyMinute();

// Planification de la commande pour clôturer les élections
Schedule::command('elections:cloturer')
    ->everyMinute()
    ->withoutOverlapping()
    ->runInBackground()
    ->before(function () {
        Log::info('🟡 [CRON] Début de elections:cloturer', [
            'timestamp' => now()->toDateTimeString()
        ]);
    })
    ->after(function () {
        Log::info('🟢 [CRON] Fin de elections:cloturer', [
            'timestamp' => now()->toDateTimeString()
        ]);
    })
    ->onSuccess(function () {
        Log::info('✅ [CRON] elections:cloturer exécuté avec succès');
    })
    ->onFailure(function () {
        Log::error('❌ [CRON] elections:cloturer a échoué');
    });

// ✅ TEST : Vérifier que le cron tourne
Schedule::call(function () {
    Log::info('🕐 [CRON] Heartbeat - Le scheduler est actif', [
        'time' => now()->toDateTimeString()
    ]);
})->everyMinute();
