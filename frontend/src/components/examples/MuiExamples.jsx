import { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Avatar,
  Alert,
  Snackbar,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import { Vote, User, Calendar, Check, X as XIcon, AlertCircle } from "lucide-react";
import MuiButton from "../ui/MuiButton";
import MuiDialog from "../ui/MuiDialog";
import { MuiTextField, MuiSelect, MuiCheckbox } from "../ui/MuiForm";

/**
 * Exemples d'utilisation des composants MUI dans E-Vote
 *
 * Ce fichier montre comment utiliser tous les composants MUI
 * de manière pratique dans votre projet.
 */

function MuiExamples() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 4, color: "#1e3a5f", fontWeight: 700 }}>
        Exemples de composants MUI pour E-Vote
      </Typography>

      {/* 1. BOUTONS */}
      <Card sx={{ mb: 4, borderRadius: "1rem", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: "#1e3a5f", fontWeight: 600 }}>
            1. Boutons
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
            <MuiButton variant="contained" color="primary" startIcon={<Vote size={20} />}>
              Voter maintenant
            </MuiButton>
            <MuiButton variant="contained" color="secondary" startIcon={<User size={20} />}>
              Mon profil
            </MuiButton>
            <MuiButton variant="outlined" color="primary">
              Annuler
            </MuiButton>
            <MuiButton variant="text" color="error" startIcon={<XIcon size={20} />}>
              Supprimer
            </MuiButton>
          </Stack>
        </CardContent>
      </Card>

      {/* 2. DIALOGUE / MODAL */}
      <Card sx={{ mb: 4, borderRadius: "1rem", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: "#1e3a5f", fontWeight: 600 }}>
            2. Dialogue modal
          </Typography>
          <MuiButton variant="contained" onClick={() => setDialogOpen(true)}>
            Ouvrir le dialogue
          </MuiButton>

          <MuiDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            title="Confirmer votre vote"
            actions={
              <>
                <MuiButton variant="text" onClick={() => setDialogOpen(false)}>
                  Annuler
                </MuiButton>
                <MuiButton
                  variant="contained"
                  onClick={() => {
                    setDialogOpen(false);
                    setSnackbarOpen(true);
                  }}
                >
                  Confirmer
                </MuiButton>
              </>
            }
          >
            <Typography sx={{ mb: 2 }}>
              Êtes-vous sûr de vouloir voter pour ce candidat ?
            </Typography>
            <Alert severity="info" icon={<AlertCircle size={20} />}>
              Cette action est irréversible. Votre vote sera enregistré de manière anonyme.
            </Alert>
          </MuiDialog>
        </CardContent>
      </Card>

      {/* 3. FORMULAIRES */}
      <Card sx={{ mb: 4, borderRadius: "1rem", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: "#1e3a5f", fontWeight: 600 }}>
            3. Formulaires
          </Typography>
          <Stack spacing={3}>
            <MuiTextField
              label="Titre de l'élection"
              placeholder="Ex: Élection du délégué de classe"
              fullWidth
              required
            />

            <MuiTextField
              label="Description"
              placeholder="Décrivez l'élection..."
              multiline
              rows={4}
              fullWidth
            />

            <MuiTextField
              label="Date de clôture"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <MuiCheckbox
              label="J'accepte les conditions générales"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* 4. CHIPS & AVATARS */}
      <Card sx={{ mb: 4, borderRadius: "1rem", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: "#1e3a5f", fontWeight: 600 }}>
            4. Chips & Avatars (Badges de statut)
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
            <Chip
              label="En cours"
              color="success"
              icon={<Check size={18} />}
              sx={{ fontWeight: 600 }}
            />
            <Chip label="Clôturée" color="warning" sx={{ fontWeight: 600 }} />
            <Chip label="Brouillon" color="default" sx={{ fontWeight: 600 }} />
            <Chip
              avatar={<Avatar>JD</Avatar>}
              label="Jean Dupont"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* 5. ALERTS */}
      <Card sx={{ mb: 4, borderRadius: "1rem", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: "#1e3a5f", fontWeight: 600 }}>
            5. Alertes et notifications
          </Typography>
          <Stack spacing={2}>
            <Alert severity="success" icon={<Check size={20} />}>
              Votre vote a été enregistré avec succès !
            </Alert>
            <Alert severity="error" icon={<XIcon size={20} />}>
              Erreur : Vous avez déjà voté pour cette élection.
            </Alert>
            <Alert severity="warning" icon={<AlertCircle size={20} />}>
              Attention : Cette élection se termine dans 2 heures.
            </Alert>
            <Alert severity="info" icon={<Vote size={20} />}>
              3 nouvelles élections disponibles pour voter.
            </Alert>
          </Stack>
        </CardContent>
      </Card>

      {/* 6. CARD ÉLECTION */}
      <Card sx={{ mb: 4, borderRadius: "1rem", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: "#1e3a5f", fontWeight: 600 }}>
            6. Card d'élection (exemple complet)
          </Typography>

          <Card sx={{ borderRadius: "0.75rem", border: "1px solid #e5e7eb" }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e3a5f" }}>
                    Élection du Délégué de Classe L3 Info
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    <Calendar size={16} style={{ display: "inline", marginRight: 4 }} />
                    Du 28 Jan au 05 Fév 2026
                  </Typography>
                </Box>
                <Chip label="En cours" color="success" size="small" />
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Élisez votre représentant de classe pour l'année universitaire 2025-2026.
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Chip label="156 votes" size="small" variant="outlined" icon={<Vote size={14} />} />
                <Chip
                  label="5 candidats"
                  size="small"
                  variant="outlined"
                  icon={<User size={14} />}
                />
              </Stack>
            </CardContent>
            <CardActions sx={{ borderTop: "1px solid #e5e7eb", px: 2, py: 1.5 }}>
              <MuiButton variant="contained" size="small" startIcon={<Vote size={18} />}>
                Voter
              </MuiButton>
              <MuiButton variant="outlined" size="small">
                Voir les détails
              </MuiButton>
            </CardActions>
          </Card>
        </CardContent>
      </Card>

      {/* Snackbar (notification toast) */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%", borderRadius: "0.5rem" }}
        >
          Vote confirmé avec succès !
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MuiExamples;
