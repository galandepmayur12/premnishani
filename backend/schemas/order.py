"""Order schemas."""
from pydantic import BaseModel
from decimal import Decimal
from typing import Optional, List
from datetime import datetime


class ShippingInfo(BaseModel):
    full_name: str
    phone: str
    email: str
    address: str
    city: str
    state: str
    zip: str
    country: str
    gift_message: Optional[str] = None


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    customization_data: Optional[dict] = None


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping: ShippingInfo
    coupon_code: Optional[str] = None
    payment_provider: str  # razorpay | stripe


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: Decimal
    customization_data: Optional[dict] = None

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    order_number: str
    status: str
    payment_status: str
    total_price: Decimal
    subtotal: Decimal
    tax: Decimal
    discount: Decimal
    shipping_name: str
    shipping_phone: str
    shipping_email: str
    shipping_address: str
    shipping_city: str
    shipping_state: str
    shipping_zip: str
    shipping_country: str
    gift_message: Optional[str] = None
    items: List[OrderItemResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None
