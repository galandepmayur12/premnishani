"""Orders: create, list, get, payment session, webhooks."""
import uuid
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from database import get_db
from models.order import Order, OrderItem
from models.product import Product
from models.user import User
from middleware.auth import get_current_user_optional, get_current_user
from schemas.order import OrderCreate, OrderResponse, OrderItemResponse
from services.coupon_service import validate_coupon
from services.payment_razorpay import create_razorpay_order, verify_razorpay_signature, amount_to_paise
from services.payment_stripe import create_stripe_payment_intent, amount_to_cents
from core.config import get_settings

router = APIRouter(prefix="/orders", tags=["orders"])
settings = get_settings()


def _order_number() -> str:
    return "PN-" + uuid.uuid4().hex[:10].upper()


async def _build_order_from_cart_or_items(db: AsyncSession, data: OrderCreate, user: User | None) -> Order:
    subtotal = Decimal(0)
    order_items = []
    for line in data.items:
        r = await db.execute(select(Product).where(Product.id == line.product_id))
        product = r.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {line.product_id} not found")
        if product.stock < line.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
        price = product.price
        subtotal += price * line.quantity
        order_items.append((product, line.quantity, price, line.customization_data))

    discount = Decimal(0)
    if data.coupon_code:
        ok, disc, _ = await validate_coupon(db, data.coupon_code, subtotal)
        if ok:
            discount = disc

    tax = (subtotal - discount) * Decimal("0.18")  # 18% GST placeholder
    total = subtotal - discount + tax

    order = Order(
        user_id=user.id if user else None,
        order_number=_order_number(),
        status="pending",
        payment_status="pending",
        payment_provider=data.payment_provider,
        total_price=total,
        subtotal=subtotal,
        tax=tax,
        discount=discount,
        coupon_code=data.coupon_code if data.coupon_code else None,
        shipping_name=data.shipping.full_name,
        shipping_phone=data.shipping.phone,
        shipping_email=data.shipping.email,
        shipping_address=data.shipping.address,
        shipping_city=data.shipping.city,
        shipping_state=data.shipping.state,
        shipping_zip=data.shipping.zip,
        shipping_country=data.shipping.country,
        gift_message=data.shipping.gift_message,
    )
    db.add(order)
    await db.flush()
    for product, qty, price, cust in order_items:
        oi = OrderItem(order_id=order.id, product_id=product.id, quantity=qty, price=price, customization_data=cust)
        db.add(oi)
    await db.flush()
    await db.refresh(order, ["items"])
    return order


@router.post("", response_model=OrderResponse)
async def create_order(
    data: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    order = await _build_order_from_cart_or_items(db, data, current_user)
    items_out = [
        OrderItemResponse(id=i.id, product_id=i.product_id, quantity=i.quantity, price=i.price, customization_data=i.customization_data)
        for i in order.items
    ]
    return OrderResponse(
        id=order.id,
        order_number=order.order_number,
        status=order.status,
        payment_status=order.payment_status,
        total_price=order.total_price,
        subtotal=order.subtotal,
        tax=order.tax,
        discount=order.discount,
        shipping_name=order.shipping_name,
        shipping_phone=order.shipping_phone,
        shipping_email=order.shipping_email,
        shipping_address=order.shipping_address,
        shipping_city=order.shipping_city,
        shipping_state=order.shipping_state,
        shipping_zip=order.shipping_zip,
        shipping_country=order.shipping_country,
        gift_message=order.gift_message,
        items=items_out,
        created_at=order.created_at,
    )


@router.post("/payment-session")
async def create_payment_session(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    r = await db.execute(select(Order).where(Order.id == order_id))
    order = r.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.payment_status != "pending":
        raise HTTPException(status_code=400, detail="Order already paid or cancelled")
    if order.payment_provider == "razorpay":
        amount_paise = amount_to_paise(order.total_price)
        rz = create_razorpay_order(amount_paise, order.order_number)
        return {"provider": "razorpay", "order_id": rz["id"], "amount": amount_paise, "currency": "INR", "key_id": settings.RAZORPAY_KEY_ID}
    elif order.payment_provider == "stripe":
        amount_cents = amount_to_cents(order.total_price)
        pi = create_stripe_payment_intent(amount_cents, order.order_number)
        return {"provider": "stripe", "client_secret": pi["client_secret"], "publishable_key": settings.STRIPE_PUBLISHABLE_KEY}
    raise HTTPException(status_code=400, detail="Unknown payment provider")


@router.post("/webhook/razorpay")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(None),
    db: AsyncSession = Depends(get_db),
):
    body = await request.body()
    # In production, verify signature using Razorpay webhook secret
    # payload = await request.json()
    # order_id = payload.get("payload", {}).get("order", {}).get("id")
    # payment_id = payload.get("payload", {}).get("payment", {}).get("entity", {}).get("id")
    # Then find Order by razorpay_order_id and set payment_status = "paid"
    return {"received": True}


@router.get("", response_model=list[OrderResponse])
async def list_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 50,
):
    r = await db.execute(
        select(Order).where(Order.user_id == current_user.id).order_by(Order.created_at.desc()).offset(skip).limit(limit).options(selectinload(Order.items))
    )
    orders = r.scalars().all()
    out = []
    for order in orders:
        items_out = [OrderItemResponse(id=i.id, product_id=i.product_id, quantity=i.quantity, price=i.price, customization_data=i.customization_data) for i in order.items]
        out.append(OrderResponse(
            id=order.id,
            order_number=order.order_number,
            status=order.status,
            payment_status=order.payment_status,
            total_price=order.total_price,
            subtotal=order.subtotal,
            tax=order.tax,
            discount=order.discount,
            shipping_name=order.shipping_name,
            shipping_phone=order.shipping_phone,
            shipping_email=order.shipping_email,
            shipping_address=order.shipping_address,
            shipping_city=order.shipping_city,
            shipping_state=order.shipping_state,
            shipping_zip=order.shipping_zip,
            shipping_country=order.shipping_country,
            gift_message=order.gift_message,
            items=items_out,
            created_at=order.created_at,
        ))
    return out


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    r = await db.execute(select(Order).where(Order.id == order_id, Order.user_id == current_user.id).options(selectinload(Order.items)))
    order = r.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    items_out = [OrderItemResponse(id=i.id, product_id=i.product_id, quantity=i.quantity, price=i.price, customization_data=i.customization_data) for i in order.items]
    return OrderResponse(
        id=order.id,
        order_number=order.order_number,
        status=order.status,
        payment_status=order.payment_status,
        total_price=order.total_price,
        subtotal=order.subtotal,
        tax=order.tax,
        discount=order.discount,
        shipping_name=order.shipping_name,
        shipping_phone=order.shipping_phone,
        shipping_email=order.shipping_email,
        shipping_address=order.shipping_address,
        shipping_city=order.shipping_city,
        shipping_state=order.shipping_state,
        shipping_zip=order.shipping_zip,
        shipping_country=order.shipping_country,
        gift_message=order.gift_message,
        items=items_out,
        created_at=order.created_at,
    )
