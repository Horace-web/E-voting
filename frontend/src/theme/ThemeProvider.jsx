import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

/**
 * Wrapper ThemeProvider pour l'application E-Vote
 * Applique le thème personnalisé à tous les composants MUI
 */
function AppThemeProvider({ children }) {
  return (
    <MuiThemeProvider theme={theme}>
      {/* CssBaseline : Normalisation CSS + styles de base MUI */}
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default AppThemeProvider;
