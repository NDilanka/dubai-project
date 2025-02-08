import { Box, Button } from "@mui/material";

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
        <Box component="h3">Header</Box>
        <Box component="p" sx={{width: "400px"}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ornare
          cursus sed nunc eget dictum Sed ornare cursus sed nunc eget dictumd
          nunc eget dictum Sed ornare cursus sed nunc eget dictum
        </Box>
      </Box>

      <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
        <Box component="h3">Header Text</Box>
        <Box>
          <Button sx={{color: "white"}}>Button 2</Button>
          <Button sx={{color: "white"}}>Button 2</Button>
          <Button sx={{color: "white"}}>Button 2</Button>
          <Button sx={{color: "white"}}>Button 2</Button>
        </Box>
      </Box>
    </Box>
  );
}
