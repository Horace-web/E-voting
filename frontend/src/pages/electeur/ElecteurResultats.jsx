import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ElecteurLayout from "../../components/ElecteurLayout";
import { BarChart3, Trophy, Users, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import electionService from "../../services/election.service";
import resultService from "../../services/result.service";
import { normalizeApiResponse } from "../../utils/api-utils";

const normalizeElection = (e) => ({
  id: String(e.id),
  titre: e.titre || "Sans titre",
  dateCloture: e.date_fin || e.date_cloture || "",
  statut: e.statut || "",
  totalElecteurs: e.total_electeurs || 0,
  totalVotes: e.total_votes || 0,
});

const ElecteurResultats = () => {
  const { electionId } = useParams();
  const [elections, setElections] = useState([]);
  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadElections = async () => {
      try {
        setLoading(true);
        const response = await electionService.getAll();
        const list = normalizeApiResponse(response);
        setElections(list.map(normalizeElection));
      } catch (error) {
        console.error("Erreur chargement elections resultat:", error);
        setElections([]);
      } finally {
        setLoading(false);
      }
    };

    loadElections();
  }, []);

  useEffect(() => {
    const loadResults = async () => {
      if (!electionId) return;

      try {
        const response = await resultService.getByElection(electionId);
        const list = normalizeApiResponse(response);
        setResultats(list);
      } catch (error) {
        console.error("Erreur chargement resultats:", error);
        setResultats([]);
      }
    };

    loadResults();
  }, [electionId]);

  const closedElections = useMemo(
    () => elections.filter((e) => ["Cloturee", "Clôturée", "Terminee"].includes(e.statut)),
    [elections]
  );

  if (!electionId) {
    return (
      <ElecteurLayout>
        <div className="space-y-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#1e3a5f] via-[#2a4a73] to-[#1e3a5f] rounded-2xl p-8 text-white">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-[#f59e0b]" />
                <span className="text-[#f59e0b] font-medium text-sm">Resultats</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Resultats des elections</h1>
              <p className="text-white/70">Consultez les elections cloturees</p>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center text-gray-500">
              Chargement...
            </div>
          ) : closedElections.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Aucun resultat disponible</h2>
              <p className="text-gray-500">Les resultats seront affiches apres cloture.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {closedElections.map((election) => (
                <Link
                  key={election.id}
                  to={`/electeur/resultats/${election.id}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="h-1.5 bg-gradient-to-r from-[#f59e0b] to-[#d97706]" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#1e3a5f] transition-colors">
                      {election.titre}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 inline-flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Cloturee le {election.dateCloture ? new Date(election.dateCloture).toLocaleDateString("fr-FR") : "-"}
                    </p>
                    <div className="flex items-center justify-between text-[#1e3a5f] font-semibold">
                      <span>Voir les details</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </ElecteurLayout>
    );
  }

  const election = elections.find((e) => e.id === String(electionId));

  return (
    <ElecteurLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/electeur/resultats"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-[#1e3a5f] hover:border-[#1e3a5f] transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{election?.titre || "Resultats"}</h1>
            <p className="text-gray-500 text-sm">Classement des candidats</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Electeurs inscrits</p>
            <p className="text-2xl font-bold text-[#1e3a5f] mt-1">{election?.totalElecteurs || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Votes exprimes</p>
            <p className="text-2xl font-bold text-[#d97706] mt-1">{election?.totalVotes || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Participation</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {election?.totalElecteurs
                ? `${Math.round(((election.totalVotes || 0) / election.totalElecteurs) * 100)}%`
                : "0%"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {resultats.length === 0 ? (
            <p className="text-gray-500">Aucun resultat detaille disponible.</p>
          ) : (
            <div className="space-y-3">
              {resultats.map((r, idx) => (
                <div
                  key={r.candidat_id || idx}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{r.nom || "Candidat"}</p>
                      <p className="text-xs text-gray-500">{r.voix || 0} voix</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#1e3a5f]">{r.pourcentage || 0}%</p>
                    {idx === 0 && (
                      <p className="text-xs text-[#d97706] inline-flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> Gagnant
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ElecteurLayout>
  );
};

export default ElecteurResultats;
