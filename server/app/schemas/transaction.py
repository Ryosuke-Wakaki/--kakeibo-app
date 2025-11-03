from pydantic import BaseModel, Field, field_validator
from decimal import Decimal
from datetime import date, datetime
from typing import Optional, Literal

class TransactionBase(BaseModel):
    date: date
    transaction_type: Literal['01', '02']  # '01' (income) or '02' (expense)
    category_id: int
    amount: Decimal = Field(ge=0, description="金額は0以上")
    payment_method_id: Optional[int] = None
    description: Optional[str] = None
    tags: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    created_at: datetime
    updated_at: datetime

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
    created_at: datetime
    updated_at: datetime

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
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True