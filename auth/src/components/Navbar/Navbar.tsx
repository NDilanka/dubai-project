import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import NavListItem from "./NavListItem";
import { type MouseEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isDropdownOpen = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClickMenuButton = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuCloseWithNavigate = (href: string) => {
    navigate(href);
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
      <Box display="flex" alignItems="center">
        <Box component="img" src="/svgs/lemlistlogo_2.svg" />
        <Box component="span" fontSize={20} fontWeight={700}>
          AutoFX
        </Box>
      </Box>

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
        <NavListItem href="/trade" title="Trade" />
        <NavListItem href="/wallet" title="Wallet" />
      </Box>

      <Box
        component={Link}
        to="/sign-in"
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

      {/* <Avatar ref={ref}>Z</Avatar> */}

      {/* <Menu
        open={true}
        anchorEl={ref.current}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        sx={{ marginTop: 1 }}
      >
        <MenuItem sx={{ display: "flex", gap: 2 }}>
          <Avatar>Z</Avatar>
          <Typography>Profile</Typography>
        </MenuItem>

        <MenuItem sx={{ display: "flex", gap: 2 }}>
          <Logout /> Sign Out
        </MenuItem>
      </Menu> */}
    </Box>
  );
}
