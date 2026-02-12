import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { X } from 'lucide-react';
import MuiButton from './MuiButton';

/**
 * Dialogue modal personnalisé pour E-Vote
 * 
 * Exemple d'utilisation :
 * 
 * const [open, setOpen] = useState(false);
 * 
 * <MuiDialog
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   title="Confirmer votre vote"
 *   actions={
 *     <>
 *       <MuiButton variant="text" onClick={() => setOpen(false)}>
 *         Annuler
 *       </MuiButton>
 *       <MuiButton variant="contained" onClick={handleConfirm}>
 *         Confirmer
 *       </MuiButton>
 *     </>
 *   }
 * >
 *   <p>Êtes-vous sûr de vouloir voter pour ce candidat ?</p>
 * </MuiDialog>
 */

function MuiDialog({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#1e3a5f',
          borderBottom: '1px solid #e5e7eb',
          pb: 2,
        }}
      >
        {title}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: '#6b7280',
            '&:hover': { color: '#1e3a5f', backgroundColor: '#f3f4f6' },
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {children}
      </DialogContent>

      {actions && (
        <DialogActions
          sx={{
            borderTop: '1px solid #e5e7eb',
            px: 3,
            py: 2,
            gap: 1,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}

export default MuiDialog;
