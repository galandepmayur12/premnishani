"""Razorpay payment service."""
import razorpay
from decimal import Decimal
from core.config import get_settings

settings = get_settings()
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)) if settings.RAZORPAY_KEY_ID else None


def create_razorpay_order(amount_paise: int, order_id: str, currency: str = "INR") -> dict:
    if not client:
        raise RuntimeError("Razorpay not configured")
    data = {
        "amount": amount_paise,
        "currency": currency,
        "receipt": order_id,
    }
    return client.order.create(data=data)


def verify_razorpay_signature(order_id: str, payment_id: str, signature: str) -> bool:
    if not client:
        return False
    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature,
        })
        return True
    except Exception:
        return False


def amount_to_paise(amount: Decimal) -> int:
    return int(amount * 100)
