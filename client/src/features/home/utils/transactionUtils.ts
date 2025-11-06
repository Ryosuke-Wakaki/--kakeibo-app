import type { Transaction, Category, PaymentMethod } from "../../../shared/types/models";
import { formatDateToDbFormat } from "../../../shared/utils/dateUtils";

/**
 * 月間の収支を計算
 * 
 * @param {Transaction[]} transactions - 取引データ配列
 * @returns {Object} 月次集計結果
 * @returns {number} totalIncome - 総収入
 * @returns {number} totalExpense - 総支出
 * @returns {number} balance - 収支（収入 - 支出）
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
 * 
 * @param {Transaction[]} transactions - 取引データ配列
 * @param {string} selectedDate - 選択された日付（yyyy/MM/dd形式）
 * @returns {Object} 日次集計結果
 * @returns {number} income - 収入
 * @returns {number} expense - 支出
 * @returns {number} balance - 収支（収入 - 支出）
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
 * 日別の収支データを作成（カレンダー表示用）
 * 
 * @param {Transaction[]} transactions - 取引データ配列
 * @returns {Record<string, {income: number, expense: number}>} 日付をキーとした収支マップ
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
 * マスターデータからカテゴリー名、支払い方法名を取得して付加
 * 
 * @param {Transaction[]} transactions - 取引データ配列
 * @param {string} selectedDate - 選択された日付（yyyy/MM/dd形式）
 * @param {Category[]} categories - カテゴリーマスターデータ
 * @param {PaymentMethod[]} paymentMethods - 支払い方法マスターデータ
 * @returns {Array} 表示用取引データ配列
 */
export const getDailyTransactionsForDisplay = (
  transactions: Transaction[],
  selectedDate: string,
  categories: Category[],
  paymentMethods: PaymentMethod[]
) => {
  if (!selectedDate) {
    return [];
  }

  const formattedDate = formatDateToDbFormat(selectedDate);
  
  return transactions
    .filter(t => t.date === formattedDate)
    .map(t => {
      // カテゴリー情報を取得
      const category = categories.find(c => c.id === t.category_id);
      const categoryName = category ? category.name : `カテゴリーID: ${t.category_id}`;
      const categoryCode = category ? category.code : '';
      
      // 支払い方法名を取得
      let paymentMethodName: string | undefined = undefined;
      if (t.payment_method_id) {
        const paymentMethod = paymentMethods.find(pm => pm.id === t.payment_method_id);
        paymentMethodName = paymentMethod ? paymentMethod.name : `支払方法ID: ${t.payment_method_id}`;
      }
      
      return {
        id: t.id,
        type: t.transaction_type === '01' ? '収入' : '支出' as '収入' | '支出',
        categoryCode: categoryCode,
        category: categoryName,
        amount: Number(t.amount),
        paymentMethod: paymentMethodName,
        description: t.description || undefined
      };
    });
};
