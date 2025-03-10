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
        <Box component="h3">AutoFX</Box>
        <Box component="p" sx={{width: {xs: "100%", md: "400px"}}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ornare
          cursus sed nunc eget dictum Sed ornare cursus sed nunc eget dictumd
          nunc eget dictum Sed ornare cursus sed nunc eget dictum
        </Box>
      </Box>

      <Box sx={{display: "flex", flexDirection: "column", alignItems: { xs: "flex-start", md: "flex-end" }}}>
        <Box component="h3">AutoFX</Box>
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
