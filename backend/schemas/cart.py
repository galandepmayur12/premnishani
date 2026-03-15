"""Cart schemas."""
from pydantic import BaseModel
from decimal import Decimal
from typing import Optional, List
from datetime import datetime


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1
    customization_data: Optional[dict] = None


class CartItemUpdate(BaseModel):
    quantity: Optional[int] = None


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: Decimal
    customization_data: Optional[dict] = None

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    id: int
    items: List[CartItemResponse] = []
    total: Optional[Decimal] = None

    class Config:
        from_attributes = True
