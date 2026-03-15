"""Auth routes: register, login, me."""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.user import UserCreate, UserResponse, Token
from middleware.auth import get_current_user
from models.user import User
from services.auth_service import register_user, authenticate_user, user_to_response, create_token_for_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token)
async def register(
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    try:
        user = await register_user(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    token = create_token_for_user(user)
    return Token(access_token=token, user=user_to_response(user))


@router.post("/login", response_model=Token)
async def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    user = await authenticate_user(db, form.username, form.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token_for_user(user)
    return Token(access_token=token, user=user_to_response(user))


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return user_to_response(current_user)
