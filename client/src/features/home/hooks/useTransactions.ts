import { useState, useCallback } from "react";
import { TransactionApi } from "../../../shared/api/TransactionApi";
import type { Transaction } from "../../../shared/types/models";
import type { TransactionFormData } from "../components/TransactionFormModal";

/**
 * 取引データの取得・作成を管理するカスタムフック
 * 
 * @returns {Object} 取引データと操作関数
 * @returns {Transaction[]} transactions - 取引データ配列
 * @returns {Function} fetchTransactionsByMonth - 指定月の取引データを取得
 * @returns {Function} createTransaction - 新規取引を作成
 */
export const useTransactions = () => {
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  /**
   * 指定された月の取引データを取得
   * 同じ月を再度取得しようとした場合は何もしない
   */
  const fetchTransactionsByMonth = useCallback(async (month: string) => {
    if (month === currentMonth) {
      return;
    }
    
    setCurrentMonth(month);
    
    try {
      const monthTransactions = await TransactionApi.getTransactionsByMonth(month);
      setTransactions(monthTransactions);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setTransactions([]);
    }
  }, [currentMonth]);

  /**
   * 新規取引を作成し、現在の月のデータを再取得
   */
  const createTransaction = useCallback(async (formData: TransactionFormData) => {
    try {
      await TransactionApi.createTransaction(formData);
      
      // 成功したら現在の月のデータを再取得
      if (currentMonth) {
        const monthTransactions = await TransactionApi.getTransactionsByMonth(currentMonth);
        setTransactions(monthTransactions);
      }
    } catch (error) {
      console.error("Failed to create transaction:", error);
      throw error;
    }
  }, [currentMonth]);

  return {
    transactions,
    fetchTransactionsByMonth,
    createTransaction,
  };
};
