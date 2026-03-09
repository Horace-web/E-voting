<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Election;
use App\Models\Candidat;
use App\Models\User;
use Carbon\Carbon;

class ProductionElectionSeeder extends Seeder
{
    /**
     * Seed production elections with realistic data.
     *
     * Run with: php artisan db:seed --class=ProductionElectionSeeder
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@vote.bj')->first();

        if (!$admin) {
            $this->command->error('❌ Admin not found. Run AdminSeeder first.');
            return;
        }

        $this->command->info('🗳️ Création des élections de production...');

        // ========================================
        // ÉLECTION 1 : Bureau des Étudiants 2026
        // ========================================

        $election1 = Election::create([
            'titre' => 'Élection du Bureau des Étudiants 2026',
            'description' => 'Élection pour désigner le nouveau bureau des étudiants pour l\'année académique 2026-2027. Les candidats présenteront leur vision pour améliorer la vie étudiante sur le campus.',
            'date_debut' => Carbon::parse('2026-03-15 08:00:00'),
            'date_fin' => Carbon::parse('2026-03-15 18:00:00'),
            'statut' => 'publiée',
            'created_by' => $admin->id,
        ]);

        $candidats1 = [
            [
                'nom' => 'Liste INNOVATION',
                'programme' => "Notre vision pour le campus :\n\n• Digitalisation complète des services étudiants\n• Création d'un incubateur de startups\n• Amélioration de la restauration universitaire\n• Organisation d'événements culturels mensuels\n• Mise en place d'un système de mentorat\n\nNotre équipe est composée d'étudiants engagés, issus de toutes les filières, prêts à transformer votre expérience universitaire.",
                'photo' => 'candidats/innovation_team.jpg',
            ],
            [
                'nom' => 'Liste SOLIDARITÉ',
                'programme' => "Nos engagements :\n\n• Création d'un fonds de soutien pour étudiants en difficulté\n• Amélioration des infrastructures sportives\n• Mise en place de navettes gratuites inter-campus\n• Organisation de forums emploi trimestriels\n• Renforcement de la bibliothèque numérique\n\nEnsemble, construisons un campus solidaire et inclusif.",
                'photo' => 'candidats/solidarite_team.jpg',
            ],
            [
                'nom' => 'Liste AVENIR',
                'programme' => "Notre programme d'action :\n\n• Partenariats avec les entreprises locales\n• Ateliers de développement personnel hebdomadaires\n• Modernisation des espaces de coworking\n• Programme de bourses d'excellence\n• Création d'une radio étudiante\n\nVotez pour un avenir meilleur !",
                'photo' => 'candidats/avenir_team.jpg',
            ],
        ];

        foreach ($candidats1 as $candidat) {
            Candidat::create(array_merge($candidat, ['election_id' => $election1->id]));
        }

        $this->command->info("✅ Élection '{$election1->titre}' créée avec " . count($candidats1) . " candidats");

        // ========================================
        // ÉLECTION 2 : Conseil d'Administration
        // ========================================

        $election2 = Election::create([
            'titre' => 'Conseil d\'Administration - Représentant Étudiant',
            'description' => 'Élection du représentant étudiant au Conseil d\'Administration de l\'université. Le candidat élu siègera pendant 2 ans et participera aux décisions stratégiques de l\'établissement.',
            'date_debut' => Carbon::parse('2026-04-10 09:00:00'),
            'date_fin' => Carbon::parse('2026-04-10 17:00:00'),
            'statut' => 'publiée',
            'created_by' => $admin->id,
        ]);

        $candidats2 = [
            [
                'nom' => 'Marie ASSOGBA',
                'programme' => "Étudiante en Master Gestion, déléguée de promotion.\n\nMes priorités :\n\n• Transparence dans la gestion universitaire\n• Amélioration de la qualité pédagogique\n• Réduction des frais de scolarité\n• Modernisation des équipements\n• Voix forte des étudiants dans les décisions\n\nExpérience : 3 ans au bureau des étudiants, membre du conseil de faculté.",
                'photo' => 'candidats/marie_assogba.jpg',
            ],
            [
                'nom' => 'Koffi MENSAH',
                'programme' => "Étudiant en Licence Informatique, président d'association.\n\nMon engagement :\n\n• Défense des intérêts étudiants\n• Innovation pédagogique\n• Développement du campus numérique\n• Accès facilité aux ressources\n• Communication régulière avec les étudiants\n\nParcours : Coordinateur des clubs étudiants, membre du comité d'éthique.",
                'photo' => 'candidats/koffi_mensah.jpg',
            ],
        ];

        foreach ($candidats2 as $candidat) {
            Candidat::create(array_merge($candidat, ['election_id' => $election2->id]));
        }

        $this->command->info("✅ Élection '{$election2->titre}' créée avec " . count($candidats2) . " candidats");

        // ========================================
        // ÉLECTION 3 : Délégué de Promotion (Exemple EnCours)
        // ========================================

        $election3 = Election::create([
            'titre' => 'Délégué de Promotion - Licence 3 Informatique',
            'description' => 'Élection du délégué de la promotion Licence 3 Informatique pour l\'année en cours. Le délégué sera l\'interlocuteur privilégié entre les étudiants et l\'administration.',
            'date_debut' => Carbon::now()->subHours(2), // Commencée il y a 2h
            'date_fin' => Carbon::now()->addHours(4),   // Finit dans 4h
            'statut' => 'EnCours',
            'created_by' => $admin->id,
        ]);

        $candidats3 = [
            [
                'nom' => 'Aïcha DJIBRIL',
                'programme' => "Votre déléguée engagée :\n\n• Être à votre écoute quotidiennement\n• Transmettre vos préoccupations à l'administration\n• Organiser des séances de révision collective\n• Faciliter l'accès aux anciens examens\n• Créer un groupe d'entraide\n\nDisponible et réactive !",
                'photo' => 'candidats/aicha_djibril.jpg',
            ],
            [
                'nom' => 'Yves TOSSOU',
                'programme' => "Mon rôle de délégué :\n\n• Communication transparente\n• Organisation d'événements de cohésion\n• Suivi des problèmes techniques (Wi-Fi, salles)\n• Médiation avec les enseignants\n• Coordination des projets de groupe\n\nTous ensemble pour une promo soudée !",
                'photo' => 'candidats/yves_tossou.jpg',
            ],
            [
                'nom' => 'Fatou KONE',
                'programme' => "Ma vision :\n\n• Représentation équitable de tous\n• Amélioration des conditions d'étude\n• Création d'un planning partagé\n• Gestion des conflits internes\n• Organisation de sorties pédagogiques\n\nEnsemble, réussissons cette année !",
                'photo' => 'candidats/fatou_kone.jpg',
            ],
        ];

        foreach ($candidats3 as $candidat) {
            Candidat::create(array_merge($candidat, ['election_id' => $election3->id]));
        }

        $this->command->info("✅ Élection '{$election3->titre}' créée avec " . count($candidats3) . " candidats");

        // ========================================
        // ÉLECTION 4 : Référendum (Exemple Brouillon)
        // ========================================

        $election4 = Election::create([
            'titre' => 'Référendum - Semestre en 3 blocs',
            'description' => 'Consultation des étudiants sur la proposition de réorganiser le semestre en 3 blocs de 5 semaines au lieu de 2 périodes de 8 semaines. Votez OUI pour approuver, NON pour maintenir le système actuel.',
            'date_debut' => Carbon::parse('2026-05-20 08:00:00'),
            'date_fin' => Carbon::parse('2026-05-21 20:00:00'),
            'statut' => 'Brouillon',
            'created_by' => $admin->id,
        ]);

        $candidats4 = [
            [
                'nom' => 'OUI - Pour le système en 3 blocs',
                'programme' => "Avantages du système en 3 blocs :\n\n✅ Révisions plus fréquentes et moins stressantes\n✅ Meilleure concentration sur moins de matières\n✅ Feedback plus rapide des enseignants\n✅ Possibilité de rattrapage entre les blocs\n✅ Rythme plus adapté à l'apprentissage\n\nAdopté avec succès dans plusieurs universités européennes.",
                'photo' => 'candidats/vote_oui.jpg',
            ],
            [
                'nom' => 'NON - Maintien du système actuel',
                'programme' => "Raisons de conserver le système actuel :\n\n✅ Système éprouvé et stable\n✅ Temps suffisant pour approfondir les matières\n✅ Évite la multiplication des examens\n✅ Compatibilité avec les standards internationaux\n✅ Pas de disruption du calendrier académique\n\nNe changeons pas un système qui fonctionne.",
                'photo' => 'candidats/vote_non.jpg',
            ],
        ];

        foreach ($candidats4 as $candidat) {
            Candidat::create(array_merge($candidat, ['election_id' => $election4->id]));
        }

        $this->command->info("✅ Élection '{$election4->titre}' créée avec " . count($candidats4) . " candidats");

        // ========================================
        // ÉLECTION 5 : Meilleur Projet de Fin d'Études
        // ========================================

        $election5 = Election::create([
            'titre' => 'Prix du Meilleur Projet de Fin d\'Études 2026',
            'description' => 'Vote pour élire le meilleur projet de fin d\'études parmi les 4 finalistes. Le projet gagnant sera présenté lors de la cérémonie de remise des diplômes et bénéficiera d\'un financement pour son développement.',
            'date_debut' => Carbon::parse('2026-06-01 10:00:00'),
            'date_fin' => Carbon::parse('2026-06-05 18:00:00'),
            'statut' => 'publiée',
            'created_by' => $admin->id,
        ]);

        $candidats5 = [
            [
                'nom' => 'AgriTech - Plateforme de conseil agricole par IA',
                'programme' => "Projet : Application mobile utilisant l'intelligence artificielle pour conseiller les agriculteurs.\n\nFonctionnalités :\n• Diagnostic des maladies des plantes par photo\n• Recommandations personnalisées d'engrais\n• Prévisions météo localisées\n• Marketplace de produits agricoles\n• Formation en ligne\n\nImpact : 500 agriculteurs testeurs, +30% de rendement moyen.",
                'photo' => 'candidats/agritech_project.jpg',
            ],
            [
                'nom' => 'MediCare - Gestion des dossiers médicaux',
                'programme' => "Projet : Système de gestion électronique des dossiers médicaux pour les centres de santé.\n\nFonctionnalités :\n• Centralisation des dossiers patients\n• Gestion des rendez-vous\n• Prescription électronique\n• Téléconsultation intégrée\n• Statistiques sanitaires\n\nImpact : Déployé dans 3 centres pilotes, 2000 patients enregistrés.",
                'photo' => 'candidats/medicare_project.jpg',
            ],
            [
                'nom' => 'EduLearn - E-learning adaptatif',
                'programme' => "Projet : Plateforme d'apprentissage en ligne avec parcours personnalisés.\n\nFonctionnalités :\n• IA d'adaptation au niveau de l'élève\n• Vidéos et quiz interactifs\n• Suivi de progression\n• Certification en ligne\n• Gamification\n\nImpact : 1500 utilisateurs, 85% de taux de complétion des cours.",
                'photo' => 'candidats/edulearn_project.jpg',
            ],
            [
                'nom' => 'GreenCity - Gestion intelligente des déchets',
                'programme' => "Projet : Application pour optimiser la collecte et le recyclage des déchets urbains.\n\nFonctionnalités :\n• Géolocalisation des points de collecte\n• Notifications de passage des camions\n• Système de récompenses pour le tri\n• Dashboard pour les municipalités\n• Sensibilisation environnementale\n\nImpact : Testé dans 2 quartiers, +40% de déchets recyclés.",
                'photo' => 'candidats/greencity_project.jpg',
            ],
        ];

        foreach ($candidats5 as $candidat) {
            Candidat::create(array_merge($candidat, ['election_id' => $election5->id]));
        }

        $this->command->info("✅ Élection '{$election5->titre}' créée avec " . count($candidats5) . " candidats");

        // ========================================
        // RÉSUMÉ
        // ========================================

        $this->command->newLine();
        $this->command->info('========================================');
        $this->command->info('📊 RÉSUMÉ DES ÉLECTIONS CRÉÉES');
        $this->command->info('========================================');

        $totalElections = Election::count();
        $totalCandidats = Candidat::count();

        $this->command->table(
            ['Statut', 'Nombre d\'élections'],
            [
                ['Brouillon', Election::where('statut', 'brouillon')->count()],
                ['Publiée', Election::where('statut', 'publie')->count()],
                ['En cours', Election::where('statut', 'en_cours')->count()],
                ['Clôturée', Election::where('statut', 'cloture')->count()],
                ['TOTAL', $totalElections],
            ]
        );

        $this->command->info("📦 Total candidats : {$totalCandidats}");
        $this->command->newLine();
        $this->command->info('✅ Production seeders exécutés avec succès !');
        $this->command->warn('⚠️  N\'oubliez pas de :');
        $this->command->warn('   1. Uploader les photos dans storage/app/public/candidats/');
        $this->command->warn('   2. Ou remplacer les chemins photos par des placeholders');
    }
}
