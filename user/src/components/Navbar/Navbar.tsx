import {
    Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isDropdownOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const ref = useRef(null);
  const [profileDropDownIsOpen, setProfileDropdownIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (userContext && userContext.user) {
      console.log(userContext.user);
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
        body: JSON.stringify({userId})
      });

      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.name === "Admin" || data.name === "Super Admin");
      } else {
        // TODO: Display an error message.
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleClickMenuButton = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuCloseWithNavigate = (href: string) => {
    navigate(href);
  };

  const handleClickProfileItem = () => {
    setProfileDropdownIsOpen(false);
    navigate("/profile");
  };

  const handleClickAdminItem = () => {
    setProfileDropdownIsOpen(false);
    window.location.href = "/admin";
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
        sx={{
          textDecoration: "none"
        }}
      >
        <Box component="img" src="/svgs/lemlistlogo_2.svg" />
        <Box component="span" fontSize={20} fontWeight={700}>
          AutoFX
        </Box>
      </Box>

      <NavList />

      {(userContext!.user === null) &&
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
            mask: `linear-gradient(${theme.palette.background.default} 0 0)`,
            maskComposite: "exclude",
            textDecoration: "none",
            "&:hover": {
              background: `radial-gradient(ellipse 4rem 2rem at center, ${theme.palette.background.default}, ${theme.palette.primary.main})`,
            },
            [theme.breakpoints.down("sm")]: {
              display: "none",
            },
          }}
        >
          Sign In
        </Box>
      }

      <IconButton
        onClick={handleClickMenuButton}
        sx={{
          display: "none",
          [theme.breakpoints.down("sm")]: {
            display: "block",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={isDropdownOpen} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleMenuCloseWithNavigate("/")}>
          Home
        </MenuItem>

        <MenuItem onClick={() => handleMenuCloseWithNavigate("/trade")}>
          Trade
        </MenuItem>

        <MenuItem onClick={() => handleMenuCloseWithNavigate("/wallet")}>
          Wallet
        </MenuItem>

        <MenuItem onClick={() => handleMenuCloseWithNavigate("/sign-in")}>
          Sign In
        </MenuItem>
      </Menu>

      {!(userContext!.user === null) &&
        <Box component="div" onMouseOver={() => setProfileDropdownIsOpen(true)}>
          <Avatar ref={ref}>{userContext?.user.firstName[0]}</Avatar>
        </Box>
      }

      <Menu
        open={profileDropDownIsOpen}
        onClose={() => setProfileDropdownIsOpen(false)}
        anchorEl={ref.current}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        sx={{ marginTop: 1 }}
      >
        <MenuItem 
          sx={{ display: "flex", gap: 2 }} 
          onClick={handleClickProfileItem}
        >
          <Avatar>{userContext?.user?.firstName[0]}</Avatar>
          <Typography>Profile</Typography>
        </MenuItem>

        {isAdmin &&
          <MenuItem
            sx={{ display: "flex", gap: 2 }} 
            onClick={handleClickAdminItem}
          >
            <People />
            <Typography>Admin</Typography>
          </MenuItem>
        }

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
        [theme.breakpoints.down("sm")]: {
          display: "none",
        },
      }}
    >
      <NavListItem href="/" title="Home" />
      {userContext?.user  !== null ? (
        <>
          <NavListItem href="/trade" title="Trade" />
          <NavListItem href="/wallet" title="Wallet" />
        </>
      ) : (
        <>
          <a href="/sign-in" style={{textDecoration: "none", color: "white"}}>Trade</a>
          <a href="/sign-in" style={{textDecoration: "none", color: "white"}}>Wallet</a>
        </>
      )}
    </Box>
  );
}
