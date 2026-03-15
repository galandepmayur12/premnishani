"""Wishlist: add, remove, list."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from database import get_db
from models.wishlist import WishlistItem
from models.product import Product
from middleware.auth import get_current_user
from models.user import User
from schemas.product import ProductList

router = APIRouter(prefix="/wishlist", tags=["wishlist"])


@router.get("", response_model=list[ProductList])
async def list_wishlist(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    r = await db.execute(select(WishlistItem).where(WishlistItem.user_id == current_user.id))
    items = r.scalars().all()
    from models.product import ProductImage
    out = []
    for w in items:
        r2 = await db.execute(select(Product).where(Product.id == w.product_id))
        p = r2.scalar_one_or_none()
        if p and p.is_active:
            img = await db.execute(select(ProductImage).where(ProductImage.product_id == p.id).order_by(ProductImage.sort_order).limit(1))
            first = img.scalar_one_or_none()
            out.append(ProductList(id=p.id, name=p.name, slug=p.slug, price=p.price, category=p.category, customizable=p.customizable, image_url=first.url if first else None))
    return out


@router.post("/{product_id}")
async def add_to_wishlist(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    r = await db.execute(select(WishlistItem).where(WishlistItem.user_id == current_user.id, WishlistItem.product_id == product_id))
    if r.scalar_one_or_none():
        return {"ok": True, "message": "Already in wishlist"}
    r = await db.execute(select(Product).where(Product.id == product_id))
    if not r.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Product not found")
    w = WishlistItem(user_id=current_user.id, product_id=product_id)
    db.add(w)
    await db.flush()
    return {"ok": True}


@router.delete("/{product_id}")
async def remove_from_wishlist(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    r = await db.execute(select(WishlistItem).where(WishlistItem.user_id == current_user.id, WishlistItem.product_id == product_id))
    w = r.scalar_one_or_none()
    if w:
        await db.delete(w)
        await db.flush()
    return {"ok": True}
