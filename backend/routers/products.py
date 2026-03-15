"""Product catalog: list, get by slug, filters."""
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload

from database import get_db
from models.product import Product, ProductImage
from schemas.product import ProductResponse, ProductList, ProductImageSchema

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductList])
async def list_products(
    db: AsyncSession = Depends(get_db),
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    customizable: Optional[bool] = None,
    sort: Optional[str] = Query("popularity", enum=["popularity", "price_asc", "price_desc", "newest"]),
    skip: int = 0,
    limit: int = 24,
):
    q = select(Product).where(Product.is_active == True)
    if category:
        q = q.where(Product.category == category)
    if min_price is not None:
        q = q.where(Product.price >= Decimal(str(min_price)))
    if max_price is not None:
        q = q.where(Product.price <= Decimal(str(max_price)))
    if customizable is not None:
        q = q.where(Product.customizable == customizable)
    if sort == "price_asc":
        q = q.order_by(Product.price.asc())
    elif sort == "price_desc":
        q = q.order_by(Product.price.desc())
    elif sort == "newest":
        q = q.order_by(Product.created_at.desc())
    else:
        q = q.order_by(Product.created_at.desc())
    q = q.offset(skip).limit(limit)
    result = await db.execute(q)
    products = result.scalars().all()
    out = []
    for p in products:
        img = await db.execute(select(ProductImage).where(ProductImage.product_id == p.id).order_by(ProductImage.sort_order).limit(1))
        first_img = img.scalar_one_or_none()
        out.append(ProductList(
            id=p.id,
            name=p.name,
            slug=p.slug,
            price=p.price,
            category=p.category,
            customizable=p.customizable,
            image_url=first_img.url if first_img else None,
        ))
    return out


@router.get("/categories")
async def list_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product.category).where(Product.is_active == True).distinct())
    return [r[0] for r in result.all()]


@router.get("/by-slug/{slug}", response_model=ProductResponse)
async def get_product_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).where(Product.slug == slug, Product.is_active == True).options(selectinload(Product.images))
    )
    product = result.scalar_one_or_none()
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    images = [ProductImageSchema(id=i.id, url=i.url, alt=i.alt, sort_order=i.sort_order) for i in product.images]
    return ProductResponse(
        id=product.id,
        name=product.name,
        slug=product.slug,
        description=product.description,
        price=product.price,
        compare_at_price=product.compare_at_price,
        category=product.category,
        stock=product.stock,
        customizable=product.customizable,
        customization_schema=product.customization_schema,
        is_active=product.is_active,
        images=sorted(images, key=lambda x: x.sort_order),
        created_at=product.created_at,
    )


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).where(Product.id == product_id, Product.is_active == True).options(selectinload(Product.images))
    )
    product = result.scalar_one_or_none()
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    images = [ProductImageSchema(id=i.id, url=i.url, alt=i.alt, sort_order=i.sort_order) for i in product.images]
    return ProductResponse(
        id=product.id,
        name=product.name,
        slug=product.slug,
        description=product.description,
        price=product.price,
        compare_at_price=product.compare_at_price,
        category=product.category,
        stock=product.stock,
        customizable=product.customizable,
        customization_schema=product.customization_schema,
        is_active=product.is_active,
        images=sorted(images, key=lambda x: x.sort_order),
        created_at=product.created_at,
    )
