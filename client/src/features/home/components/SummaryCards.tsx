// components/SummaryCards.tsx
import { Card, CardContent, Typography, Grid } from "@mui/material";

type Summary = {
  income: number;
  expense: number;
  balance: number;
};

export const SummaryCards = ({ income, expense, balance }: Summary) => {
    return (
  <Grid container spacing={2}>
    <Grid size={4}>
      <Card sx={{ backgroundColor: "#2196f3", color: "#fff" }}>
        <CardContent>
          <Typography>収入</Typography>
          <Typography variant="h5">¥{income}</Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid size={4}>
      <Card sx={{ backgroundColor: "#f44336", color: "#fff" }}>
        <CardContent>
          <Typography>支出</Typography>
          <Typography variant="h5">¥{expense}</Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid size={4}>
      <Card sx={{ backgroundColor: "#4caf50", color: "#fff" }}>
        <CardContent>
          <Typography>残高</Typography>
          <Typography variant="h5">¥{balance}</Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
    );
};
