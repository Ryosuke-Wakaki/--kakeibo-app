import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Stack, 
  Divider,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import type { DetailPanelProps } from "../types/props";

export const DetailPanel = (props: DetailPanelProps) => {
  const { selectedDate, dailyTotal, transactions, onTransactionAdd } = props;

  return (
    <Box sx={{ p: 2 }}>
      {/* 日付表示 */}
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
        {selectedDate ? `日時：${selectedDate}` : '日付を選択してください'}
      </Typography>

      {/* 収入・支出カード */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Card sx={{ flex: 1, textAlign: "center", boxShadow: 2 }}>
          <CardContent>
            <Typography variant="body2">収入</Typography>
            <Typography variant="h6" color="primary">
              ¥{dailyTotal.income.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, textAlign: "center", boxShadow: 2 }}>
          <CardContent>
            <Typography variant="body2">支出</Typography>
            <Typography variant="h6" color="error">
              ¥{dailyTotal.expense.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* 残高カード */}
      <Card sx={{ mb: 3, textAlign: "center", boxShadow: 2 }}>
        <CardContent>
          <Typography variant="body2">残高</Typography>
          <Typography variant="h6" color="success.main">
            ¥{dailyTotal.balance.toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 2 }} />

      {/* 内訳セクション */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          内訳
        </Typography>
        <Button
          size="small"
          startIcon={<AddCircleOutlineIcon color="primary" />}
          sx={{ textTransform: "none" }}
          onClick={onTransactionAdd}
        >
          内訳を追加
        </Button>
      </Stack>

      {/* 取引リスト */}
      {transactions.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
          この日の取引はありません
        </Typography>
      ) : (
        <List sx={{ p: 0 }}>
          {transactions.map((transaction) => (
            <ListItem
              key={transaction.id}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                mb: 1,
                p: 1.5
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                        {transaction.category}
                      </Typography>
                      {transaction.description && (
                        <Typography variant="caption" component="div" color="text.secondary">
                          {transaction.description}
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        color: transaction.type === '収入' ? 'primary.main' : 'error.main'
                      }}
                    >
                      {transaction.type === '収入' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
                    </Typography>
                  </Stack>
                }
                secondary={
                  transaction.paymentMethod && (
                    <Typography variant="caption" color="text.secondary">
                      {transaction.paymentMethod}
                    </Typography>
                  )
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
