from pydantic import BaseModel
from decimal import Decimal
from datetime import date
from typing import Optional

class TransactionBase(BaseModel):
    date: date
    transaction_type: str  # '01' (income) or '02' (expense)
    category_id: int
    amount: Decimal
    payment_method_id: Optional[int] = None
    description: Optional[str] = None
    tags: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    created_at: date
    updated_at: date

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    created_at: date
    updated_at: date

    class Config:
        from_attributes = True

class PaymentMethodBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class PaymentMethodCreate(PaymentMethodBase):
    pass

class PaymentMethod(PaymentMethodBase):
    id: int
    created_at: date
    updated_at: date

    class Config:
        from_attributes = True