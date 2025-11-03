"""
Category API のテスト

テストケース仕様書: tests/TEST_CASES.md の「2. Category API テストケース」を参照
"""
import pytest


class TestGetCategories:
    """GET /api/v1/categories/ のテスト"""

    def test_get_all_categories(self, client, sample_categories):
        """
        全カテゴリーの取得
        登録済みのすべてのカテゴリーが取得できることを確認
        """
        response = client.get("/api/v1/categories/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3
        assert isinstance(data, list)
        
        # カテゴリー名が正しく取得できているか確認
        category_names = [cat["name"] for cat in data]
        assert "食費" in category_names
        assert "交通費" in category_names
        assert "給与" in category_names

    def test_get_categories_with_pagination(self, client, sample_categories):
        """
        ページネーション機能の確認
        skip と limit パラメータで取得件数を制御できることを確認
        """
        response = client.get("/api/v1/categories/?skip=1&limit=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2

    def test_get_categories_empty_database(self, client):
        """
        データが存在しない場合の動作確認
        空のデータベースでも正常に空配列が返ることを確認
        """
        response = client.get("/api/v1/categories/")
        assert response.status_code == 200
        data = response.json()
        assert data == []

    def test_category_structure(self, client, sample_categories):
        """
        カテゴリーのデータ構造確認
        返却されるデータに必要なフィールドが含まれていることを確認
        """
        response = client.get("/api/v1/categories/")
        assert response.status_code == 200
        data = response.json()
        
        category = data[0]
        assert "id" in category
        assert "code" in category
        assert "name" in category
        assert "description" in category
        assert "display_order" in category
        assert "is_active" in category
        assert "created_at" in category
        assert "updated_at" in category


class TestGetCategoryById:
    """GET /api/v1/categories/{category_id} のテスト"""

    def test_get_existing_category(self, client, sample_categories):
        """
        存在するカテゴリーの取得
        指定IDのカテゴリーが正しく取得できることを確認
        """
        category_id = sample_categories[0].id
        response = client.get(f"/api/v1/categories/{category_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == category_id
        assert data["name"] == "食費"
        assert data["code"] == "01"

    def test_get_nonexistent_category(self, client):
        """
        存在しないカテゴリーの取得
        存在しないIDを指定した場合は404エラーになることを確認
        """
        response = client.get("/api/v1/categories/9999")
        assert response.status_code == 404
        data = response.json()
        assert data["detail"] == "Category not found"

    def test_get_category_invalid_id_type(self, client):
        """
        不正なID型でのリクエスト
        IDに文字列を指定した場合はバリデーションエラーになることを確認
        """
        response = client.get("/api/v1/categories/abc")
        assert response.status_code == 422

    def test_get_category_by_id_with_description(self, client, sample_categories):
        """
        説明付きカテゴリーの取得確認
        description フィールドが正しく取得できることを確認
        """
        category_id = sample_categories[0].id
        response = client.get(f"/api/v1/categories/{category_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["description"] == "食料品、外食など"
