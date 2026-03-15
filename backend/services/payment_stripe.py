"""Stripe payment service."""
import stripe
from decimal import Decimal
from core.config import get_settings

settings = get_settings()
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY


def create_stripe_payment_intent(amount_cents: int, order_id: str, currency: str = "inr") -> dict:
    return stripe.PaymentIntent.create(
        amount=amount_cents,
        currency=currency,
        metadata={"order_id": order_id},
        automatic_payment_methods={"enabled": True},
    )


def amount_to_cents(amount: Decimal) -> int:
    return int(amount * 100)
