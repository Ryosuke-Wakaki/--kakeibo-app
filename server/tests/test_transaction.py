"""
Transaction API のテスト

テストケース仕様書: tests/TEST_CASES.md の「1. Transaction API テストケース」を参照
"""
import pytest
from datetime import date


class TestCreateTransaction:
    """POST /api/v1/transactions/ のテスト"""

    def test_create_income_transaction(self, client, sample_categories):
        """
        収入トランザクションの正常登録
        取引種別='01'(収入)、カテゴリー=給与で登録できることを確認
        """
        response = client.post(
            "/api/v1/transactions/",
            json={
                "date": "2025-11-03",
                "transaction_type": "01",
                "category_id": sample_categories[2].id,  # 給与
                "amount": 300000,
                "payment_method_id": None,
                "description": "給与"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["transaction_type"] == "01"
        assert data["amount"] == "300000.00"
        assert "id" in data

    def test_create_expense_transaction(self, client, sample_categories, sample_payment_methods):
        """
        支出トランザクションの正常登録
        取引種別='02'(支出)、カテゴリー=食費、支払い方法=現金で登録できることを確認
        """
        response = client.post(
            "/api/v1/transactions/",
            json={
                "date": "2025-11-03",
                "transaction_type": "02",
                "category_id": sample_categories[0].id,  # 食費
                "amount": 1500,
                "payment_method_id": sample_payment_methods[0].id,  # 現金
                "description": "ランチ"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["transaction_type"] == "02"
        assert float(data["amount"]) == 1500.00

    def test_create_transaction_missing_required_fields(self, client):
        """
        必須項目不足時のバリデーションエラー
        category_id と amount が必須項目であることを確認
        """
        response = client.post(
            "/api/v1/transactions/",
            json={
                "date": "2025-11-03",
                "transaction_type": "01"
            }
        )
        assert response.status_code == 422

    def test_create_transaction_invalid_transaction_type(self, client, sample_categories):
        """
        不正な取引種別でのバリデーションエラー
        transaction_type は '01' または '02' のみ許可されることを確認
        """
        response = client.post(
            "/api/v1/transactions/",
            json={
                "date": "2025-11-03",
                "transaction_type": "99",
                "category_id": sample_categories[0].id,
                "amount": 1000
            }
        )
        assert response.status_code == 422

    def test_create_transaction_invalid_date_format(self, client, sample_categories):
        """
        不正な日付フォーマットでのバリデーションエラー
        日付は YYYY-MM-DD 形式であることを確認
        """
        response = client.post(
            "/api/v1/transactions/",
            json={
                "date": "2025/11/03",  # スラッシュ区切りは不可
                "transaction_type": "02",
                "category_id": sample_categories[0].id,
                "amount": 1000
            }
        )
        assert response.status_code == 422


class TestGetTransactions:
    """GET /api/v1/transactions/ のテスト"""

    def test_get_all_transactions(self, client, sample_transactions):
        """
        全トランザクションの取得
        登録済みのすべてのトランザクションが取得できることを確認
        """
        response = client.get("/api/v1/transactions/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3
        assert isinstance(data, list)

    def test_get_transactions_with_pagination(self, client, sample_transactions):
        """
        ページネーション機能の確認
        skip と limit パラメータで取得件数を制御できることを確認
        """
        response = client.get("/api/v1/transactions/?skip=1&limit=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2

    def test_get_transactions_empty_database(self, client):
        """
        データが存在しない場合の動作確認
        空のデータベースでも正常に空配列が返ることを確認
        """
        response = client.get("/api/v1/transactions/")
        assert response.status_code == 200
        data = response.json()
        assert data == []


class TestGetTransactionsByMonth:
    """GET /api/v1/transactions/month のテスト"""

    def test_get_transactions_by_valid_month(self, client, sample_transactions):
        """
        月別トランザクション取得(正常系)
        指定した月のトランザクションのみが取得できることを確認
        """
        response = client.get("/api/v1/transactions/month?month=2025/11")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3
        # すべて2025年11月のデータであることを確認
        for transaction in data:
            assert transaction["date"].startswith("2025-11")

    def test_get_transactions_by_month_no_data(self, client, sample_transactions):
        """
        データが存在しない月の取得
        該当データがない月でも正常に空配列が返ることを確認
        """
        response = client.get("/api/v1/transactions/month?month=2025/12")
        assert response.status_code == 200
        data = response.json()
        assert data == []

    def test_get_transactions_by_month_invalid_format_no_slash(self, client):
        """
        不正な月フォーマット(スラッシュなし)
        YYYY/MM 形式でない場合はエラーになることを確認
        """
        response = client.get("/api/v1/transactions/month?month=202511")
        assert response.status_code == 422

    def test_get_transactions_by_month_invalid_format_hyphen(self, client):
        """
        不正な月フォーマット(ハイフン区切り)
        ハイフン区切りの場合はエラーになることを確認
        """
        response = client.get("/api/v1/transactions/month?month=2025-11")
        assert response.status_code == 422

    def test_get_transactions_by_month_missing_parameter(self, client):
        """
        月パラメータなしでのリクエスト
        必須パラメータが指定されていない場合はエラーになることを確認
        """
        response = client.get("/api/v1/transactions/month")
        assert response.status_code == 422


class TestGetTransactionById:
    """GET /api/v1/transactions/{transaction_id} のテスト"""

    def test_get_existing_transaction(self, client, sample_transactions):
        """
        存在するトランザクションの取得
        指定IDのトランザクションが正しく取得できることを確認
        """
        transaction_id = sample_transactions[0].id
        response = client.get(f"/api/v1/transactions/{transaction_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == transaction_id

    def test_get_nonexistent_transaction(self, client):
        """
        存在しないトランザクションの取得
        存在しないIDを指定した場合は404エラーになることを確認
        """
        response = client.get("/api/v1/transactions/9999")
        assert response.status_code == 404

    def test_get_transaction_invalid_id_type(self, client):
        """
        不正なID型でのリクエスト
        IDに文字列を指定した場合はバリデーションエラーになることを確認
        """
        response = client.get("/api/v1/transactions/abc")
        assert response.status_code == 422


class TestUpdateTransaction:
    """PUT /api/v1/transactions/{transaction_id} のテスト"""

    def test_update_existing_transaction(self, client, sample_transactions, sample_categories):
        """
        トランザクションの正常更新
        既存のトランザクションが正しく更新できることを確認
        """
        transaction_id = sample_transactions[1].id
        response = client.put(
            f"/api/v1/transactions/{transaction_id}",
            json={
                "date": "2025-11-04",
                "transaction_type": "02",
                "category_id": sample_categories[0].id,
                "amount": 2000,
                "description": "更新後のランチ"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["date"] == "2025-11-04"
        assert float(data["amount"]) == 2000.00
        assert data["description"] == "更新後のランチ"

    def test_update_nonexistent_transaction(self, client, sample_categories):
        """
        存在しないトランザクションの更新
        存在しないIDを指定した場合は404エラーになることを確認
        """
        response = client.put(
            "/api/v1/transactions/9999",
            json={
                "date": "2025-11-04",
                "transaction_type": "02",
                "category_id": sample_categories[0].id,
                "amount": 2000
            }
        )
        assert response.status_code == 404


class TestDeleteTransaction:
    """DELETE /api/v1/transactions/{transaction_id} のテスト"""

    def test_delete_existing_transaction(self, client, sample_transactions):
        """
        トランザクションの正常削除
        指定したトランザクションが削除されることを確認
        """
        transaction_id = sample_transactions[0].id
        response = client.delete(f"/api/v1/transactions/{transaction_id}")
        assert response.status_code == 200
        assert response.json()["message"] == "Transaction deleted successfully"
        
        # 削除後に取得できないことを確認
        get_response = client.get(f"/api/v1/transactions/{transaction_id}")
        assert get_response.status_code == 404

    def test_delete_nonexistent_transaction(self, client):
        """
        存在しないトランザクションの削除
        存在しないIDを指定した場合は404エラーになることを確認
        """
        response = client.delete("/api/v1/transactions/9999")
        assert response.status_code == 404

    def test_delete_already_deleted_transaction(self, client, sample_transactions):
        """
        削除済みトランザクションの再削除
        一度削除したトランザクションを再度削除しようとすると404エラーになることを確認
        """
        transaction_id = sample_transactions[0].id
        # 1回目の削除
        client.delete(f"/api/v1/transactions/{transaction_id}")
        # 2回目の削除
        response = client.delete(f"/api/v1/transactions/{transaction_id}")
        assert response.status_code == 404
