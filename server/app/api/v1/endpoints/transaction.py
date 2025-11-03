from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import extract

from ....core.database import get_db
from ....models.transaction import Transaction as TransactionModel
from ....schemas.transaction import Transaction, TransactionCreate

router = APIRouter()

# Transaction endpoints
@router.post("/transactions/", response_model=Transaction)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db)
):
    db_transaction = TransactionModel(**transaction.model_dump())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# すべてのtransactionを取得
@router.get("/transactions/", response_model=List[Transaction])
def read_transactions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    transactions: List[Transaction] = db.query(TransactionModel).offset(skip).limit(limit).all()
    return transactions

# 月別でtransactionを取得 (例: month=2025/11)
@router.get("/transactions/month", response_model=List[Transaction])
def read_transactions_by_month(
    month: str = Query(..., description="Format: YYYY/MM"),
    db: Session = Depends(get_db)
):
    try:
        # "2025/11" を年と月に分割
        year, month_num = month.split('/')
        year = int(year)
        month_num = int(month_num)
        
        # その月のトランザクションを取得
        transactions = db.query(TransactionModel).filter(
            extract('year', TransactionModel.date) == year,
            extract('month', TransactionModel.date) == month_num
        ).all()
        
        return transactions
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid month format. Expected format: YYYY/MM")

# idでtransactionを取得
@router.get("/transactions/{transaction_id}", response_model=Transaction)
def read_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction: Transaction = db.query(TransactionModel).filter(TransactionModel.id == transaction_id).first()
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.put("/transactions/{transaction_id}", response_model=Transaction)
def update_transaction(
    transaction_id: int,
    transaction: TransactionCreate,
    db: Session = Depends(get_db)
):
    db_transaction = db.query(TransactionModel).filter(TransactionModel.id == transaction_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    for key, value in transaction.model_dump().items():
        setattr(db_transaction, key, value)
    
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.delete("/transactions/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):
    db_transaction = db.query(TransactionModel).filter(TransactionModel.id == transaction_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    db.delete(db_transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}