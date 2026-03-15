"""
Seed products for Prem Nishani. Images are in frontend/public/images/.
Run from backend dir: python seed_products.py
Uses DATABASE_URL_SYNC from .env (postgresql://...).
"""
import os
import sys
from decimal import Decimal

# Add parent so we can import from backend
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, select, func
from sqlalchemy.orm import sessionmaker

from core.config import get_settings
from models.base import Base
from models.product import Product, ProductImage

settings = get_settings()
engine = create_engine(settings.DATABASE_URL_SYNC, echo=False)
Session = sessionmaker(bind=engine)

# Product definitions: name, slug, description, price, category, customizable, images (filenames in public/images)
PRODUCTS = [
    {
        "name": "Anniversary Gift Box",
        "slug": "anniversary-gift-box",
        "description": "Elegant anniversary gift box, perfect for couples. Premium packaging with a personal touch.",
        "price": Decimal("2499.00"),
        "category": "Anniversary Gifts",
        "customizable": True,
        "customization_schema": {
            "frame_color": {"type": "select", "options": ["Gold", "Silver", "Rose Gold"]},
            "message": {"type": "text"},
            "gift_wrap": {"type": "boolean", "default": True},
        },
        "images": [
            "Anniversary_Gift_Product1_00.png",
            "Anniversary_Gift_Product1_01.png",
        ],
    },
    {
        "name": "Anniversary Lamp",
        "slug": "anniversary-lamp",
        "description": "Beautiful decorative lamp for anniversaries. Creates a warm, romantic ambience.",
        "price": Decimal("1899.00"),
        "category": "Anniversary Gifts",
        "customizable": False,
        "images": [
            "Anniversary_Gift_Product2_lamp_00.png",
            "Anniversary_Gift_Product2_lamp_01.png",
            "Anniversary_Gift_Product2_lamp_02.png",
            "Anniversary_Gift_Product2_lamp_03.png",
        ],
    },
    {
        "name": "Colorful Candles Set",
        "slug": "colorful-candles-set",
        "description": "Vibrant scented candles set. Ideal for birthdays and housewarming.",
        "price": Decimal("899.00"),
        "category": "Birthday Gifts",
        "customizable": False,
        "images": ["Candles_Colorful.png"],
    },
    {
        "name": "Unique Candles Collection",
        "slug": "unique-candles-collection",
        "description": "Premium unique candles in elegant designs. Perfect luxury hamper addition.",
        "price": Decimal("1299.00"),
        "category": "Luxury Hampers",
        "customizable": False,
        "images": [
            "Candles_Unique_00.png",
            "Candles_Unique_01.png",
            "Candles_Unique_02.png",
        ],
    },
    {
        "name": "Premium Ceramic Mugs",
        "slug": "premium-ceramic-mugs",
        "description": "Customizable ceramic mugs. Add names or a special message for a personal gift.",
        "price": Decimal("599.00"),
        "category": "Corporate Gifts",
        "customizable": True,
        "customization_schema": {
            "name": {"type": "text"},
            "message": {"type": "text"},
            "font_style": {"type": "select", "options": ["Classic", "Modern", "Script"]},
        },
        "images": ["Mugs.png"],
    },
    {
        "name": "Custom Photo Frame",
        "slug": "custom-photo-frame",
        "description": "Upload your photo and add a name or message. Choose frame color and font style.",
        "price": Decimal("1499.00"),
        "category": "Romantic Gifts",
        "customizable": True,
        "customization_schema": {
            "upload_photo": {"type": "file"},
            "name": {"type": "text"},
            "message": {"type": "text"},
            "frame_color": {"type": "select", "options": ["Gold", "Silver", "Black", "White"]},
            "font_style": {"type": "select", "options": ["Elegant", "Modern", "Script"]},
            "gift_wrap": {"type": "boolean", "default": True},
        },
        "images": [
            "Photo_frame_00.png",
            "Photo_frame_01.png",
        ],
    },
    {
        "name": "Baby Photo Frame",
        "slug": "baby-photo-frame",
        "description": "Adorable photo frame for baby’s first moments. Personalize with name and date.",
        "price": Decimal("999.00"),
        "category": "Birthday Gifts",
        "customizable": True,
        "customization_schema": {
            "upload_photo": {"type": "file"},
            "baby_name": {"type": "text"},
            "date": {"type": "text"},
            "frame_color": {"type": "select", "options": ["Pink", "Blue", "White", "Gold"]},
        },
        "images": [
            "Photoframe_baby_00.png",
            "Photoframe_baby_01.png",
        ],
    },
]


def seed():
    Base.metadata.create_all(engine)
    session = Session()
    try:
        r = session.execute(select(func.count(Product.id)))
        existing = r.scalar() or 0
        if existing > 0:
            print(f"Found {existing} existing products. Skip seeding or delete first.")
            return
        base_url = "/images"
        for p in PRODUCTS:
            product = Product(
                name=p["name"],
                slug=p["slug"],
                description=p.get("description"),
                price=p["price"],
                category=p["category"],
                stock=50,
                customizable=p.get("customizable", False),
                customization_schema=p.get("customization_schema"),
                is_active=True,
            )
            session.add(product)
            session.flush()
            for i, img_name in enumerate(p["images"]):
                session.add(
                    ProductImage(
                        product_id=product.id,
                        url=f"{base_url}/{img_name}",
                        alt=p["name"],
                        sort_order=i,
                    )
                )
            print(f"Added: {p['name']}")
        session.commit()
        print(f"Seeded {len(PRODUCTS)} products.")
    except Exception as e:
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    seed()
