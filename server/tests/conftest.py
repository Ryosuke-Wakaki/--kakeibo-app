"""
Pytestの共通設定とフィクスチャ
テストDB接続、テストクライアント、テストデータのセットアップを提供
"""
import sys
from pathlib import Path

# プロジェクトルートをPythonパスに追加
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.models.transaction import Category, PaymentMethod, Transaction
from main import app

# テスト用のインメモリSQLiteデータベースを使用
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """
    テスト用データベースセッションを提供
    各テスト関数ごとに新しいDBを作成し、テスト後にクリーンアップ
    """
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """
    FastAPIテストクライアントを提供
    テスト用DBセッションを使用するようにオーバーライド
    """
    def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def sample_categories(db_session):
    """
    テスト用のサンプルカテゴリーを作成
    """
    categories = [
        Category(code="01", name="食費", description="食料品、外食など", display_order=1, is_active=True),
        Category(code="02", name="交通費", description="電車、バス、タクシーなど", display_order=2, is_active=True),
        Category(code="03", name="給与", description="月給、ボーナスなど", display_order=3, is_active=True),
    ]
    for category in categories:
        db_session.add(category)
    db_session.commit()
    for category in categories:
        db_session.refresh(category)
    return categories


@pytest.fixture(scope="function")
def sample_payment_methods(db_session):
    """
    テスト用のサンプル支払い方法を作成
    """
    payment_methods = [
        PaymentMethod(code="01", name="現金", description="現金での支払い", display_order=1, is_active=True),
        PaymentMethod(code="02", name="クレジットカード", description="クレジットカードでの支払い", display_order=2, is_active=True),
    ]
    for pm in payment_methods:
        db_session.add(pm)
    db_session.commit()
    for pm in payment_methods:
        db_session.refresh(pm)
    return payment_methods


@pytest.fixture(scope="function")
def sample_transactions(db_session, sample_categories, sample_payment_methods):
    """
    テスト用のサンプルトランザクションを作成
    """
    from datetime import date
    transactions = [
        Transaction(
            date=date(2025, 11, 1),
            transaction_type="01",
            category_id=sample_categories[2].id,  # 給与
            amount=300000,
            payment_method_id=None,
            description="11月給与"
        ),
        Transaction(
            date=date(2025, 11, 3),
            transaction_type="02",
            category_id=sample_categories[0].id,  # 食費
            amount=1500,
            payment_method_id=sample_payment_methods[0].id,  # 現金
            description="ランチ"
        ),
        Transaction(
            date=date(2025, 11, 3),
            transaction_type="02",
            category_id=sample_categories[1].id,  # 交通費
            amount=500,
            payment_method_id=sample_payment_methods[1].id,  # クレジットカード
            description="電車代"
        ),
    ]
    for transaction in transactions:
        db_session.add(transaction)
    db_session.commit()
    for transaction in transactions:
        db_session.refresh(transaction)
    return transactions
