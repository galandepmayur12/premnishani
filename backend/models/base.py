"""SQLAlchemy base and session."""
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    """Base model with common columns."""
    pass


def get_common_columns():
    """Common id and timestamps."""
    return [
        Column("id", Integer, primary_key=True, index=True, autoincrement=True),
        Column("created_at", DateTime(timezone=True), server_default=func.now()),
        Column("updated_at", DateTime(timezone=True), onupdate=func.now()),
    ]
