"""Cart: get, add, update, remove."""
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from database import get_db
from models.cart import Cart, CartItem
from models.product import Product
from middleware.auth import get_current_user_optional
from models.user import User
from schemas.cart import CartItemCreate, CartItemResponse, CartResponse, CartItemUpdate

router = APIRouter(prefix="/cart", tags=["cart"])


async def get_or_create_cart(db: AsyncSession, user: Optional[User], session_id: Optional[str]) -> Cart:
    if user:
        r = await db.execute(select(Cart).where(Cart.user_id == user.id).limit(1))
        cart = r.scalar_one_or_none()
    else:
        cart = None
    if not cart and session_id:
        r = await db.execute(select(Cart).where(Cart.session_id == session_id).limit(1))
        cart = r.scalar_one_or_none()
    if not cart:
        cart = Cart(user_id=user.id if user else None, session_id=session_id)
        db.add(cart)
        await db.flush()
    return cart


@router.get("", response_model=CartResponse)
async def get_cart(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
    session_id: Optional[str] = None,
):
    cart = await get_or_create_cart(db, current_user, session_id)
    await db.refresh(cart, ["items"])
    total = Decimal(0)
    items_out = []
    for it in cart.items:
        total += it.price * it.quantity
        items_out.append(CartItemResponse(id=it.id, product_id=it.product_id, quantity=it.quantity, price=it.price, customization_data=it.customization_data))
    return CartResponse(id=cart.id, items=items_out, total=total)


@router.post("/items", response_model=CartResponse)
async def add_to_cart(
    data: CartItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
    session_id: Optional[str] = None,
):
    cart = await get_or_create_cart(db, current_user, session_id)
    # Get product price
    r = await db.execute(select(Product).where(Product.id == data.product_id))
    product = r.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    price = product.price
    # Check existing line
    r = await db.execute(select(CartItem).where(CartItem.cart_id == cart.id, CartItem.product_id == data.product_id))
    existing = r.scalar_one_or_none()
    if existing:
        existing.quantity += data.quantity
        existing.customization_data = data.customization_data
    else:
        item = CartItem(cart_id=cart.id, product_id=data.product_id, quantity=data.quantity, price=price, customization_data=data.customization_data)
        db.add(item)
    await db.flush()
    await db.refresh(cart, ["items"])
    total = Decimal(0)
    items_out = []
    for it in cart.items:
        total += it.price * it.quantity
        items_out.append(CartItemResponse(id=it.id, product_id=it.product_id, quantity=it.quantity, price=it.price, customization_data=it.customization_data))
    return CartResponse(id=cart.id, items=items_out, total=total)


@router.patch("/items/{item_id}")
async def update_cart_item(
    item_id: int,
    data: CartItemUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
    session_id: Optional[str] = None,
):
    cart = await get_or_create_cart(db, current_user, session_id)
    r = await db.execute(select(CartItem).where(CartItem.id == item_id, CartItem.cart_id == cart.id))
    item = r.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if data.quantity is not None:
        if data.quantity <= 0:
            await db.delete(item)
        else:
            item.quantity = data.quantity
    await db.flush()
    return {"ok": True}


@router.delete("/items/{item_id}")
async def remove_cart_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
    session_id: Optional[str] = None,
):
    cart = await get_or_create_cart(db, current_user, session_id)
    r = await db.execute(select(CartItem).where(CartItem.id == item_id, CartItem.cart_id == cart.id))
    item = r.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    await db.delete(item)
    await db.flush()
    return {"ok": True}
