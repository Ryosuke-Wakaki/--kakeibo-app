import { useState } from "react";
import { Box, Card, CardContent, Typography, Button, Stack, Divider } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MenuIcon from "@mui/icons-material/Menu";

export const DetailPanel = () => {
  const [date, setDate] = useState<string>("2024-06-01");
  const [income, setIncome] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  return (
    <Box sx={{ p: 2 }}>
      {/* 日付表示 */}
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
        日時：{date}
      </Typography>

      {/* 収入・支出カード */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Card sx={{ flex: 1, textAlign: "center", boxShadow: 2 }}>
          <CardContent>
            <Typography variant="body2">収入</Typography>
            <Typography variant="h6" color="primary">
              ¥{income}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, textAlign: "center", boxShadow: 2 }}>
          <CardContent>
            <Typography variant="body2">支出</Typography>
            <Typography variant="h6" color="error">
              ¥{expense}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* 残高カード */}
      <Card sx={{ mb: 3, textAlign: "center", boxShadow: 2 }}>
        <CardContent>
          <Typography variant="body2">残高</Typography>
          <Typography variant="h6" color="success.main">
            ¥{balance}
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 2 }} />

      {/* 内訳セクション */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <MenuIcon fontSize="small" />
          <Typography variant="body1">内訳</Typography>
        </Stack>
        <Button
          size="small"
          startIcon={<AddCircleOutlineIcon color="primary" />}
          sx={{ textTransform: "none" }}
        >
          内訳を追加
        </Button>
      </Stack>
    </Box>
  );
};
