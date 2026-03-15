"""Admin: products CRUD, orders list/update, customers, analytics."""
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from database import get_db
from models.user import User
from models.product import Product, ProductImage
from models.order import Order, OrderItem
from middleware.auth import get_current_user
from schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductImageSchema
from schemas.order import OrderResponse, OrderItemResponse, OrderStatusUpdate

router = APIRouter(prefix="/admin", tags=["admin"])


def require_admin(user: User) -> User:
    if not getattr(user, "is_admin", False):
        raise HTTPException(status_code=403, detail="Admin only")
    return user


@router.get("/products", response_model=list[ProductResponse])
async def admin_list_products(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    require_admin(current_user)
    r = await db.execute(
        select(Product).order_by(Product.created_at.desc()).offset(skip).limit(limit).options(selectinload(Product.images))
    )
    products = r.scalars().all()
    return [
        ProductResponse(
            id=p.id,
            name=p.name,
            slug=p.slug,
            description=p.description,
            price=p.price,
            compare_at_price=p.compare_at_price,
            category=p.category,
            stock=p.stock,
            customizable=p.customizable,
            customization_schema=p.customization_schema,
            is_active=p.is_active,
            images=[ProductImageSchema(id=i.id, url=i.url, alt=i.alt, sort_order=i.sort_order) for i in p.images],
            created_at=p.created_at,
        )
        for p in products
    ]


@router.post("/products", response_model=ProductResponse)
async def admin_create_product(
    data: ProductCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)
    r = await db.execute(select(Product).where(Product.slug == data.slug))
    if r.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Slug exists")
    product = Product(
        name=data.name,
        slug=data.slug,
        description=data.description,
        price=data.price,
        compare_at_price=data.compare_at_price,
        category=data.category,
        stock=data.stock,
        customizable=data.customizable,
        customization_schema=data.customization_schema,
    )
    db.add(product)
    await db.flush()
    await db.refresh(product)
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
        images=[],
        created_at=product.created_at,
    )


@router.patch("/products/{product_id}", response_model=ProductResponse)
async def admin_update_product(
    product_id: int,
    data: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)
    r = await db.execute(select(Product).where(Product.id == product_id).options(selectinload(Product.images)))
    product = r.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(product, k, v)
    await db.flush()
    await db.refresh(product)
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
        images=[ProductImageSchema(id=i.id, url=i.url, alt=i.alt, sort_order=i.sort_order) for i in product.images],
        created_at=product.created_at,
    )


@router.delete("/products/{product_id}")
async def admin_delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)
    r = await db.execute(select(Product).where(Product.id == product_id))
    product = r.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    await db.delete(product)
    await db.flush()
    return {"ok": True}


@router.get("/orders", response_model=list[OrderResponse])
async def admin_list_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
):
    require_admin(current_user)
    q = select(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit).options(selectinload(Order.items))
    if status:
        q = q.where(Order.status == status)
    r = await db.execute(q)
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


@router.patch("/orders/{order_id}")
async def admin_update_order(
    order_id: int,
    data: OrderStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)
    r = await db.execute(select(Order).where(Order.id == order_id))
    order = r.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if data.status:
        order.status = data.status
    if data.payment_status:
        order.payment_status = data.payment_status
    await db.flush()
    return {"ok": True}


@router.get("/analytics/revenue")
async def admin_analytics_revenue(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin(current_user)
    r = await db.execute(select(func.coalesce(func.sum(Order.total_price), 0)).where(Order.payment_status == "paid"))
    total = r.scalar()
    return {"total_revenue": float(total)}


@router.get("/analytics/top-products")
async def admin_analytics_top_products(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 10,
):
    require_admin(current_user)
    r = await db.execute(
        select(OrderItem.product_id, func.sum(OrderItem.quantity).label("qty"))
        .join(Order, Order.id == OrderItem.order_id)
        .where(Order.payment_status == "paid")
        .group_by(OrderItem.product_id)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(limit)
    )
    rows = r.all()
    return [{"product_id": p, "quantity_sold": q} for p, q in rows]
