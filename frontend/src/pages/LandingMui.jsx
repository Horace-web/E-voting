import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import {
  HowToVote,
  Security,
  Speed,
  Assessment,
  ArrowForward,
  PersonAdd,
  FactCheck,
  Send,
  Mail,
  Shield,
  Group,
  TrendingUp,
  CheckCircle,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import LogoIcon from "../components/LogoIcon";
import { useAuth } from "../auth/AuthContext";

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "white",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: "none",
  fontWeight: 600,
  padding: "12px 24px",
}));

const PrimaryButton = styled(StyledButton)(({ theme }) => ({
  background: "linear-gradient(135deg, #1e3a5f 0%, #2a4a73 100%)",
  color: "white",
  "&:hover": {
    background: "linear-gradient(135deg, #16304d 0%, #1e3a5f 100%)",
  },
}));

const SecondaryButton = styled(StyledButton)(({ theme }) => ({
  border: "2px solid #e2e8f0",
  background: "white",
  color: "#475569",
  "&:hover": {
    background: "#f8fafc",
    borderColor: "#cbd5e1",
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: theme.spacing(2),
  transition: "all 0.3s ease",
  border: "1px solid #e2e8f0",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  background: "linear-gradient(135deg, #1e3a5f 0%, #2a4a73 100%)",
  color: "white",
  borderRadius: theme.spacing(2),
}));

const LandingMui = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [activeStep, setActiveStep] = useState(0);

  const handleProtectedNavigation = (e, targetPath) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      sessionStorage.setItem("redirectAfterLogin", targetPath);
      navigate("/login");
    }
  };

  const steps = [
    {
      label: "Inscrivez-vous",
      description: "Créez votre compte avec votre adresse email institutionnelle. Votre identité sera vérifiée automatiquement.",
      icon: <PersonAdd />,
    },
    {
      label: "Consultez les scrutins",
      description: "Accédez aux élections en cours et découvrez les candidats et leurs programmes.",
      icon: <FactCheck />,
    },
    {
      label: "Votez en toute confiance",
      description: "Exprimez votre choix de manière anonyme et sécurisée. Votre vote est chiffré et inviolable.",
      icon: <Send />,
    },
  ];

  const features = [
    {
      icon: <Security />,
      title: "Sécurisé",
      description: "Comptes créés par l'administration, activation par lien email et accès sécurisé par mot de passe.",
      color: "#e3f2fd",
      iconColor: "#1976d2",
    },
    {
      icon: <HowToVote />,
      title: "Anonyme",
      description: "Séparation complète entre l'identité du votant et son choix de vote.",
      color: "#e8f5e8",
      iconColor: "#388e3c",
    },
    {
      icon: <Speed />,
      title: "Rapide",
      description: "Votez en quelques clics depuis n'importe quel appareil connecté.",
      color: "#f3e5f5",
      iconColor: "#7b1fa2",
    },
    {
      icon: <Assessment />,
      title: "Transparent",
      description: "Résultats en temps réel et export des données pour audit.",
      color: "#fff3e0",
      iconColor: "#f57c00",
    },
  ];

  const stats = [
    { number: "5000+", label: "Votants inscrits", icon: <Group /> },
    { number: "50+", label: "Scrutins réalisés", icon: <HowToVote /> },
    { number: "99.9%", label: "Disponibilité", icon: <TrendingUp /> },
    { number: "100%", label: "Anonymat garanti", icon: <Shield /> },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Header */}
      <StyledAppBar elevation={0}>
        <Toolbar sx={{ maxWidth: "1200px", mx: "auto", width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, cursor: "pointer" }} onClick={() => navigate("/")}>
            <Avatar sx={{ bgcolor: "#1e3a5f", width: 40, height: 40 }}>
              <LogoIcon size={24} />
            </Avatar>
            <Typography variant="h6" sx={{ color: "#1e3a5f", fontWeight: "bold" }}>
              E-Vote
            </Typography>
          </Box>

          <Box sx={{ ml: "auto", display: { xs: "none", md: "flex" }, gap: 1 }}>
            <StyledButton onClick={(e) => handleProtectedNavigation(e, "/electeur")}>
              Accueil
            </StyledButton>
            <StyledButton onClick={(e) => handleProtectedNavigation(e, "/electeur/vote")}>
              Scrutins
            </StyledButton>
            <StyledButton onClick={(e) => handleProtectedNavigation(e, "/electeur/resultats")}>
              Résultats
            </StyledButton>
          </Box>

          {isAuthenticated ? (
            <PrimaryButton onClick={() => navigate(role === "admin" ? "/admin" : "/electeur")}>
              Mon espace
            </PrimaryButton>
          ) : (
            <SecondaryButton onClick={() => navigate("/login")}>
              Se connecter
            </SecondaryButton>
          )}
        </Toolbar>
      </StyledAppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box textAlign="center">
          <Chip
            icon={<HowToVote />}
            label="Plateforme de Vote Électronique Sécurisée"
            color="primary"
            sx={{ mb: 3, fontSize: "0.875rem" }}
          />
          
          <Typography
            variant="h2"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            sx={{ fontSize: { xs: "2.5rem", md: "4rem" } }}
          >
            Votez en toute{" "}
            <Typography component="span" color="#f59e0b">
              confiance
            </Typography>
            ,<br />
            en toute{" "}
            <Typography component="span" color="#f59e0b">
              simplicité
            </Typography>
          </Typography>
          
          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: "600px", mx: "auto", mb: 4 }}
          >
            Une plateforme moderne et sécurisée pour les élections internes de votre établissement.
            Vote anonyme, résultats transparents.
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <PrimaryButton
              size="large"
              onClick={(e) => handleProtectedNavigation(e, "/electeur/vote")}
              endIcon={<ArrowForward />}
            >
              Voir les scrutins
            </PrimaryButton>
            
            {isAuthenticated ? (
              <SecondaryButton
                size="large"
                onClick={() => navigate(role === "admin" ? "/admin" : "/electeur")}
              >
                Mon espace
              </SecondaryButton>
            ) : (
              <SecondaryButton
                size="large"
                onClick={() => navigate("/login")}
              >
                Se connecter
              </SecondaryButton>
            )}
          </Box>
        </Box>
      </Container>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: "linear-gradient(135deg, #1e3a5f 0%, #2a4a73 100%)" }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <StatsCard elevation={0}>
                  <Box sx={{ color: "white", mb: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {stat.label}
                  </Typography>
                </StatsCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Pourquoi choisir E-Vote ?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "700px", mx: "auto" }}>
            Une solution complète qui répond à toutes les exigences de sécurité et de transparence
            pour vos élections internes.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard elevation={2}>
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <Avatar sx={{ bgcolor: feature.color, width: 56, height: 56, mx: "auto", mb: 2 }}>
                    <Box sx={{ color: feature.iconColor }}>{feature.icon}</Box>
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How it Works Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "linear-gradient(135deg, #1e3a5f 0%, #2a4a73 100%)" }}>
        <Container maxWidth="md">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight="bold" color="white" gutterBottom>
              Comment ça marche ?
            </Typography>
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.9)" }}>
              Un processus simple et sécurisé en 3 étapes
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel
                  onClick={() => setActiveStep(index)}
                  sx={{ cursor: "pointer", "& .MuiStepLabel-label": { color: "white" } }}
                >
                  <Typography variant="h6" fontWeight="bold" color="white">
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Paper sx={{ p: 3, bgcolor: "white", borderRadius: 2 }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                      <Avatar sx={{ bgcolor: "#1e3a5f" }}>
                        {step.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Étape {index + 1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {step.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Box textAlign="center">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Prêt à participer ?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Connectez-vous avec votre adresse email institutionnelle pour accéder aux scrutins qui
            vous concernent et exercer votre droit de vote.
          </Typography>
          
          {isAuthenticated ? (
            <PrimaryButton
              size="large"
              onClick={() => navigate(role === "admin" ? "/admin" : "/electeur")}
              endIcon={<ArrowForward />}
            >
              Mon espace
            </PrimaryButton>
          ) : (
            <PrimaryButton
              size="large"
              onClick={() => navigate("/login")}
              endIcon={<ArrowForward />}
            >
              Se connecter maintenant
            </PrimaryButton>
          )}
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: "linear-gradient(135deg, #1e3a5f 0%, #2a4a73 100%)", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: "#1e3a5f", width: 40, height: 40 }}>
                  <LogoIcon size={24} />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  E-Vote
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                Plateforme de vote électronique sécurisée pour les élections internes universitaires
                et associatives.
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Chip icon={<Shield />} label="Sécurisé" size="small" sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                <Chip icon={<HowToVote />} label="Anonyme" size="small" sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Navigation
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.9, cursor: "pointer", "&:hover": { opacity: 1 } }}>
                  Accueil
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, cursor: "pointer", "&:hover": { opacity: 1 } }}>
                  Scrutins en cours
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, cursor: "pointer", "&:hover": { opacity: 1 } }}>
                  Résultats
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Contact
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Mail fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  support@evote.edu
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                En cas de problème technique, contactez l'administrateur.
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, pt: 4, borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2026 E-Vote. Tous droits réservés.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Projet tuteuré - Système de Vote Électronique Sécurisé
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingMui;
