import { useEffect, useState } from 'react';

// 型定義
interface Transaction {
  id: number;
  date: string;
  transaction_type: string;
  category_id: number;
  amount: number;
  payment_method_id?: number;
  description?: string;
  tags?: string;
}

interface Category {
  id: number;
  code: string;
  name: string;
  description?: string;
  display_order: number;
}

interface PaymentMethod {
  id: number;
  code: string;
  name: string;
  description?: string;
  display_order: number;
}

export const ApiTest = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<string>('');

  // データ取得用の関数
  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/transactions/');
      const data = await response.json();
      setTransactions(data);
      setResult(prev => prev + '\nトランザクション取得成功: ' + JSON.stringify(data, null, 2));
    } catch (err) {
      setError(prev => prev + '\nトランザクション取得エラー: ' + err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/categories/');
      const data = await response.json();
      setCategories(data);
      setResult(prev => prev + '\nカテゴリ取得成功: ' + JSON.stringify(data, null, 2));
    } catch (err) {
      setError(prev => prev + '\nカテゴリ取得エラー: ' + err);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/payment-methods/');
      const data = await response.json();
      setPaymentMethods(data);
      setResult(prev => prev + '\n支払い方法取得成功: ' + JSON.stringify(data, null, 2));
    } catch (err) {
      setError(prev => prev + '\n支払い方法取得エラー: ' + err);
    }
  };

  // トランザクション作成のテスト
  const createTransaction = async () => {
    try {
      const newTransaction = {
        date: new Date().toISOString().split('T')[0],
        transaction_type: '02', // 支出
        category_id: 1,
        amount: 1000,
        payment_method_id: 1,
        description: 'APIテスト用トランザクション',
        tags: 'テスト,API'
      };

      const response = await fetch('http://localhost:8000/api/v1/transactions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });

      const data = await response.json();
      setResult(prev => prev + '\nトランザクション作成成功: ' + JSON.stringify(data, null, 2));
      
      // 作成後に一覧を再取得
      fetchTransactions();
    } catch (err) {
      setError(prev => prev + '\nトランザクション作成エラー: ' + err);
    }
  };

  // コンポーネントマウント時に全データを取得
  useEffect(() => {
    fetchCategories();
    fetchPaymentMethods();
    fetchTransactions();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>API疎通確認</h1>
      
      <div style={{ marginBottom: 20 }}>
        <h2>操作</h2>
        <button onClick={fetchTransactions}>トランザクション再取得</button>
        <button onClick={fetchCategories} style={{ marginLeft: 10 }}>カテゴリ再取得</button>
        <button onClick={fetchPaymentMethods} style={{ marginLeft: 10 }}>支払い方法再取得</button>
        <button onClick={createTransaction} style={{ marginLeft: 10 }}>テストトランザクション作成</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h2>データ</h2>
        <h3>Transactions ({transactions.length}件)</h3>
        <pre>{JSON.stringify(transactions, null, 2)}</pre>
        
        <h3>Categories ({categories.length}件)</h3>
        <pre>{JSON.stringify(categories, null, 2)}</pre>
        
        <h3>Payment Methods ({paymentMethods.length}件)</h3>
        <pre>{JSON.stringify(paymentMethods, null, 2)}</pre>
      </div>

      {error && (
        <div style={{ marginBottom: 20, color: 'red' }}>
          <h2>エラー</h2>
          <pre>{error}</pre>
        </div>
      )}

      <div>
        <h2>実行結果ログ</h2>
        <pre>{result}</pre>
      </div>
    </div>
  );
};