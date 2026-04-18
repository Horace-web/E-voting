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
  Avatar,
} from "@mui/material";
import {
  Mail,
  Lock,
  ArrowRight,
  Visibility,
  VisibilityOff,
  ShieldOutlined,
  LockOutlined,
  CheckCircleOutline,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Header from "../components/Header";
import { useAuth } from "../auth/AuthContext";
import authService from "../services/auth.service";

const StyledContainer = styled(Container)({
  minHeight: "100vh",
  background: "#f3f4f6",
  display: "flex",
  flexDirection: "column",
});

const StyledPaper = styled(Paper)({
  padding: "32px",
  borderRadius: "18px",
  boxShadow: "0 8px 28px rgba(15, 23, 42, 0.08)",
  background: "#ffffff",
});

const StyledButton = styled(Button)({
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 700,
  color: "#ffffff",
  padding: "12px 24px",
  background: "#173a63",
  boxShadow: "0 6px 18px rgba(23, 58, 99, 0.28)",
  "&:hover": {
    background: "#0f2f54",
  },
});

const Login = () => {
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
      newErrors.password = "Le mot de passe doit contenir au moins 6 caracteres";
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
      const response = await authService.login(email, password);
      const role = String(response?.user?.role || "").toUpperCase();
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      sessionStorage.removeItem("redirectAfterLogin");

      login(response.user, role);

      if (role === "ADMIN") {
        window.location.assign("/admin");
      } else if (role === "AUDITOR") {
        window.location.assign("/admin/audit");
      } else if (redirectPath && redirectPath.startsWith("/electeur")) {
        window.location.assign(redirectPath);
      } else if (role === "VOTER") {
        window.location.assign("/electeur");
      } else {
        window.location.assign("/");
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setErrors({
          general:
            "Votre compte n'est pas encore active. Veuillez confirmer votre inscription via le lien envoye par email.",
        });
      } else if (error.response?.status === 401 || error.response?.status === 422) {
        setErrors({
          general: "Email ou mot de passe incorrect.",
        });
      } else {
        setErrors({
          general: error.response?.data?.message || "Erreur lors de la connexion.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="xl">
      <Header showNav={true} />

      <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 3, md: 6 } }}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <Box sx={{ color: "#1e3a5f", pr: { md: 2 } }}>
              <Typography variant="h3" fontWeight="bold" color="text.primary" gutterBottom sx={{ fontSize: { xs: "2rem", md: "3.1rem" } }}>
                Accedez a vos scrutins
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ mb: 3, lineHeight: 1.45 }}>
                Connectez-vous en toute securite avec votre email et mot de passe recus par email.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.4 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: 2,
                      bgcolor: "#dbeafe",
                      color: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ShieldOutlined />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.02rem", color: "#0f172a" }}>
                      Authentification securisee
                    </Typography>
                    <Typography sx={{ color: "#475569", fontSize: "0.98rem" }}>
                      Mot de passe hache avec bcrypt (cost=10)
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: 2,
                      bgcolor: "#dcfce7",
                      color: "#16a34a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <LockOutlined />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.02rem", color: "#0f172a" }}>
                      Donnees protegees
                    </Typography>
                    <Typography sx={{ color: "#475569", fontSize: "0.98rem" }}>
                      Chiffrement de bout en bout pour vos informations
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: 2,
                      bgcolor: "#fef3c7",
                      color: "#d97706",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircleOutline />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.02rem", color: "#0f172a" }}>
                      Confirmation par email
                    </Typography>
                    <Typography sx={{ color: "#475569", fontSize: "0.98rem" }}>
                      Activation du compte apres confirmation (lien valide 48h)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledPaper elevation={0}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Avatar sx={{ bgcolor: "#1e3a5f", width: 64, height: 64 }}>
                  <Mail sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>

              <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                Connexion
              </Typography>
              <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                Entrez vos identifiants recus par email
              </Typography>

              {errors.general && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errors.general}
                </Alert>
              )}

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
                          {showPassword ? <VisibilityOff /> : <Visibility />}
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
                    Mot de passe oublie ?
                  </Button>
                </Box>

                <StyledButton
                  type="submit"
                  fullWidth
                  size="large"
                  disabled={isLoading}
                  endIcon={<ArrowRight />}
                  sx={{ mb: 2.5, py: 1.5 }}
                >
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </StyledButton>

                <Typography align="center" sx={{ color: "#64748b", fontSize: "0.98rem", lineHeight: 1.45 }}>
                  Vous n&apos;avez pas encore confirme votre inscription ?
                  <br />
                  Verifiez vos emails (lien valide 48h)
                </Typography>
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </StyledContainer>
  );
};

export default Login;
