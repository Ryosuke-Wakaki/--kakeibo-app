import { useMemo } from "react";
import type { Transaction, Category, PaymentMethod } from "../../../shared/types/models";
import {
  calculateMonthlySummary,
  calculateDailySummary,
  createDailySummaries,
  getDailyTransactionsForDisplay,
} from "../utils/transactionUtils";

/**
 * 取引データの計算処理を最適化するカスタムフック
 * useMemoを使用して、依存する値が変更されない限り再計算を防ぐ
 * 
 * @param {Transaction[]} transactions - 取引データ配列
 * @param {string} selectedDate - 選択された日付
 * @param {Category[]} categories - カテゴリーマスターデータ
 * @param {PaymentMethod[]} paymentMethods - 支払い方法マスターデータ
 * 
 * @returns {Object} 計算結果
 * @returns {Object} monthlySummary - 月次集計 (totalIncome, totalExpense, balance)
 * @returns {Object} dailySummaries - 日別集計 (カレンダー表示用)
 * @returns {Object} dailyTotal - 選択日の集計 (income, expense, balance)
 * @returns {Array} dailyTransactions - 選択日の取引リスト (表示用に変換済み)
 */
export const useTransactionCalculations = (
  transactions: Transaction[],
  selectedDate: string,
  categories: Category[],
  paymentMethods: PaymentMethod[]
) => {
  // 月次集計をメモ化
  const monthlySummary = useMemo(
    () => calculateMonthlySummary(transactions),
    [transactions]
  );

  // 日別集計をメモ化（カレンダー表示用）
  const dailySummaries = useMemo(
    () => createDailySummaries(transactions),
    [transactions]
  );

  // 選択日の集計をメモ化
  const dailyTotal = useMemo(
    () => calculateDailySummary(transactions, selectedDate),
    [transactions, selectedDate]
  );

  // 選択日の取引リスト（表示用）をメモ化
  const dailyTransactions = useMemo(
    () => getDailyTransactionsForDisplay(transactions, selectedDate, categories, paymentMethods),
    [transactions, selectedDate, categories, paymentMethods]
  );

  return {
    monthlySummary,
    dailySummaries,
    dailyTotal,
    dailyTransactions,
  };
};
