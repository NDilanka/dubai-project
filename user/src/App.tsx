import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import WalletPage from "./pages/WalletPage";
import Navbar from "./components/Navbar/Navbar";
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
            <Route
              path="/"
              element={
                <Container sx={{ marginTop: 5 }}>
                  <Background />
                  <Outlet />
                  <Footer />
                </Container>
              }
            >
              <Route
                element={
                  <>
                    <Navbar />
                    <Outlet />
                  </>
                }
              >
                <Route index element={<HomePage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="trade" element={<TradePage />} />
              </Route>
            </Route>
          </Routes>
        </UserContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
