import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./index.css";
import App from "./App.jsx";

const theme = createTheme({
  palette: {
    primary: {
      main: "#20321e",
    },
    secondary: {
      main: "#466245",
    },
  },

  typography: {
    fontFamily: ["Protest Revolution", "sans-serif"].join(","),
  },
});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
