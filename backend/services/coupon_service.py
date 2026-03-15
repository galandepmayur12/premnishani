"""Coupon validation service."""
from datetime import datetime
from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.coupon import Coupon


async def validate_coupon(db: AsyncSession, code: str, subtotal: Decimal) -> tuple[bool, Decimal, str]:
    """
    Returns (valid, discount_amount, message).
    """
    result = await db.execute(select(Coupon).where(Coupon.code == code.upper().strip(), Coupon.is_active == True))
    coupon = result.scalar_one_or_none()
    if not coupon:
        return False, Decimal(0), "Invalid coupon"
    now = datetime.utcnow()
    if coupon.valid_from and now < coupon.valid_from:
        return False, Decimal(0), "Coupon not yet valid"
    if coupon.valid_until and now > coupon.valid_until:
        return False, Decimal(0), "Coupon expired"
    if coupon.min_order_value and subtotal < coupon.min_order_value:
        return False, Decimal(0), f"Minimum order value is {coupon.min_order_value}"
    if coupon.max_uses and coupon.used_count >= coupon.max_uses:
        return False, Decimal(0), "Coupon limit reached"
    if coupon.discount_type == "percentage":
        discount = (subtotal * coupon.discount_value / 100).quantize(Decimal("0.01"))
    else:
        discount = min(coupon.discount_value, subtotal)
    return True, discount, "Applied"
