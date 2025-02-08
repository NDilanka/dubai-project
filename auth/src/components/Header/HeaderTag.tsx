import { Box, useTheme } from "@mui/material";

export default function HeaderTag({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const theme = useTheme();

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box
        component="img"
        src={src}
        alt=""
        sx={{
          [theme.breakpoints.down("sm")]: {
            width: 24,
          },
        }}
      />
      <Box
        component="span"
        sx={{
          [theme.breakpoints.down("sm")]: {
            fontSize: 12,
          },
        }}
      >
        {title}
      </Box>
    </Box>
  );
}
