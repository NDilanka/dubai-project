import {
  Grid2,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export default function DashboardPage() {
  return (
    <Grid2 container spacing={4}>
      <GridPreviewItem title="Admin Count" />
      <GridPreviewItem title="User Count" />
      <GridPreviewItem title="Earnings" />
      <GridPreviewItem title="Withdrawal Request Count" />
      <GridPreviewItem title="Deposite Request Count" />
    </Grid2>
  );
}

function GridPreviewItem({ title }: { title: string }) {
  return (
    <Grid2 size={4}>
      <Paper
        variant="outlined"
        component={Stack}
        padding={2}
        alignItems="center"
      >
        <Typography component="span" fontSize={26} fontWeight={1}>
          {title}
        </Typography>

        <Typography component="span" fontSize={60} fontWeight={1}>
          5
        </Typography>
      </Paper>
    </Grid2>
  );
}
