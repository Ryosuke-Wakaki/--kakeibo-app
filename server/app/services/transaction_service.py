"""
取引データのビジネスロジックを提供するサービス層

このモジュールは純粋関数として実装され、データベースセッションを引数として受け取る。
テスト容易性を考慮し、副作用を最小限に抑えている。
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import extract

from ..models.transaction import Transaction as TransactionModel
from ..schemas.transaction import TransactionCreate


def create_transaction(db: Session, transaction_data: TransactionCreate) -> TransactionModel:
    """
    新規取引を作成する
    
    Args:
        db: データベースセッション
        transaction_data: 取引作成データ
        
    Returns:
        作成された取引データ
    """
    db_transaction = TransactionModel(**transaction_data.model_dump())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def get_transactions(
    db: Session,
    skip: int = 0,
    limit: int = 100
) -> List[TransactionModel]:
    """
    取引データを一覧取得する
    
    Args:
        db: データベースセッション
        skip: スキップする件数
        limit: 取得する最大件数
        
    Returns:
        取引データのリスト
    """
    return db.query(TransactionModel).offset(skip).limit(limit).all()


def get_transactions_by_month(db: Session, year: int, month: int) -> List[TransactionModel]:
    """
    指定された年月の取引データを取得する
    
    Args:
        db: データベースセッション
        year: 年（4桁）
        month: 月（1-12）
        
    Returns:
        指定月の取引データリスト
    """
    return db.query(TransactionModel).filter(
        extract('year', TransactionModel.date) == year,
        extract('month', TransactionModel.date) == month
    ).all()


def get_transaction_by_id(db: Session, transaction_id: int) -> Optional[TransactionModel]:
    """
    IDで取引データを取得する
    
    Args:
        db: データベースセッション
        transaction_id: 取引ID
        
    Returns:
        取引データ、存在しない場合はNone
    """
    return db.query(TransactionModel).filter(
        TransactionModel.id == transaction_id
    ).first()


def update_transaction(
    db: Session,
    transaction_id: int,
    transaction_data: TransactionCreate
) -> Optional[TransactionModel]:
    """
    取引データを更新する
    
    Args:
        db: データベースセッション
        transaction_id: 取引ID
        transaction_data: 更新データ
        
    Returns:
        更新された取引データ、存在しない場合はNone
    """
    db_transaction = get_transaction_by_id(db, transaction_id)
    if db_transaction is None:
        return None
    
    for key, value in transaction_data.model_dump().items():
        setattr(db_transaction, key, value)
    
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def delete_transaction(db: Session, transaction_id: int) -> bool:
    """
    取引データを削除する
    
    Args:
        db: データベースセッション
        transaction_id: 取引ID
        
    Returns:
        削除成功の場合True、対象が存在しない場合False
    """
    db_transaction = get_transaction_by_id(db, transaction_id)
    if db_transaction is None:
        return False
    
    db.delete(db_transaction)
    db.commit()
    return True
