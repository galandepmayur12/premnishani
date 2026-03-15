"""Coupon validation endpoint."""
from pydantic import BaseModel
from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from services.coupon_service import validate_coupon

router = APIRouter(prefix="/coupon", tags=["coupon"])


class CouponValidateRequest(BaseModel):
    code: str
    subtotal: Decimal


@router.post("/validate")
async def validate(
    data: CouponValidateRequest,
    db: AsyncSession = Depends(get_db),
):
    valid, discount, message = await validate_coupon(db, data.code, data.subtotal)
    return {"valid": valid, "discount": float(discount), "message": message}
