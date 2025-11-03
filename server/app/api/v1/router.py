from fastapi import APIRouter
from .endpoints import transaction, category, payment_method

api_router = APIRouter()
api_router.include_router(transaction.router, tags=["transactions"])
api_router.include_router(category.router, tags=["categories"])
api_router.include_router(payment_method.router, tags=["payment-methods"])