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
  ListItemText,
  ListItemIcon,
  Collapse
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PaymentIcon from "@mui/icons-material/Payment";
import CategoryIcon from "@mui/icons-material/Category";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";

import type { DetailPanelProps } from "../types/props";
import { CategoryCode } from "../../../shared/types/constants";

export const DetailPanel = (props: DetailPanelProps) => {
  const { selectedDate, dailyTotal, transactions, onTransactionAdd } = props;

  // 各取引の詳細表示状態を管理
  const [expandedTransactionId, setExpandedTransactionId] = useState<number | null>(null);

  // カテゴリーコードに応じたアイコンを返す関数
  const getCategoryIcon = (categoryCode: string) => {
    switch (categoryCode) {
      // 食費
      case CategoryCode.FOOD:
        return <RestaurantIcon />;
      // 交通費
      case CategoryCode.TRANSPORT:
        return <DirectionsBusIcon />;
      // 給与
      case CategoryCode.SALARY:
        return <PaymentIcon />;
      default:
        return <CategoryIcon />;
    }
  };

  // 取引カードのクリックハンドラ
  const handleTransactionClick = (transactionId: number) => {
    setExpandedTransactionId(
      expandedTransactionId === transactionId ? null : transactionId
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* 日付表示 */}
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
        {selectedDate ? `${selectedDate}` : '日付を選択してください'}
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

      {/* 収支カード */}
      <Card sx={{ mb: 3, textAlign: "center", boxShadow: 2 }}>
        <CardContent>
          <Typography variant="body2">収支</Typography>
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
          {transactions.map((transaction) => {
            const isExpanded = expandedTransactionId === transaction.id;
            return (
              <Box key={transaction.id}>
                <ListItem
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                    p: 1.5,
                    backgroundColor: transaction.type === '収入' ? '#e3f2fd' : '#ffebee',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: transaction.type === '収入' ? '#bbdefb' : '#ffcdd2',
                    }
                  }}
                  onClick={() => handleTransactionClick(transaction.id)}
                >
                  {/* カテゴリーアイコン */}
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: 'white'
                      }}
                    >
                      {getCategoryIcon(transaction.categoryCode)}
                    </Box>
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                          {transaction.category}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 'bold',
                            color: transaction.type === '収入' ? 'primary.main' : 'error.main'
                          }}
                        >
                          ¥{transaction.amount.toLocaleString()}
                        </Typography>
                      </Stack>
                    }
                  />

                  {/* 展開アイコン */}
                  {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                {/* 詳細情報（展開時のみ表示） */}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      px: 2,
                      pb: 2,
                      pt: 1,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          取引種別
                        </Typography>
                        <Typography variant="body2">
                          {transaction.type}
                        </Typography>
                      </Box>
                      {transaction.paymentMethod && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            支払い方法
                          </Typography>
                          <Typography variant="body2">
                            {transaction.paymentMethod}
                          </Typography>
                        </Box>
                      )}
                      {transaction.description && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            説明
                          </Typography>
                          <Typography variant="body2">
                            {transaction.description}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </List>
      )}
    </Box>
  );
};
