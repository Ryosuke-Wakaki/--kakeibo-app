// src/pages/Home.tsx
import Grid from "@mui/material/Grid";
import { SummaryCards } from "../components/SummaryCards";
import { Calendar } from "../components/Calendar";
import { DetailPanel } from "../components/DetailPanel";

export const Home = () => {
  return (
    <Grid container spacing={2}>
        <Grid size={9}>
            <SummaryCards income={0} expense={0} balance={0} />
            <Calendar />
        </Grid>
        <Grid size={3}>
            <DetailPanel />
        </Grid>
    </Grid>
  );
};
