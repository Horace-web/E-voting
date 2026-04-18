import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  Security,
  VerifiedUser,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Header from "../components/Header";
import { useAuth } from "../auth/AuthContext";
import authService from "../services/auth.service";
import config from "../config/app.config";

// Thème personnalisé E-Vote
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
  display: "flex",
  flexDirection: "column",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
  background: "white",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: "none",
  fontWeight: 600,
  padding: "12px 24px",
  background: "linear-gradient(135deg, #1e3a5f 0%, #2a4a73 100%)",
  "&:hover": {
    background: "linear-gradient(135deg, #16304d 0%, #1e3a5f 100%)",
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  height: "100%",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const LoginMui = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "L'adresse email est requise";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "L'adresse email n'est pas valide";
    }

    if (!password.trim()) {
      newErrors.password = "Le mot de passe est requis";
    } else if (password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      let userData;
      let role;

      if (config.useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("[MOCK] Connexion:", email);

        userData = {
          id: 1,
          firstName: "Jean",
          lastName: "Dupont",
          email: email,
        };

        role = email.includes("admin") ? "admin" : "voter";
      } else {
        const response = await authService.login(email, password);
        console.log("========================================");
        console.log("RÉPONSE BACKEND:", response);
        console.log("User:", response.user);
        console.log("Role reçu:", response.user.role);
        console.log("========================================");
        userData = response.user;

        let roleRaw = response.user.role?.code || response.user.role || "voter";
        role = roleRaw.toLowerCase();

        console.log("Role final (normalisé):", role);
      }

      login(userData, role);

      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      sessionStorage.removeItem("redirectAfterLogin");

      console.log("REDIRECTION - Role:", role);
      if (role === "admin") {
        console.log("→ /admin");
        navigate("/admin");
      } else if (redirectPath && redirectPath.startsWith("/electeur")) {
        console.log("→ redirectPath:", redirectPath);
        navigate(redirectPath);
      } else {
        console.log("→ /electeur (défaut)");
        navigate("/electeur");
      }
    } catch (error) {
      console.error("Erreur connexion:", error);

      if (error.response?.status === 403) {
        setErrors({
          general:
            "Votre compte n'est pas encore activé. Veuillez confirmer votre inscription via le lien envoyé par email.",
        });
      } else if (error.response?.status === 401) {
        setErrors({
          general: "Email ou mot de passe incorrect",
        });
      } else {
        setErrors({
          general: error.response?.data?.message || "Erreur lors de la connexion",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="xl">
      {/* Header */}
      <Header showNav={true} />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Section - Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" fontWeight="bold" color="text.primary" gutterBottom>
                Accédez à vos scrutins
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Connectez-vous en toute sécurité avec votre email et mot de passe reçus par email.
              </Typography>
            </Box>

            {/* Features Cards */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <FeatureCard elevation={2}>
                <CardContent sx={{ display: "flex", gap: 3, p: 3 }}>
                  <Avatar sx={{ bgcolor: "#e3f2fd", width: 56, height: 56 }}>
                    <Shield sx={{ color: "#1976d2", fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Authentification sécurisée
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mot de passe haché avec bcrypt (cost=10)
                    </Typography>
                  </Box>
                </CardContent>
              </FeatureCard>

              <FeatureCard elevation={2}>
                <CardContent sx={{ display: "flex", gap: 3, p: 3 }}>
                  <Avatar sx={{ bgcolor: "#e8f5e8", width: 56, height: 56 }}>
                    <Security sx={{ color: "#388e3c", fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Données protégées
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chiffrement de bout en bout pour vos informations
                    </Typography>
                  </Box>
                </CardContent>
              </FeatureCard>

              <FeatureCard elevation={2}>
                <CardContent sx={{ display: "flex", gap: 3, p: 3 }}>
                  <Avatar sx={{ bgcolor: "#fff3e0", width: 56, height: 56 }}>
                    <CheckCircle sx={{ color: "#f57c00", fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Confirmation par email
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Activation du compte après confirmation (lien valide 48h)
                    </Typography>
                  </Box>
                </CardContent>
              </FeatureCard>
            </Box>
          </Grid>

          {/* Right Section - Login Form */}
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={8}>
              {/* Icon */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Avatar sx={{ bgcolor: "#1e3a5f", width: 64, height: 64 }}>
                  <Mail sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>

              {/* Title */}
              <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                Connexion
              </Typography>
              <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                Entrez vos identifiants reçus par email
              </Typography>

              {/* Error Alert */}
              {errors.general && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errors.general}
                </Alert>
              )}

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Adresse email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: "", general: "" });
                  }}
                  placeholder="votant@universite.bj"
                  disabled={isLoading}
                  error={!!errors.email}
                  helperText={errors.email}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail color="action.active" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "", general: "" });
                  }}
                  placeholder="Entrez votre mot de passe"
                  disabled={isLoading}
                  error={!!errors.password}
                  helperText={errors.password}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action.active" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          edge="end"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, mb: 3 }}>
                  <Button
                    variant="text"
                    onClick={() => navigate("/forgot-password")}
                    sx={{ textTransform: "none", color: "#1e3a5f" }}
                  >
                    Mot de passe oublié ?
                  </Button>
                </Box>

                {/* Submit Button */}
                <StyledButton
                  type="submit"
                  fullWidth
                  size="large"
                  disabled={isLoading}
                  endIcon={<ArrowRight />}
                  sx={{ mb: 3 }}
                >
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </StyledButton>
              </Box>

              {/* Footer Info */}
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Vous n'avez pas encore confirmé votre inscription ?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Vérifiez vos emails (lien valide 48h)
                </Typography>
                <Chip
                  label="Support: support@evote.edu"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2, color: "#1e3a5f", borderColor: "#1e3a5f" }}
                />
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </StyledContainer>
  );
};

export default LoginMui;
