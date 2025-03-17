import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../auth/src/context/UserContext";

export default function Footer() {
  const userContext = useContext(UserContext);

  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", md: "center" },
        padding: "1rem",
        marginTop: "150px",
        marginBottom: "50px",
        gap: { xs: 4, md: 0 },
      }}
    >
      <Box>
        <Box component="h3">UCoin</Box>
        <Box component="p" sx={{width: {xs: "100%", md: "400px"}}}>
        U Coin, India’s most valuable crypto investment app, is dedicated to make crypto accessible in a simple way. Established in 2019, U Coin has solved numerous problems faced by the Indian crypto community with solutions around crypto investing, Refunding crypto trading & crypto literacy.
        </Box>
      </Box>

      <Box sx={{display: "flex", flexDirection: "column", alignItems: { xs: "flex-start", md: "flex-end" }}}>
        <Box component="h3">UCoin</Box>
        <Box>
        {userContext?.user !== null ? (
          <>
            <Link to="/">
              <Button sx={{color: "white"}}>Home</Button>
            </Link>

            <Link to="/trade">
              <Button sx={{color: "white"}}>Trade</Button>
            </Link>

            <Link to="/wallet">
              <Button sx={{color: "white"}}>Wallet</Button>
            </Link>
          </>
        ) : (
          <>
            <Button sx={{color: "white"}} onClick={() => window.location.href = "/"}>Home</Button>
            <Button sx={{color: "white"}} onClick={() => window.location.href = "/sign-in"}>Trade</Button>
            <Button sx={{color: "white"}} onClick={() => window.location.href = "/sign-in"}>Wallet</Button>
          </>
        )}
        </Box>
      </Box>
    </Box>
  );
}
