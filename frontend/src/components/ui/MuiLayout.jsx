import {
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Container personnalisé avec espacement cohérent
export const MuiContainer = styled(Container)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

// Grid personnalisé pour les layouts
export const MuiGridContainer = styled(Grid)(({ theme }) => ({
  alignItems: 'stretch',
  '& > *': {
    height: '100%',
  },
}));

// Paper avec elevation personnalisée
export const MuiPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid rgba(0,0,0,0.06)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  },
}));

// Card avec styling E-Vote
export const MuiCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  },
}));

// CardContent avec padding optimisé
export const MuiCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
}));

// Section container pour les pages
export const MuiSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 0),
  },
}));

// Box pour les hero sections
export const MuiHeroBox = styled(Box)(({ theme }) => ({
  minHeight: '60vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: theme.spacing(4, 0),
}));

// Stack pour les formulaires
export const MuiFormStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(3),
  maxWidth: 500,
  margin: '0 auto',
}));

// Divider personnalisé
export const MuiDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  borderColor: 'rgba(0,0,0,0.08)',
}));

// Box pour les stats
export const MuiStatsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(135deg, #1e3a5f 0%, #2a4a73 100%)',
  color: 'white',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

// Layout principal pour les pages
export const MuiPageLayout = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
}));

// Box pour les features
export const MuiFeatureBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  height: '100%',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  },
}));

// Container pour les formulaires centrés
export const MuiFormContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
}));

// Box pour les headers de section
export const MuiSectionHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4),
  },
}));

// Grid pour les cards
export const MuiCardGrid = styled(Grid)(({ theme }) => ({
  spacing: theme.spacing(4),
  '& .MuiGrid-item': {
    display: 'flex',
  },
}));

export default {
  MuiContainer,
  MuiGridContainer,
  MuiPaper,
  MuiCard,
  MuiCardContent,
  MuiSection,
  MuiHeroBox,
  MuiFormStack,
  MuiDivider,
  MuiStatsBox,
  MuiPageLayout,
  MuiFeatureBox,
  MuiFormContainer,
  MuiSectionHeader,
  MuiCardGrid,
};
