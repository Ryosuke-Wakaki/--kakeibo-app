from enum import Enum
from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, CHAR, Numeric, VARCHAR, TIMESTAMP
from sqlalchemy.sql import func
from ..core.database import Base

class TransactionType(str, Enum):
    INCOME = '01'
    EXPENSE = '02'

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(2), unique=True, nullable=False)
    name = Column(String(50), nullable=False)
    transaction_type = Column(CHAR(2), nullable=False)  # '01': 収入, '02': 支出
    description = Column(String(255))
    display_order = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class PaymentMethod(Base):
    __tablename__ = "payment_methods"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(2), unique=True, nullable=False)
    name = Column(String(50), nullable=False)
    description = Column(String(255))
    display_order = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    transaction_type = Column(CHAR(2), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_method_id = Column(Integer, ForeignKey("payment_methods.id"))
    description = Column(VARCHAR(255))
    tags = Column(VARCHAR(255))
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())