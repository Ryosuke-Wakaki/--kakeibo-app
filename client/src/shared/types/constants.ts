/**
 * カテゴリーコードの区分値定数
 * マスターデータのcodeと対応
 */
export const CategoryCode = {
  FOOD: '01',        // 食費
  TRANSPORT: '02',   // 交通費
  SALARY: '03',      // 給与
} as const;

/**
 * 取引種別の区分値定数
 */
export const TransactionType = {
  INCOME: '01',     // 収入
  EXPENSE: '02',    // 支出
} as const;
