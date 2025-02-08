import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Footer from "./components/Footer";
import TradePage from "./pages/TradePage";
import Background from "./components/Background";
import UserContextProvider from "../../auth/src/context/UserContext";

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#0A7CFF",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <UserContextProvider>
          <Routes>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
          </Routes>
        </UserContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
