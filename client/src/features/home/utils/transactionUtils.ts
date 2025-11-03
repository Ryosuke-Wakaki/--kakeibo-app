import type { Transaction } from "../../../shared/types/models";

/**
 * 日付フォーマットを変換（yyyy/MM/dd → yyyy-MM-dd）
 */
export const formatDateToDbFormat = (date: string): string => {
  return date.replace(/\//g, '-');
};

/**
 * 月間の収支を計算
 */
export const calculateMonthlySummary = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter(t => t.transaction_type === '01')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const totalExpense = transactions
    .filter(t => t.transaction_type === '02')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense
  };
};

/**
 * 選択された日付の収支を計算
 */
export const calculateDailySummary = (
  transactions: Transaction[],
  selectedDate: string
) => {
  if (!selectedDate) {
    return { income: 0, expense: 0, balance: 0 };
  }

  const formattedDate = formatDateToDbFormat(selectedDate);
  const dailyTransactions = transactions.filter(t => t.date === formattedDate);
  
  const income = dailyTransactions
    .filter(t => t.transaction_type === '01')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const expense = dailyTransactions
    .filter(t => t.transaction_type === '02')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  return {
    income,
    expense,
    balance: income - expense
  };
};

/**
 * 日別の収支データを作成（カレンダー用）
 */
export const createDailySummaries = (transactions: Transaction[]) => {
  return transactions.reduce((acc, t) => {
    const date = t.date; // yyyy-MM-dd形式
    if (!acc[date]) {
      acc[date] = { income: 0, expense: 0 };
    }
    if (t.transaction_type === '01') {
      acc[date].income += Number(t.amount);
    } else {
      acc[date].expense += Number(t.amount);
    }
    return acc;
  }, {} as Record<string, { income: number; expense: number }>);
};

/**
 * 選択された日付の取引リストを表示用に変換
 */
export const getDailyTransactionsForDisplay = (
  transactions: Transaction[],
  selectedDate: string
) => {
  if (!selectedDate) {
    return [];
  }

  const formattedDate = formatDateToDbFormat(selectedDate);
  
  return transactions
    .filter(t => t.date === formattedDate)
    .map(t => ({
      id: t.id,
      type: t.transaction_type === '01' ? '収入' : '支出' as '収入' | '支出',
      category: `カテゴリー${t.category_id}`, // 後でカテゴリー名に置き換え
      amount: Number(t.amount),
      paymentMethod: t.payment_method_id ? `支払方法${t.payment_method_id}` : undefined,
      description: t.description || undefined
    }));
};
