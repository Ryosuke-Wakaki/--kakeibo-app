import type { Category, PaymentMethod } from "../types/models";
import { ApiClient } from "./ApiClient";

export class MasterDataApi {
  static async getCategories(): Promise<Category[]> {
    return ApiClient.get<Category[]>("/categories/");
  }

  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    return ApiClient.get<PaymentMethod[]>("/payment-methods/");
  }
}
