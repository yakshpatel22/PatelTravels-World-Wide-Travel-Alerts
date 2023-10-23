import { createTheme } from "@mui/material/styles";
export default createTheme({
  typography: {
    useNextVariants: true,
    fontFamily: "Montserrat, sans-serif",
  },

  palette: {
    common: {
      black: "#000",
      white: "#fff",
    },
    background: {
      paper: "rgba(255, 255, 255, 1)",
      default: "rgba(255, 255, 255, 1)",
    },
    primary: {
      light: "rgba(125, 195, 46, 1)",
      main: "rgba(65, 117, 5, 1)",
      dark: "rgba(58, 95, 15, 1)",
      contrastText: "rgba(255, 255, 255, 1)",
    },
    secondary: {
      light: "rgba(255, 0, 0, 0.68)",
      main: "rgba(174, 0, 20, 1)",
      dark: "rgba(216, 0, 0, 0.57)",
      contrastText: "#fff",
    },
    error: {
      light: "rgba(255, 0, 0, 1)",
      main: "rgba(199, 0, 24, 1)",
      dark: "rgba(255, 80, 80, 1)",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(14, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
    button: {
      main: "#4CAF50",
      contrastText: "#fff",
    },
  },
});
