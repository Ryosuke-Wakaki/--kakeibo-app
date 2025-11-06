import { useState } from "react";
import Grid from "@mui/material/Grid";
import { SummaryCards } from "./components/SummaryCards";
import { Calendar } from "./components/Calendar";
import { DetailPanel } from "./components/DetailPanel";
import { TransactionFormModal } from "./components/TransactionFormModal";
import type { TransactionFormData } from "./components/TransactionFormModal";
import { useMasterData } from "../../shared/contexts/MasterDataContext";
import { useTransactions } from "./hooks/useTransactions";
import { useTransactionCalculations } from "./hooks/useTransactionCalculations";

/**
 * ホーム画面コンポーネント
 * 
 * カレンダーと取引の一覧・集計を表示する
 * - 月次・日次の収支サマリー表示
 * - カレンダーからの日付選択
 * - 選択日の取引詳細表示
 * - 新規取引の登録
 */
export const Home = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // マスターデータを取得
  const { categories, paymentMethods } = useMasterData();

  // 取引データの管理
  const { transactions, fetchTransactionsByMonth, createTransaction } = useTransactions();

  // 計算処理（メモ化済み）
  const { monthlySummary, dailySummaries, dailyTotal, dailyTransactions } = useTransactionCalculations(
    transactions,
    selectedDate,
    categories,
    paymentMethods
  );

  /**
   * カレンダーの表示月変更ハンドラ
   */
  const handleMonthChange = (month: string) => {
    fetchTransactionsByMonth(month);
  };

  /**
   * カレンダーの日付選択ハンドラ
   */
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  /**
   * 取引追加モーダルを開く
   */
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  /**
   * 取引追加モーダルを閉じる
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  /**
   * 新規取引登録ハンドラ
   */
  const handleSubmitTransaction = async (formData: TransactionFormData) => {
    await createTransaction(formData);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={9}>
          <SummaryCards 
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
