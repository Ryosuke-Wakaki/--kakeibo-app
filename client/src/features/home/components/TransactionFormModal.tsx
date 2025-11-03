import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Stack,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useMasterData } from "../../../shared/contexts/MasterDataContext";

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transaction: TransactionFormData) => void;
  selectedDate: string;
}

export interface TransactionFormData {
  date: string;
  transaction_type: '01' | '02';
  category_id: number;
  amount: number;
  payment_method_id?: number;
  description?: string;
}

export const TransactionFormModal = ({ open, onClose, onSubmit, selectedDate }: TransactionFormModalProps) => {
  const { categories, paymentMethods } = useMasterData();
  
  const [transactionType, setTransactionType] = useState<'01' | '02'>('02'); // デフォルトは支出
  const [date, setDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 0);
  const [amount, setAmount] = useState<string>('');
  const [paymentMethodId, setPaymentMethodId] = useState<number>(paymentMethods[0]?.id || 0);
  const [description, setDescription] = useState<string>('');

  // モーダルが開かれた時に日付を更新
  useState(() => {
    if (selectedDate) {
      // yyyy/MM/dd -> yyyy-MM-dd に変換
      const formattedDate = selectedDate.replace(/\//g, '-');
      setDate(formattedDate);
    }
    // マスターデータが読み込まれたら初期値を設定
    if (categories.length > 0 && categoryId === 0) {
      setCategoryId(categories[0].id);
    }
    if (paymentMethods.length > 0 && paymentMethodId === 0) {
      setPaymentMethodId(paymentMethods[0].id);
    }
  });

  const handleSubmit = () => {
    const transaction: TransactionFormData = {
      date,
      transaction_type: transactionType,
      category_id: categoryId,
      amount: Number(amount),
      payment_method_id: paymentMethodId,
      description: description || undefined
    };

    onSubmit(transaction);
    handleClose();
  };

  const handleClose = () => {
    // フォームをリセット
    setTransactionType('02');
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          入力
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* 収入/支出切り替え */}
          <ToggleButtonGroup
            value={transactionType}
            exclusive
            onChange={(_, newValue) => newValue && setTransactionType(newValue)}
            fullWidth
          >
            <ToggleButton 
              value="02" 
              sx={{ 
                '&.Mui-selected': { 
                  backgroundColor: '#f44336', 
                  color: '#fff',
                  '&:hover': { backgroundColor: '#d32f2f' }
                } 
              }}
            >
              支出
            </ToggleButton>
            <ToggleButton 
              value="01"
              sx={{ 
                '&.Mui-selected': { 
                  backgroundColor: '#2196f3', 
                  color: '#fff',
                  '&:hover': { backgroundColor: '#1976d2' }
                } 
              }}
            >
              収入
            </ToggleButton>
          </ToggleButtonGroup>

          {/* 日付 */}
          <TextField
            label="日付"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          {/* カテゴリ */}
          <TextField
            select
            label="カテゴリ"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            fullWidth
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>

          {/* 金額 */}
          <TextField
            label="金額"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            placeholder="0"
          />

          {/* 支払方法 */}
          <TextField
            select
            label="支払方法"
            value={paymentMethodId}
            onChange={(e) => setPaymentMethodId(Number(e.target.value))}
            fullWidth
          >
            {paymentMethods.map((method) => (
              <MenuItem key={method.id} value={method.id}>
                {method.name}
              </MenuItem>
            ))}
          </TextField>

          {/* 内容 */}
          <TextField
            label="内容"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            placeholder="メモを入力"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          disabled={!amount || Number(amount) <= 0}
          sx={{ 
            backgroundColor: '#f44336',
            '&:hover': { backgroundColor: '#d32f2f' }
          }}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};
