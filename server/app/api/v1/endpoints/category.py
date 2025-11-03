from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ....core.database import get_db
from ....models.transaction import Transaction as TransactionModel
from ....models.transaction import Category as CategoryModel
from ....models.transaction import PaymentMethod as PaymentMethodModel
from ....schemas.transaction import Category

router = APIRouter()
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