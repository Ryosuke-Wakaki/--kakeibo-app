import { useState, useEffect } from "react";
import type { Category, PaymentMethod } from "../../../shared/types/models";
import type { TransactionFormData } from "../components/TransactionFormModal";
import { formatDateToDbFormat } from "../../../shared/utils/dateUtils";
import {
  filterCategoriesByType,
  getDefaultCategoryId,
  getDefaultPaymentMethodId,
} from "../utils/transactionFormUtils";

/**
 * 取引フォームの状態管理を行うカスタムフック
 * 
 * @param selectedDate - 選択された日付
 * @param categories - カテゴリーマスターデータ
 * @param paymentMethods - 支払い方法マスターデータ
 * @returns フォーム状態と操作関数
 */
export const useTransactionForm = (
  selectedDate: string,
  categories: Category[],
  paymentMethods: PaymentMethod[]
) => {
  const [transactionType, setTransactionType] = useState<'01' | '02'>('02'); // デフォルトは支出
  const [date, setDate] = useState(() => {
    if (selectedDate) {
      return formatDateToDbFormat(selectedDate);
    }
    return new Date().toISOString().split('T')[0];
  });
  const [categoryId, setCategoryId] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');
  const [paymentMethodId, setPaymentMethodId] = useState<number>(0);
  const [description, setDescription] = useState<string>('');

  // 取引種別に応じたカテゴリーをフィルタリング
  const filteredCategories = filterCategoriesByType(categories, transactionType);

  // 日付が変更されたら更新
  useEffect(() => {
    if (selectedDate) {
      setDate(formatDateToDbFormat(selectedDate));
    }
  }, [selectedDate]);

  // マスターデータが読み込まれたら初期値を設定
  useEffect(() => {
    if (filteredCategories.length > 0 && categoryId === 0) {
      setCategoryId(getDefaultCategoryId(filteredCategories));
    }
  }, [filteredCategories, categoryId]);

  useEffect(() => {
    if (paymentMethods.length > 0 && paymentMethodId === 0) {
      setPaymentMethodId(getDefaultPaymentMethodId(paymentMethods));
    }
  }, [paymentMethods, paymentMethodId]);

  /**
   * 取引種別変更ハンドラ
   * カテゴリーをリセットして新しい種別の最初のカテゴリーを選択
   */
  const handleTransactionTypeChange = (newValue: '01' | '02' | null) => {
    if (newValue) {
      setTransactionType(newValue);
      const newFilteredCategories = filterCategoriesByType(categories, newValue);
      if (newFilteredCategories.length > 0) {
        setCategoryId(getDefaultCategoryId(newFilteredCategories));
      }
    }
  };

  /**
   * フォームをリセット
   */
  const resetForm = () => {
    setTransactionType('02');
    setAmount('');
    setDescription('');
    setCategoryId(0);
    setPaymentMethodId(0);
  };

  /**
   * フォームデータを取得
   */
  const getFormData = (): TransactionFormData => {
    return {
      date,
      transaction_type: transactionType,
      category_id: categoryId,
      amount: Number(amount),
      // 収入の場合は支払い方法を含めない
      payment_method_id: transactionType === '02' ? paymentMethodId : undefined,
      description: description || undefined,
    };
  };

  return {
    // 状態
    transactionType,
    date,
    categoryId,
    amount,
    paymentMethodId,
    description,
    filteredCategories,
    // 更新関数
    setTransactionType,
    setDate,
    setCategoryId,
    setAmount,
    setPaymentMethodId,
    setDescription,
    // 操作関数
    handleTransactionTypeChange,
    resetForm,
    getFormData,
  };
};
