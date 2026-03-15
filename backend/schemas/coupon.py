"""Coupon schemas."""
from pydantic import BaseModel
from decimal import Decimal
from typing import Optional
from datetime import datetime


class CouponCreate(BaseModel):
    code: str
    discount_type: str  # percentage | fixed
    discount_value: Decimal
    min_order_value: Optional[Decimal] = None
    max_uses: Optional[int] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None


class CouponResponse(BaseModel):
    id: int
    code: str
    discount_type: str
    discount_value: Decimal
    min_order_value: Optional[Decimal] = None
    is_active: bool

    class Config:
        from_attributes = True


class CouponValidate(BaseModel):
    code: str
    subtotal: Decimal
