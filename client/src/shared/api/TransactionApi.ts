import type { Transaction } from "../types/models";
import { ApiClient } from "./ApiClient";
import type { TransactionFormData } from "../../features/home/components/TransactionFormModal";

export class TransactionApi {
  static async getTransactionsAll(): Promise<Transaction[]> {
    return ApiClient.get<Transaction[]>("/transactions");
  };

  static async getTransactionsByMonth(month: string): Promise<Transaction[]> {
    return ApiClient.get<Transaction[]>(`/transactions/month?month=${month}`);
  };

  static async getTransactionsByDate(date: string): Promise<Transaction[]> {
    return ApiClient.get<Transaction[]>(`/transactions/date?date=${date}`);
  };

  static async createTransaction(data: TransactionFormData): Promise<Transaction> {
    const payload = {
      date: data.date,
      transaction_type: data.transaction_type,
      category_id: data.category_id,
      payment_method_id: data.payment_method_id,
      amount: data.amount,
      description: data.description || null
    };
    return ApiClient.post<Transaction>("/transactions", payload);
  };
}