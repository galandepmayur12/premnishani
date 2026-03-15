"""Product schemas."""
from pydantic import BaseModel
from decimal import Decimal
from typing import Optional, List, Any
from datetime import datetime


class ProductImageSchema(BaseModel):
    id: int
    url: str
    alt: Optional[str] = None
    sort_order: int = 0

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    price: Decimal
    compare_at_price: Optional[Decimal] = None
    category: str
    stock: int = 0
    customizable: bool = False
    customization_schema: Optional[dict] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    compare_at_price: Optional[Decimal] = None
    category: Optional[str] = None
    stock: Optional[int] = None
    customizable: Optional[bool] = None
    customization_schema: Optional[dict] = None
    is_active: Optional[bool] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    price: Decimal
    compare_at_price: Optional[Decimal] = None
    category: str
    stock: int
    customizable: bool
    customization_schema: Optional[dict] = None
    is_active: bool
    images: List[ProductImageSchema] = []
    created_at: datetime

    class Config:
        from_attributes = True


class ProductList(BaseModel):
    id: int
    name: str
    slug: str
    price: Decimal
    category: str
    customizable: bool
    image_url: Optional[str] = None

    class Config:
        from_attributes = True
