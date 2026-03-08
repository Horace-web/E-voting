<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Election;
use Carbon\Carbon;

class ElectionsCloturer extends Command
{
    protected $signature = 'elections:cloturer';
    protected $description = 'Ferme automatiquement les élections dont la date de fin est atteinte';

    public function handle()
    {
        $now = Carbon::now();

        $elections = Election::where('statut', 'EnCours')
                            ->where('date_fin', '<=', $now)
                            ->get();

        foreach ($elections as $election) {
            $election->statut = 'Clôturée';
            $election->save();
            $this->info("✅ Élection clôturée : {$election->titre}");
        }

        return 0;
    }
}
