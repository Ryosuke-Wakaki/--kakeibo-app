"""
Payment Method API のテスト

テストケース仕様書: tests/TEST_CASES.md の「3. Payment Method API テストケース」を参照
"""
import pytest


class TestGetPaymentMethods:
    """GET /api/v1/payment-methods/ のテスト"""

    def test_get_all_payment_methods(self, client, sample_payment_methods):
        """
        全支払い方法の取得
        登録済みのすべての支払い方法が取得できることを確認
        """
        response = client.get("/api/v1/payment-methods/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert isinstance(data, list)
        
        # 支払い方法名が正しく取得できているか確認
        payment_method_names = [pm["name"] for pm in data]
        assert "現金" in payment_method_names
        assert "クレジットカード" in payment_method_names

    def test_get_payment_methods_with_pagination(self, client, sample_payment_methods):
        """
        ページネーション機能の確認
        skip と limit パラメータで取得件数を制御できることを確認
        """
        response = client.get("/api/v1/payment-methods/?skip=0&limit=1")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1

    def test_get_payment_methods_empty_database(self, client):
        """
        データが存在しない場合の動作確認
        空のデータベースでも正常に空配列が返ることを確認
        """
        response = client.get("/api/v1/payment-methods/")
        assert response.status_code == 200
        data = response.json()
        assert data == []

    def test_payment_method_structure(self, client, sample_payment_methods):
        """
        支払い方法のデータ構造確認
        返却されるデータに必要なフィールドが含まれていることを確認
        """
        response = client.get("/api/v1/payment-methods/")
        assert response.status_code == 200
        data = response.json()
        
        payment_method = data[0]
        assert "id" in payment_method
        assert "code" in payment_method
        assert "name" in payment_method
        assert "description" in payment_method
        assert "display_order" in payment_method
        assert "is_active" in payment_method
        assert "created_at" in payment_method
        assert "updated_at" in payment_method

    def test_payment_methods_sorted_by_display_order(self, client, sample_payment_methods):
        """
        表示順の確認
        支払い方法が display_order でソートされていることを確認
        """
        response = client.get("/api/v1/payment-methods/")
        assert response.status_code == 200
        data = response.json()
        
        # display_order が昇順になっているか確認
        display_orders = [pm["display_order"] for pm in data]
        assert display_orders == sorted(display_orders)


class TestGetPaymentMethodById:
    """GET /api/v1/payment-methods/{payment_method_id} のテスト"""

    def test_get_existing_payment_method(self, client, sample_payment_methods):
        """
        存在する支払い方法の取得
        指定IDの支払い方法が正しく取得できることを確認
        """
        payment_method_id = sample_payment_methods[0].id
        response = client.get(f"/api/v1/payment-methods/{payment_method_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == payment_method_id
        assert data["name"] == "現金"
        assert data["code"] == "01"

    def test_get_nonexistent_payment_method(self, client):
        """
        存在しない支払い方法の取得
        存在しないIDを指定した場合は404エラーになることを確認
        """
        response = client.get("/api/v1/payment-methods/9999")
        assert response.status_code == 404
        data = response.json()
        assert data["detail"] == "Payment method not found"

    def test_get_payment_method_invalid_id_type(self, client):
        """
        不正なID型でのリクエスト
        IDに文字列を指定した場合はバリデーションエラーになることを確認
        """
        response = client.get("/api/v1/payment-methods/abc")
        assert response.status_code == 422

    def test_get_payment_method_by_id_with_description(self, client, sample_payment_methods):
        """
        説明付き支払い方法の取得確認
        description フィールドが正しく取得できることを確認
        """
        payment_method_id = sample_payment_methods[1].id
        response = client.get(f"/api/v1/payment-methods/{payment_method_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["description"] == "クレジットカードでの支払い"

    def test_get_payment_method_code_format(self, client, sample_payment_methods):
        """
        コード値のフォーマット確認
        code が2桁のゼロ埋め文字列形式であることを確認
        """
        payment_method_id = sample_payment_methods[0].id
        response = client.get(f"/api/v1/payment-methods/{payment_method_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["code"] == "01"
        assert len(data["code"]) == 2
