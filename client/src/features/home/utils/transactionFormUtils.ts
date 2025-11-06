import type { Category, PaymentMethod } from "../../../shared/types/models";

/**
 * 取引種別に応じたカテゴリーをフィルタリング
 * 
 * @param categories - カテゴリーマスターデータ
 * @param transactionType - 取引種別 ('01': 収入, '02': 支出)
 * @returns フィルタリングされたカテゴリー配列
 */
export const filterCategoriesByType = (
  categories: Category[],
  transactionType: '01' | '02'
): Category[] => {
  return categories.filter(category => category.transaction_type === transactionType);
};

/**
 * フィルタリングされたカテゴリーから初期値を取得
 * 
 * @param categories - カテゴリー配列
 * @returns 最初のカテゴリーID、存在しない場合は0
 */
export const getDefaultCategoryId = (categories: Category[]): number => {
  return categories.length > 0 ? categories[0].id : 0;
};

/**
 * 支払い方法から初期値を取得
 * 
 * @param paymentMethods - 支払い方法配列
 * @returns 最初の支払い方法ID、存在しない場合は0
 */
export const getDefaultPaymentMethodId = (paymentMethods: PaymentMethod[]): number => {
  return paymentMethods.length > 0 ? paymentMethods[0].id : 0;
};

/**
 * フォーム入力の妥当性を検証
 * 
 * @param amount - 金額
 * @returns 妥当な場合true
 */
export const isValidForm = (amount: string): boolean => {
  return !!amount && Number(amount) > 0;
};
