import { Box, useTheme } from "@mui/material";
import HeaderTag from "./HeaderTag";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../../auth/src/context/UserContext";

export default function Header() {
  const theme = useTheme();
  const userContext = useContext(UserContext);

  return (
    <Box
      component="header"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        display="flex"
        fontSize={18}
        alignItems="center"
        gap={1}
        paddingY={2}
        paddingX={4}
        borderRadius={999}
        border={1}
        sx={{
          background: `radial-gradient(ellipse 28.125rem 5rem at center, ${theme.palette.background.default}, ${theme.palette.primary.main})`,
          borderImage: `linear-gradient(0deg, ${theme.palette.background.default}, ${theme.palette.primary.main}) 1`,
          mask: `linear-gradient(${theme.palette.background.default} 0 0)`,
          maskComposite: "exclude",
          [theme.breakpoints.down("sm")]: {
            fontSize: 14,
            paddingY: 1,
            paddingX: 2,
          },
        }}
      >
        <Box
          component="img"
          src="svgs/Group_3.svg"
          sx={{
            [theme.breakpoints.down("sm")]: {
              width: 20,
            },
          }}
        />
        New: Our AI integration just landed
      </Box>

      <Box
        component="h1"
        fontSize={60}
        textAlign="center"
        sx={{
          [theme.breakpoints.down("sm")]: {
            fontSize: 28,
            lineHeight: 1.2,
          },
          [theme.breakpoints.down("md")]: {
            fontSize: 42,
            lineHeight: 1.2,
          },
        }}
      >
        Discover endless possibilities in the world of Trading.
      </Box>

      <Box
        component="p"
        maxWidth="60%"
        textAlign="center"
        color="#A6AAB2"
        marginBottom={5}
        sx={{
          [theme.breakpoints.down("sm")]: {
            fontSize: 14,
            maxWidth: "80%",
          },
        }}
      >
        Step into the world of trading excellence and seize every opportunity
        with our advanced platform, expert guidance, and strategic insights for
        unrivaled financial success.
      </Box>

      <Box
        display="flex"
        gap={3}
        marginBottom={5}
        sx={{
          [theme.breakpoints.down("sm")]: {
            gap: 0.4,
          },
          [theme.breakpoints.down("md")]: {
            gap: 2,
          },
        }}
      >
        <HeaderTag src="svgs/63011f1a01baa4acd99a562a_corner.svg" title="Fast Trading" />
        <HeaderTag src="svgs/63011f1ba65dd9532c03e563_line.svg" title="Secure & Reliable" />
        <HeaderTag src="svgs/Frame_7.svg" title="Continuous Market Updates" />
      </Box>

      <Box display="flex" gap={1.6}>
        <Box
          component="button"
          bgcolor={theme.palette.primary.main}
          color="white"
          paddingX={2.5}
          paddingY={1.5}
          border="none"
          borderRadius={999}
          fontSize={18}
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            [theme.breakpoints.down("sm")]: {
              fontSize: 14,
              paddingX: 1.5,
              paddingY: 0.5,
            },
          }}
        >
          <Box
            component="img"
            src="svgs/62e275df6d0fc5b329129b81_fire.svg"
            sx={{
              [theme.breakpoints.down("sm")]: {
                width: 20,
              },
            }}
          />
          Start Trading
        </Box>

        {!userContext?.user &&
          <Box
            component={Link}
            to="/sign-in"
            paddingX={2.5}
            paddingY={1.5}
            borderRadius={999}
            border={1}
            borderColor="#333"
            bgcolor="transparent"
            color="white"
            fontSize={18}
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              textDecoration: "none",
              "&:hover": {
                border: `0.0625rem solid ${theme.palette.primary.main}`,
              },
              [theme.breakpoints.down("sm")]: {
                fontSize: 14,
                paddingX: 1.5,
                paddingY: 1,
              },
            }}
          >
            <Box component="img" src="svgs/63011d2ad7739c0ae2d6a345_gift.svg" />
            Sign In
          </Box>
        }
      </Box>
    </Box>
  );
}
