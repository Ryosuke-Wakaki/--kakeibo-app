from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ....core.database import get_db
from ....models.transaction import Transaction as TransactionModel
from ....models.transaction import Category as CategoryModel
from ....models.transaction import PaymentMethod as PaymentMethodModel
from ....schemas.transaction import (
    Transaction, TransactionCreate,
    Category, CategoryCreate,
    PaymentMethod, PaymentMethodCreate
)

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

@router.get("/transactions/", response_model=List[Transaction])
def read_transactions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    transactions = db.query(TransactionModel).offset(skip).limit(limit).all()
    return transactions

@router.get("/transactions/{transaction_id}", response_model=Transaction)
def read_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(TransactionModel).filter(TransactionModel.id == transaction_id).first()
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

# Category endpoints
@router.get("/categories/", response_model=List[Category])
def read_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    categories = db.query(CategoryModel).offset(skip).limit(limit).all()
    return categories

@router.get("/categories/{category_id}", response_model=Category)
def read_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

# Payment Method endpoints
@router.get("/payment-methods/", response_model=List[PaymentMethod])
def read_payment_methods(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    payment_methods = db.query(PaymentMethodModel).offset(skip).limit(limit).all()
    return payment_methods

@router.get("/payment-methods/{payment_method_id}", response_model=PaymentMethod)
def read_payment_method(payment_method_id: int, db: Session = Depends(get_db)):
    payment_method = db.query(PaymentMethodModel).filter(PaymentMethodModel.id == payment_method_id).first()
    if payment_method is None:
        raise HTTPException(status_code=404, detail="Payment method not found")
    return payment_method