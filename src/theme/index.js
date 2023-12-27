import { createTheme, responsiveFontSizes } from "@mui/material";
import { blue, green, orange } from "@mui/material/colors";

let theme = createTheme({
  palette: {
    primary: {
      light: green[200],
      main: green[500],
      dark: green[900],
    },
    secondary: {
      light: orange[300],
      main: orange[700],
      dark: orange[900],
    },
    success: {
      main: blue[500],
    },
    text: {
      primary: green[900],
      secondary: green[50],
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {},
    },
  },
});

theme = responsiveFontSizes(theme);
export { theme };
