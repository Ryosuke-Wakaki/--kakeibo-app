from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ....core.database import get_db
from ....models.transaction import PaymentMethod as PaymentMethodModel
from ....schemas.transaction import PaymentMethod

router = APIRouter()
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