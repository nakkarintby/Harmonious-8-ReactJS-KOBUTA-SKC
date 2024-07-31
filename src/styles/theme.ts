import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#19857b",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    fontSize: 16, // default font size
    h1: {
      fontSize: '2rem',
    },
    h2: {
      fontSize: '1.9rem',
    },
    h3: {
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '0.89rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      fontSize: '0.875rem',
    },
    subtitle1 : {
      fontSize: '0.95rem',
    },
  },
  
  
});



