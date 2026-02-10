<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Election;

class OuvrirElections extends Command
{
    protected $signature = 'elections:ouvrir';
    protected $description = 'Ouvre automatiquement les élections dont la date de début est atteinte';

    public function handle()
    {
        $elections = Election::where('statut', 'Publiée')
            ->where('date_debut', '<=', now())
            ->get();

        $count = 0;
        foreach ($elections as $election) {
            $election->update(['statut' => 'EnCours']);
            $count++;
            $this->info("Élection '{$election->titre}' ouverte");
        }

        $this->info("Total : {$count} élection(s) ouverte(s)");
    }
}
