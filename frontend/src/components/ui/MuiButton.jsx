import { Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * Bouton personnalisé E-Vote avec les couleurs du projet
 * 
 * Exemples d'utilisation :
 * 
 * <MuiButton variant="contained" color="primary">
 *   Se connecter
 * </MuiButton>
 * 
 * <MuiButton variant="outlined" color="secondary" startIcon={<Vote />}>
 *   Voter
 * </MuiButton>
 * 
 * <MuiButton variant="text" onClick={handleClick}>
 *   Annuler
 * </MuiButton>
 */

// Bouton stylé avec les couleurs E-Vote
const MuiButton = styled(Button)(({ theme }) => ({
  borderRadius: '0.5rem', // rounded-lg
  textTransform: 'none', // Pas de MAJUSCULES automatiques
  fontWeight: 600, // font-semibold
  padding: '0.75rem 1.5rem', // py-3 px-6
  
  '&.MuiButton-containedPrimary': {
    background: '#1e3a5f',
    '&:hover': {
      background: '#16304d',
    },
  },
  
  '&.MuiButton-containedSecondary': {
    background: 'linear-gradient(to right, #f59e0b, #d97706)',
    '&:hover': {
      background: 'linear-gradient(to right, #d97706, #b45309)',
    },
  },
  
  '&.MuiButton-outlined': {
    borderWidth: '2px',
    '&:hover': {
      borderWidth: '2px',
    },
  },
}));

// Bouton icône circulaire
const MuiIconButton = styled(IconButton)({
  borderRadius: '0.5rem',
  '&:hover': {
    backgroundColor: 'rgba(30, 58, 95, 0.1)',
  },
});

export { MuiButton, MuiIconButton };
export default MuiButton;
