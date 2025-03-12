import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NavListItem from "./NavListItem";
import { useContext, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../auth/src/context/UserContext";
import { Logout, People } from "@mui/icons-material";

export default function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const ref = useRef(null);
  const [profileDropDownIsOpen, setProfileDropdownIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (userContext && userContext.user) {
      fetchRole(userContext.user._id);
    }
  }, [userContext]);

  const fetchRole = async (userId: string) => {
    try {
      const response = await fetch("/api/check-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.name === "Admin" || data.name === "Super Admin");
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleClickProfileItem = () => {
    navigate("/profile");
    setIsDrawerOpen(false);
  };

  const handleClickAdminItem = () => {
    window.location.href = "/admin";
    setIsDrawerOpen(false);
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/sign-out', { method: 'POST' });
      if (res.ok) {
        // Optionally, clear your user context if needed:
        // userContext.setUser(null);
        window.location.href = '/'; // redirect to sign in page after sign out
      } else {
        console.error('Sign out failed.');
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    }
    setIsDrawerOpen(false);
  };

  return (
    <Box
      component="nav"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      position="relative"
      marginBottom={5}
      height={100}
    >
      <Box
        component={Link}
        to="/"
        display="flex"
        alignItems="center"
        color="white"
        sx={{ textDecoration: "none" }}
      >
        <Box component="img" src="/svgs/lemlistlogo_2.svg" />
        <Box component="span" fontSize={20} fontWeight={700}>
          AutoFX
        </Box>
      </Box>

      <NavList />

      {userContext!.user === null && (
        <Box
          component="a"
          href="/sign-in"
          display="flex"
          fontSize={18}
          alignItems="center"
          gap={1}
          paddingY={2}
          paddingX={4}
          borderRadius={999}
          border={1}
          color="white"
          sx={{
            background: `radial-gradient(ellipse 8rem 4rem at center, ${theme.palette.background.default}, ${theme.palette.primary.main})`,
            borderImage: `linear-gradient(0deg, ${theme.palette.background.default}, ${theme.palette.primary.main}) 1`,
            [theme.breakpoints.down("sm")]: { display: "none" },
            textDecoration: "none",
          }}
        >
          Sign In
        </Box>
      )}

      <IconButton
        onClick={() => setIsDrawerOpen(true)}
        sx={{
          display: "none",
          [theme.breakpoints.down("sm")]: { display: "block" },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
    '& .MuiDrawer-paper': {
      backgroundColor: 'black',
      color: 'white',
    },
  }}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItem
              component="button"
              onClick={() => {
                navigate("/");
                setIsDrawerOpen(false);
              }}
              sx={{ cursor: "pointer", backgroundColor: "black", color: "white", border: "none" }}
            >
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem
              component="button"
              onClick={() => {
                navigate("/trade");
                setIsDrawerOpen(false);
              }}
              sx={{ cursor: "pointer", backgroundColor: "black", color: "white", border: "none"  }}
            >
              <ListItemText primary="Trade" />
            </ListItem>
            <ListItem
              component="button"
              onClick={() => {
                navigate("/wallet");
                setIsDrawerOpen(false);
              }}
              sx={{ cursor: "pointer", backgroundColor: "black", color: "white", border: "none" }}
            >
              <ListItemText primary="Wallet" />
            </ListItem>
            {userContext?.user === null && (
              <ListItem
                component="button"
                onClick={() => {
                  window.location.href = "/sign-in";
                  setIsDrawerOpen(false);
                }}
                sx={{ cursor: "pointer", backgroundColor: "black", color: "white", border: "none" }}
              >
                <ListItemText primary="Sign In" />
              </ListItem>
            )}
          </List>

          {userContext?.user && (
            <>
              <Divider />
              <List>
                <ListItem
                  component="button"
                  onClick={handleClickProfileItem}
                  sx={{ cursor: "pointer", backgroundColor: "black", color: "white", border: "none" }}
                >
                  <ListItemIcon>
                    <Avatar>{userContext.user.firstName[0]}</Avatar>
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItem>

                {isAdmin && (
                  <ListItem
                    component="button"
                    onClick={handleClickAdminItem}
                    sx={{ cursor: "pointer", backgroundColor: "black", color: "white", border: "none" }}
                  >
                    <ListItemIcon>
                      <People />
                    </ListItemIcon>
                    <ListItemText primary="Admin" />
                  </ListItem>
                )}

                <ListItem
                  component="button"
                  onClick={handleSignOut}
                  sx={{ cursor: "pointer", backgroundColor: "black", color: "white", border: "none" }}
                >
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary="Sign Out" />
                </ListItem>
              </List>
            </>
          )}
        </Box>
      </Drawer>

      {!(userContext!.user === null) && (
        <Box
          component="div"
          onMouseOver={() => setProfileDropdownIsOpen(true)}
          sx={{ [theme.breakpoints.down("sm")]: { display: "none" } }}
        >
          <Avatar ref={ref}>{userContext?.user.firstName[0]}</Avatar>
        </Box>
      )}

      <Menu
        open={profileDropDownIsOpen}
        onClose={() => setProfileDropdownIsOpen(false)}
        anchorEl={ref.current}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        sx={{
          marginTop: 1,
          [theme.breakpoints.down("sm")]: { display: "none" },
        }}
      >
        <MenuItem sx={{ display: "flex", gap: 2 }} onClick={handleClickProfileItem}>
          <Avatar>{userContext?.user?.firstName[0]}</Avatar>
          <Typography>Profile</Typography>
        </MenuItem>

        {isAdmin && (
          <MenuItem sx={{ display: "flex", gap: 2 }} onClick={handleClickAdminItem}>
            <People />
            <Typography>Admin</Typography>
          </MenuItem>
        )}

        <MenuItem
          sx={{ display: "flex", gap: 2 }}
          onClick={() => setProfileDropdownIsOpen(false)}
        >
          <Logout /> Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
}

function NavList() {
  const theme = useTheme();
  const userContext = useContext(UserContext);

  return (
    <Box
      component="ul"
      position="absolute"
      left="50%"
      top="50%"
      paddingX={4}
      paddingY={2}
      display="flex"
      gap={4}
      bgcolor="#fff3"
      borderRadius={999}
      sx={{
        listStyleType: "none",
        transform: "translate(-50%, -75%)",
        [theme.breakpoints.down("sm")]: { display: "none" },
      }}
    >
      <NavListItem href="/" title="Home" />
      {userContext?.user !== null ? (
        <>
          <NavListItem href="/trade" title="Trade" />
          <NavListItem href="/wallet" title="Wallet" />
        </>
      ) : (
        <>
          <a href="/sign-in" style={{ textDecoration: "none", color: "white" }}>
            Trade
          </a>
          <a href="/sign-in" style={{ textDecoration: "none", color: "white" }}>
            Wallet
          </a>
        </>
      )}
    </Box>
  );
}