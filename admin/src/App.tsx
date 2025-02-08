import { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import DashboardPage from "./pages/DashboardPage";
import AdminManagerPage from "./pages/AdminManagerPage";
import UserPage from "./pages/UsersPage";
import ChangeBalancePage from "./pages/ChangeBalancePage";
import TradeReportPage from "./pages/TradeReportPage";
import Layout from "./components/Layout";
import DepositeRequestPage from "./pages/DepositeRequetsPage";
import WithdrawRequestsPage from "./pages/WithdrawRequestsPage";
import FaqMessagesPage from "./pages/FaqMessagesPage";
import UserContextProvider from "../../auth/src/context/UserContext";
import { UserContext } from "../../auth/src/context/UserContext";

function App() {
  const theme = createTheme({
    palette: {
      mode: "light",
    },
  });
  const userContext = useContext(UserContext);

  useEffect(() => {
    if (userContext && userContext.user) {
      // TODO: Check if this user have the admin role.
      // If not, redirect to the home page.
      console.log("------------------");
      console.log(userContext.user);
      console.log("------------------");
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <UserContextProvider>
          <Routes>
            <Route path="admin/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="admin-manager" element={<AdminManagerPage />} />
              <Route path="users" element={<UserPage />} />
              <Route path="change-balance" element={<ChangeBalancePage />} />
              <Route path="deposite-requests" element={<DepositeRequestPage />} />
              <Route
                path="withdraw-requests"
                element={<WithdrawRequestsPage />}
              />
              <Route path="trade-report" element={<TradeReportPage />} />
              <Route path="faq-messages" element={<FaqMessagesPage />} />
            </Route>
          </Routes>
        </UserContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
