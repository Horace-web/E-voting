import { Routes, Route, Navigate } from "react-router-dom";
import ElecteurDashboardNew from "./electeur/ElecteurDashboardNew";
import ElecteurVoteNew from "./electeur/ElecteurVoteNew";
import ElecteurResultats from "./electeur/ElecteurResultats";
import ElecteurParticipationsNew from "./electeur/ElecteurParticipationsNew";

const ElecteurSpace = () => {
  return (
    <Routes>
      <Route index element={<ElecteurDashboardNew />} />
      <Route path="vote" element={<ElecteurVoteNew />} />
      <Route path="vote/:electionId" element={<ElecteurVoteNew />} />
      <Route path="resultats" element={<ElecteurResultats />} />
      <Route path="resultats/:electionId" element={<ElecteurResultats />} />
      <Route path="participations" element={<ElecteurParticipationsNew />} />
      <Route path="*" element={<Navigate to="/electeur" replace />} />
    </Routes>
  );
};

export default ElecteurSpace;
