import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        marginTop: "150px",
        marginBottom: "50px",
      }}
    >
      <Box>
        <Box component="h3">AutoFX</Box>
        <Box component="p" sx={{width: "400px"}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ornare
          cursus sed nunc eget dictum Sed ornare cursus sed nunc eget dictumd
          nunc eget dictum Sed ornare cursus sed nunc eget dictum
        </Box>
      </Box>

      <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
        <Box component="h3">AutoFX</Box>
        <Box>
          <Link to="/">
            <Button sx={{color: "white"}}>Home</Button>
          </Link>

          <Link to="/trade">
            <Button sx={{color: "white"}}>Trade</Button>
          </Link>

          <Link to="/wallet">
            <Button sx={{color: "white"}}>Wallet</Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
