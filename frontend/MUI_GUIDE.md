# Guide d'utilisation des composants Material-UI dans E-Vote

Ce guide vous montre comment utiliser les composants MUI personnalisés créés pour votre projet.

## 📁 Structure des fichiers

```
src/components/
├── ui/
│   ├── MuiButton.jsx      # Boutons personnalisés
│   ├── MuiDialog.jsx      # Dialogues/Modals
│   └── MuiForm.jsx        # Formulaires (TextField, Select, Checkbox, Radio)
└── examples/
    └── MuiExamples.jsx    # Page d'exemples complète
```

## 🎨 1. Boutons (MuiButton)

### Import
```jsx
import MuiButton from '@/components/ui/MuiButton';
```

### Utilisation
```jsx
// Bouton principal
<MuiButton variant="contained" color="primary">
  Se connecter
</MuiButton>

// Bouton avec icône
<MuiButton variant="contained" startIcon={<Vote />}>
  Voter maintenant
</MuiButton>

// Bouton secondaire
<MuiButton variant="outlined" color="primary">
  Annuler
</MuiButton>

// Bouton texte
<MuiButton variant="text" onClick={handleClick}>
  Voir plus
</MuiButton>
```

### Props disponibles
- `variant`: "contained" | "outlined" | "text"
- `color`: "primary" | "secondary" | "error" | "success"
- `startIcon`: Icône au début
- `endIcon`: Icône à la fin
- `disabled`: Désactiver le bouton
- `onClick`: Fonction au clic

## 💬 2. Dialogues (MuiDialog)

### Import
```jsx
import MuiDialog from '@/components/ui/MuiDialog';
import { useState } from 'react';
```

### Utilisation
```jsx
function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <MuiButton onClick={() => setOpen(true)}>
        Ouvrir
      </MuiButton>

      <MuiDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Confirmer votre vote"
        actions={
          <>
            <MuiButton variant="text" onClick={() => setOpen(false)}>
              Annuler
            </MuiButton>
            <MuiButton variant="contained" onClick={handleConfirm}>
              Confirmer
            </MuiButton>
          </>
        }
      >
        <p>Êtes-vous sûr de vouloir voter pour ce candidat ?</p>
      </MuiDialog>
    </>
  );
}
```

### Props disponibles
- `open`: boolean - État d'ouverture
- `onClose`: function - Fonction de fermeture
- `title`: string - Titre du dialogue
- `children`: React.Node - Contenu du dialogue
- `actions`: React.Node - Boutons d'action
- `maxWidth`: "xs" | "sm" | "md" | "lg" | "xl"
- `fullWidth`: boolean

## 📝 3. Formulaires (MuiForm)

### Import
```jsx
import { 
  MuiTextField, 
  MuiSelect, 
  MuiCheckbox, 
  MuiRadioGroup 
} from '@/components/ui/MuiForm';
```

### TextField
```jsx
<MuiTextField
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={!!errors.email}
  helperText={errors.email}
  required
  fullWidth
/>

// TextField multiline
<MuiTextField
  label="Description"
  multiline
  rows={4}
  fullWidth
/>
```

### Select
```jsx
import { MenuItem } from '@mui/material';

<MuiFormControl fullWidth>
  <InputLabel>Statut</InputLabel>
  <MuiSelect value={status} onChange={(e) => setStatus(e.target.value)}>
    <MenuItem value="active">Actif</MenuItem>
    <MenuItem value="closed">Clôturé</MenuItem>
    <MenuItem value="draft">Brouillon</MenuItem>
  </MuiSelect>
</MuiFormControl>
```

### Checkbox
```jsx
<MuiCheckbox
  label="J'accepte les conditions"
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
/>
```

### RadioGroup
```jsx
<MuiRadioGroup
  label="Choisissez une option"
  value={choice}
  onChange={(e) => setChoice(e.target.value)}
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
/>
```

## 🎯 4. Autres composants MUI utiles

### Chips (badges de statut)
```jsx
import { Chip } from '@mui/material';

<Chip label="En cours" color="success" />
<Chip label="Clôturée" color="warning" />
<Chip label="Brouillon" color="default" />
```

### Alerts
```jsx
import { Alert } from '@mui/material';

<Alert severity="success">Vote enregistré avec succès !</Alert>
<Alert severity="error">Une erreur s'est produite</Alert>
<Alert severity="warning">Attention : délai expiré</Alert>
<Alert severity="info">3 nouvelles élections disponibles</Alert>
```

### Snackbar (notifications toast)
```jsx
import { Snackbar, Alert } from '@mui/material';

const [open, setOpen] = useState(false);

<Snackbar
  open={open}
  autoHideDuration={4000}
  onClose={() => setOpen(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
>
  <Alert severity="success">
    Opération réussie !
  </Alert>
</Snackbar>
```

### Cards
```jsx
import { Card, CardContent, CardActions, Typography } from '@mui/material';

<Card sx={{ borderRadius: '1rem', boxShadow: 3 }}>
  <CardContent>
    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a5f' }}>
      Titre de la card
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Contenu de la card
    </Typography>
  </CardContent>
  <CardActions>
    <MuiButton variant="contained">Action</MuiButton>
  </CardActions>
</Card>
```

## 🎨 5. Icônes MUI vs Lucide

Vous pouvez utiliser les deux bibliothèques d'icônes :

### Lucide React (déjà utilisé)
```jsx
import { Vote, User, Calendar } from 'lucide-react';

<Vote size={20} />
```

### MUI Icons
```jsx
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

<HowToVoteIcon />
```

## 📱 6. Voir la page d'exemples

Pour voir tous les composants en action, ajoutez cette route dans votre application :

1. Dans `src/routes/AppRoutes.jsx`, ajoutez :
```jsx
import MuiExamples from '../components/examples/MuiExamples';

// Dans vos routes
<Route path="/mui-examples" element={<MuiExamples />} />
```

2. Visitez : `http://localhost:5173/mui-examples`

## 🎨 7. Personnalisation des styles

Tous les composants utilisent le système `sx` de MUI pour les styles :

```jsx
<MuiButton
  sx={{
    borderRadius: '1rem',
    padding: '1rem 2rem',
    fontSize: '1.125rem',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  }}
>
  Bouton stylé
</MuiButton>
```

## 🔧 8. Intégration avec Tailwind

Les composants MUI fonctionnent **en parallèle** avec Tailwind :

- Utilisez Tailwind pour le layout général (grids, flexbox, spacing)
- Utilisez MUI pour les composants interactifs (forms, dialogs, buttons)

```jsx
<div className="grid grid-cols-3 gap-4 p-6">
  <MuiButton variant="contained">Bouton 1</MuiButton>
  <MuiButton variant="contained">Bouton 2</MuiButton>
  <MuiButton variant="contained">Bouton 3</MuiButton>
</div>
```

## ✅ Avantages de cette approche

1. **Pas de conflit** : Le ThemeProvider MUI ne charge pas CssBaseline
2. **Meilleur des deux mondes** : Tailwind pour le layout, MUI pour les composants
3. **Cohérence visuelle** : Tous les composants MUI respectent les couleurs E-Vote
4. **Réutilisabilité** : Composants prêts à l'emploi et personnalisables

## 🚀 Prochaines étapes

1. Consultez `/mui-examples` pour voir tous les exemples
2. Copiez/adaptez les composants selon vos besoins
3. Créez vos propres composants MUI personnalisés en suivant les mêmes patterns

Bon développement ! 🎉
