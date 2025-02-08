import { ArrowBack, Assessment, AttachMoney, Balance, Dashboard, Logout, Menu, PeopleOutline, Quiz, 
         RequestQuote, SupervisorAccount } from "@mui/icons-material";
import { Box, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon,
         ListItemText, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const [showDrawer, setShowDrawer] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const [contentLeftMargin, setContentLeftMargin] = useState(0);
  const location = useLocation();
  const [title, setTitle] = useState("");

  useEffect(() => {
    switch (location.pathname) {
      case "/admin":
        {
          setTitle("Dashboard");
        }
        break;

      case "/admin/admin-manager":
        {
          setTitle("Admin Manager");
        }
        break;

      case "/admin/users":
        {
          setTitle("Users");
        }
        break;

      case "/admin/change-balance":
        {
          setTitle("Change Balance");
        }
        break;

      case "/admin/deposite-requests":
        {
          setTitle("Deposite Requests");
        }
        break;

      case "/admin/withdraw-requests":
        {
          setTitle("Withdraw Requests");
        }
        break;

      case "/admin/trade-report":
        {
          setTitle("Trade Report");
        }
        break;

      case "/admin/faq-messages":
        {
          setTitle("FAQs");
        }
        break;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (drawerRef.current) {
      setContentLeftMargin(
        drawerRef.current.querySelector(".MuiDrawer-paper")!.clientWidth /
          parseFloat(theme.spacing())
      );
    }
  }, [drawerRef.current]);

  return (
    <Box>
      <Drawer
        ref={drawerRef}
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        variant="persistent"
      >
        <List sx={{ mb: "auto" }}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setShowDrawer(false)}>
              <ListItemIcon>
                <ArrowBack />
              </ListItemIcon>

              <ListItemText primary="Hide Sidebar" />
            </ListItemButton>
          </ListItem>

          <Divider />

          <ListItem disablePadding component={Link} to="/admin">
            <ListItemButton selected={location.pathname === "/"}>
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>

              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding component={Link} to="/admin/admin-manager">
            <ListItemButton
              selected={location.pathname === "/admin/admin-manager"}
              href="/admin/admin-manager"
            >
              <ListItemIcon>
                <SupervisorAccount />
              </ListItemIcon>

              <ListItemText primary="Admin Manager" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding component={Link} to="/admin/users">
            <ListItemButton
              selected={location.pathname === "/admin/users"}
              href="/admin/users"
            >
              <ListItemIcon>
                <PeopleOutline />
              </ListItemIcon>

              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding component={Link} to="/admin/change-balance">
            <ListItemButton
              selected={location.pathname === "/admin/change-balance"}
              href="/change-balance"
            >
              <ListItemIcon>
                <Balance />
              </ListItemIcon>

              <ListItemText primary="Change Balance" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding component={Link} to="/admin/deposite-requests">
            <ListItemButton
              selected={location.pathname === "/admin/deposite-requests"}
              href="/admin/deposite-requests"
            >
              <ListItemIcon>
                <RequestQuote />
              </ListItemIcon>

              <ListItemText primary="Deposte Requests" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding component={Link} to="/admin/withdraw-requests">
            <ListItemButton
              selected={location.pathname === "/admin/withdraw-requests"}
              href="/admin/withdraw-requests"
            >
              <ListItemIcon>
                <AttachMoney />
              </ListItemIcon>

              <ListItemText primary="Withdraw Requests" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding component={Link} to="/admin/trade-report">
            <ListItemButton
              selected={location.pathname === "/admin/trade-report"}
              href="/admin/trade-report"
            >
              <ListItemIcon>
                <Assessment />
              </ListItemIcon>

              <ListItemText primary="Trade Report" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding component={Link} to="/admin/faq-messages">
            <ListItemButton
              selected={location.pathname === "/admin/faq-messages"}
              href="/admin/faq-messages"
            >
              <ListItemIcon>
                <Quiz />
              </ListItemIcon>

              <ListItemText primary="FAQ Messages" />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />

        <ListItem disablePadding component={Link} to="#">
          <ListItemButton>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>

            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </ListItem>
      </Drawer>

      <Box
        ml={showDrawer ? contentLeftMargin : 0}
        height="100vh"
        sx={{
          transition: theme.transitions.create(["margin-left"], {
            duration: "225ms",
            easing: "cubic-bezier(0, 0, 0.2, 1)",
          }),
        }}
      >
        {!showDrawer && (
          <IconButton
            sx={{ position: "absolute", left: 0, top: 0 }}
            onClick={() => setShowDrawer(true)}
          >
            <Menu />
          </IconButton>
        )}

        <Container maxWidth="md" sx={{ marginY: 16 }}>
          <Typography component="h1" fontSize={36}>
            {title}
          </Typography>

          <Divider sx={{ mt: 1, mb: 4 }} />

          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
