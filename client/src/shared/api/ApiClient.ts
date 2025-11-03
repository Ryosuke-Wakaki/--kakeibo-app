export class ApiClient {
  private static baseUrl = "http://localhost:8000/api/v1"; // 例：FastAPIなどのバックエンドURL

  static async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`);
    if (!res.ok) throw new Error(`GET ${path} failed`);
    return res.json() as Promise<T>;
  }

  static async post<T>(path: string, data: any): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`POST ${path} failed`);
    return res.json() as Promise<T>;
  }
}