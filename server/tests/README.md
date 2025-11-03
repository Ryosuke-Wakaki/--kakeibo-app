# API テスト実行ガイド

## セットアップ

### 1. 必要なパッケージのインストール

```powershell
cd server
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

必要なパッケージ:
- `pytest`: テストフレームワーク
- `pytest-cov`: カバレッジ計測
- `httpx`: FastAPIテストクライアント用

## テスト実行方法

### すべてのテストを実行

```powershell
pytest
```

### 詳細表示（各テストメソッド名を表示）

```powershell
pytest -v
```

### 特定のテストファイルのみ実行

```powershell
# Transaction APIのテストのみ
pytest tests/test_transaction.py

# Category APIのテストのみ
pytest tests/test_category.py

# Payment Method APIのテストのみ
pytest tests/test_payment_method.py
```

### 特定のテストクラス・メソッドのみ実行

```powershell
# TestCreateTransactionクラスのテストのみ
pytest tests/test_transaction.py::TestCreateTransaction

# 特定のテストメソッドのみ
pytest tests/test_transaction.py::TestCreateTransaction::test_create_income_transaction
```

### カバレッジ付きで実行

```powershell
# カバレッジを計測してターミナルに表示
pytest --cov=app

# HTML形式のカバレッジレポートを生成
pytest --cov=app --cov-report=html

# HTMLレポートは htmlcov/index.html に出力される
```

### 失敗したテストのみ再実行

```powershell
# 前回失敗したテストのみ実行
pytest --lf

# 前回失敗したテストを最初に実行、その後すべて実行
pytest --ff
```

### テスト出力を詳細に表示

```powershell
# print文の出力も表示
pytest -s

# 詳細なエラー情報を表示
pytest -vv
```

## テストの構成

### ファイル構成

```
server/tests/
├── conftest.py              # pytest設定とフィクスチャ
├── TEST_CASES.md           # テストケース仕様書
├── test_transaction.py     # Transaction APIのテスト
├── test_category.py        # Category APIのテスト
└── test_payment_method.py  # PaymentMethod APIのテスト
```

### フィクスチャ（conftest.py）

各テストで利用可能な共通フィクスチャ:

- `db_session`: テスト用データベースセッション
- `client`: FastAPIテストクライアント
- `sample_categories`: サンプルカテゴリーデータ（3件）
- `sample_payment_methods`: サンプル支払い方法データ（2件）
- `sample_transactions`: サンプルトランザクションデータ（3件）

### テストクラス構成

各APIエンドポイントごとにテストクラスを分けています:

#### test_transaction.py
- `TestCreateTransaction`: POST /api/v1/transactions/
- `TestGetTransactions`: GET /api/v1/transactions/
- `TestGetTransactionsByMonth`: GET /api/v1/transactions/month
- `TestGetTransactionById`: GET /api/v1/transactions/{id}
- `TestUpdateTransaction`: PUT /api/v1/transactions/{id}
- `TestDeleteTransaction`: DELETE /api/v1/transactions/{id}

#### test_category.py
- `TestGetCategories`: GET /api/v1/categories/
- `TestGetCategoryById`: GET /api/v1/categories/{id}

#### test_payment_method.py
- `TestGetPaymentMethods`: GET /api/v1/payment-methods/
- `TestGetPaymentMethodById`: GET /api/v1/payment-methods/{id}

## テスト結果の見方

### 成功例

```
tests/test_transaction.py::TestCreateTransaction::test_create_income_transaction PASSED [ 10%]
tests/test_transaction.py::TestCreateTransaction::test_create_expense_transaction PASSED [ 20%]
```

### 失敗例

```
tests/test_transaction.py::TestCreateTransaction::test_create_income_transaction FAILED [ 10%]

FAILED tests/test_transaction.py::TestCreateTransaction::test_create_income_transaction
AssertionError: assert 422 == 200
```

## カバレッジレポートの見方

カバレッジレポート（HTML）を開くと、以下が確認できます:

- 全体のコードカバレッジ率
- ファイルごとのカバレッジ率
- どの行がテストされているか（緑）、されていないか（赤）

目標: 80%以上のカバレッジを維持

## トラブルシューティング

### テストDBの問題

テストではインメモリSQLiteを使用しているため、MySQL固有の機能（一部の関数など）が動作しない場合があります。
その場合は、`conftest.py`でテスト用MySQLデータベースを使用するように変更してください。

### インポートエラー

```
ModuleNotFoundError: No module named 'app'
```

→ `server`ディレクトリから実行していることを確認してください。

### フィクスチャが見つからない

```
fixture 'sample_categories' not found
```

→ `conftest.py`が正しく配置されているか確認してください。

## CI/CDでの実行

GitHub Actionsなどで実行する場合の例:

```yaml
- name: Run tests
  run: |
    cd server
    pip install -r requirements.txt
    pytest --cov=app --cov-report=xml
```

## 参考リンク

- [pytest公式ドキュメント](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [pytest-cov](https://pytest-cov.readthedocs.io/)
