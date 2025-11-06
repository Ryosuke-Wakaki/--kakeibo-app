"""
取引データのAPIエンドポイント

このモジュールはHTTPリクエストの処理とバリデーションのみを担当し、
ビジネスロジックはサービス層に委譲している。
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ....core.database import get_db
from ....schemas.transaction import Transaction, TransactionCreate
from ....services import transaction_service

router = APIRouter()


@router.post("/transactions/", response_model=Transaction)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db)
):
    """新規取引を作成"""
    return transaction_service.create_transaction(db, transaction)


@router.get("/transactions/", response_model=List[Transaction])
def read_transactions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """取引データを一覧取得"""
    return transaction_service.get_transactions(db, skip, limit)


@router.get("/transactions/month", response_model=List[Transaction])
def read_transactions_by_month(
    month: str = Query(..., description="Format: YYYY/MM"),
    db: Session = Depends(get_db)
):
    """
    指定月の取引データを取得
    
    Args:
        month: YYYY/MM形式の月指定（例: 2025/11）
    """
    try:
        year, month_num = month.split('/')
        year = int(year)
        month_num = int(month_num)
    except ValueError:
        raise HTTPException(
            status_code=422,
            detail="Invalid month format. Expected format: YYYY/MM"
        )
    
    return transaction_service.get_transactions_by_month(db, year, month_num)


@router.get("/transactions/{transaction_id}", response_model=Transaction)
def read_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):
    """IDで取引データを取得"""
    transaction = transaction_service.get_transaction_by_id(db, transaction_id)
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@router.put("/transactions/{transaction_id}", response_model=Transaction)
def update_transaction(
    transaction_id: int,
    transaction: TransactionCreate,
    db: Session = Depends(get_db)
):
    """取引データを更新"""
    updated_transaction = transaction_service.update_transaction(
        db, transaction_id, transaction
    )
    if updated_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return updated_transaction


@router.delete("/transactions/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):
    """取引データを削除"""
    success = transaction_service.delete_transaction(db, transaction_id)
    if not success:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted successfully"}
