import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * Composants de formulaire personnalisés pour E-Vote
 *
 * Exemples d'utilisation :
 *
 * // TextField
 * <MuiTextField
 *   label="Email"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={!!errors.email}
 *   helperText={errors.email}
 *   required
 * />
 *
 * // Select
 * <MuiFormControl fullWidth>
 *   <InputLabel>Statut</InputLabel>
 *   <MuiSelect value={status} onChange={(e) => setStatus(e.target.value)}>
 *     <MenuItem value="active">Actif</MenuItem>
 *     <MenuItem value="inactive">Inactif</MenuItem>
 *   </MuiSelect>
 * </MuiFormControl>
 *
 * // Checkbox
 * <MuiCheckbox
 *   label="J'accepte les conditions"
 *   checked={accepted}
 *   onChange={(e) => setAccepted(e.target.checked)}
 * />
 */

// TextField stylé
const MuiTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.5rem",
    "&:hover fieldset": {
      borderColor: "#1e3a5f",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1e3a5f",
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#1e3a5f",
  },
});

// Select stylé
const MuiSelect = styled(Select)({
  borderRadius: "0.5rem",
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#1e3a5f",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#1e3a5f",
    borderWidth: "2px",
  },
});

// FormControl personnalisé
const MuiFormControl = styled(FormControl)({
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#1e3a5f",
  },
});

// Checkbox personnalisé
function MuiCheckbox({ label, checked, onChange, ...props }) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          sx={{
            color: "#64748b",
            "&.Mui-checked": {
              color: "#1e3a5f",
            },
          }}
          {...props}
        />
      }
      label={label}
    />
  );
}

// RadioGroup personnalisé
function MuiRadioGroup({ label, value, onChange, options, ...props }) {
  return (
    <FormControl component="fieldset" {...props}>
      {label && (
        <InputLabel
          sx={{
            position: "relative",
            transform: "none",
            mb: 1,
            color: "#1e293b",
            fontWeight: 600,
          }}
        >
          {label}
        </InputLabel>
      )}
      <RadioGroup value={value} onChange={onChange}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                sx={{
                  color: "#64748b",
                  "&.Mui-checked": {
                    color: "#1e3a5f",
                  },
                }}
              />
            }
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export { MuiTextField, MuiSelect, MuiFormControl, MuiCheckbox, MuiRadioGroup };
