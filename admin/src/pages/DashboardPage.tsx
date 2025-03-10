import { useEffect, useState } from 'react';
import {
  Grid2,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export default function DashboardPage() {
  const [counts, setCounts] = useState({
    adminCount: 0,
    userCount: 0,
    totalDeposit: 0,
    pendingWithdrawals: 0,
    pendingDeposits: 0
  });

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => setCounts(data))
      .catch(console.error);
  }, []);

  return (
    <Grid2 container spacing={4}>
      <GridPreviewItem title="Admin Count" value={counts.adminCount} />
      <GridPreviewItem title="User Count" value={counts.userCount} />
      <GridPreviewItem title="Total Deposit Amount" value={`$${counts.totalDeposit.toFixed(2)}`} />
      <GridPreviewItem title="Pending Withdrawal Reqs" value={counts.pendingWithdrawals} />
      <GridPreviewItem title="Pending Deposit Reqs" value={counts.pendingDeposits} />
    </Grid2>
  );
}

function GridPreviewItem({ title, value }: { title: string, value: string | number }) {
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
          {value}
        </Typography>
      </Paper>
    </Grid2>
  );
}
