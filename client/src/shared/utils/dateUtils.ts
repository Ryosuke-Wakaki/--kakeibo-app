/**
 * 日付フォーマット変換ユーティリティ
 */

/**
 * UI表示用の日付フォーマット（yyyy/MM/dd）をDB用フォーマット（yyyy-MM-dd）に変換
 * 
 * @param {string} date - yyyy/MM/dd 形式の日付文字列
 * @returns {string} yyyy-MM-dd 形式の日付文字列
 * 
 * @example
 * formatDateToDbFormat('2025/11/06') // '2025-11-06'
 */
export const formatDateToDbFormat = (date: string): string => {
  return date.replace(/\//g, '-');
};

/**
 * DB用の日付フォーマット（yyyy-MM-dd）をUI表示用フォーマット（yyyy/MM/dd）に変換
 * 
 * @param {string} date - yyyy-MM-dd 形式の日付文字列
 * @returns {string} yyyy/MM/dd 形式の日付文字列
 * 
 * @example
 * formatDateToUiFormat('2025-11-06') // '2025/11/06'
 */
export const formatDateToUiFormat = (date: string): string => {
  return date.replace(/-/g, '/');
};
