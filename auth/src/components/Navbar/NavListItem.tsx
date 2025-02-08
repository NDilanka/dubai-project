import { Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function NavListItem({
  href,
  title,
}: {
  href: string;
  title: string;
}) {
  return (
    <Box
      component={Link}
      to={href}
      color="white"
      sx={{ textDecoration: "none" }}
    >
      {title}
    </Box>
  );
}
