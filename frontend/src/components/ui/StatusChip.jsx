import Chip from "@mui/material/Chip";

/**
 * Composant StatusChip pour afficher les statuts d'élections
 */
function StatusChip({ status, size = "medium" }) {
  const statusConfig = {
    Brouillon: {
      color: "default",
      label: "Brouillon",
    },
    Publiée: {
      color: "info",
      label: "Publiée",
    },
    EnCours: {
      color: "success",
      label: "En cours",
    },
    Clôturée: {
      color: "warning",
      label: "Clôturée",
    },
    Archivée: {
      color: "default",
      label: "Archivée",
    },
    Actif: {
      color: "success",
      label: "Actif",
    },
    Inactif: {
      color: "default",
      label: "Inactif",
    },
  };

  const config = statusConfig[status] || {
    color: "default",
    label: status,
  };

  return <Chip label={config.label} color={config.color} size={size} sx={{ fontWeight: 600 }} />;
}

export default StatusChip;
