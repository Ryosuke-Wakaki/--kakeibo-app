import { useState } from "react";
import Grid from "@mui/material/Grid";
import { SummaryCards } from "./components/SummaryCards";
import { Calendar } from "./components/Calendar";
import { DetailPanel } from "./components/DetailPanel";
import { TransactionFormModal } from "./components/TransactionFormModal";
import type { TransactionFormData } from "./components/TransactionFormModal";
import { TransactionApi } from "../../shared/api/TransactionApi";
import type { Transaction } from "../../shared/types/models";
import {
  calculateMonthlySummary,
  calculateDailySummary,
  createDailySummaries,
  getDailyTransactionsForDisplay
} from "./utils/transactionUtils";

export const Home = () => {
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // カレンダーの表示月が変わった時
  const handleMonthChange = async (month: string) => {
    if (month === currentMonth) {
      return;
    }
    setCurrentMonth(month);
    
    // 月のtransactionを取得
    try {
      const monthTransactions = await TransactionApi.getTransactionsByMonth(month);
      setTransactions(monthTransactions);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setTransactions([]);
    }
  };

  // カレンダーから日付クリックされた時
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  // モーダルを開く
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // トランザクションを保存
  const handleSubmitTransaction = async (formData: TransactionFormData) => {
    try {
      // APIにPOST（TransactionApiに追加が必要）
      await TransactionApi.createTransaction(formData);
      
      // 成功したら現在の月のデータを再取得
      if (currentMonth) {
        const monthTransactions = await TransactionApi.getTransactionsByMonth(currentMonth);
        setTransactions(monthTransactions);
      }
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  // 計算処理をutilに委譲
  const monthlySummary = calculateMonthlySummary(transactions);
  const dailySummaries = createDailySummaries(transactions);
  const dailyTotal = calculateDailySummary(transactions, selectedDate);
  const dailyTransactions = getDailyTransactionsForDisplay(transactions, selectedDate);

  
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={9}>
            <SummaryCards 
              currentMonth={currentMonth}
              totalIncome={monthlySummary.totalIncome}
              totalExpense={monthlySummary.totalExpense}
              balance={monthlySummary.balance}
            />
            <Calendar 
              onMonthChange={handleMonthChange}
              onDateClick={handleDateClick}
              dailySummaries={dailySummaries}
            />
        </Grid>
        <Grid size={3}>
            <DetailPanel 
              selectedDate={selectedDate}
              dailyTotal={dailyTotal}
              transactions={dailyTransactions}
              onTransactionAdd={handleOpenModal}
            />
        </Grid>
      </Grid>
      <TransactionFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTransaction}
        selectedDate={selectedDate}
      />
    </>
  );
};
