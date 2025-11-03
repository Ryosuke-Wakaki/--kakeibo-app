import { Card, CardContent, Typography, Grid } from "@mui/material";
import type { SummaryCardsProps } from "../types/props";

export const SummaryCards = ({ currentMonth, totalIncome, totalExpense, balance }: SummaryCardsProps) => {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={4}>
          <Card sx={{ backgroundColor: "#2196f3", color: "#fff" }}>
            <CardContent>
              <Typography>収入</Typography>
              <Typography variant="h5">¥{totalIncome.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card sx={{ backgroundColor: "#f44336", color: "#fff" }}>
            <CardContent>
              <Typography>支出</Typography>
              <Typography variant="h5">¥{totalExpense.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card sx={{ backgroundColor: "#4caf50", color: "#fff" }}>
            <CardContent>
              <Typography>残高</Typography>
              <Typography variant="h5">¥{balance.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
