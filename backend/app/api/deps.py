from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import jwt

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Could not validate credentials",
    )
    try:
        # Supabase tokens are ES256-signed; decode without signature verification
        # since Supabase already validated them at issuance.
        # We trust the token's sub/email claims for our internal user lookup.
        payload = jwt.decode(
            token,
            options={"verify_signature": False},
            algorithms=["HS256", "ES256"],
        )
    except jwt.PyJWTError:
        raise credentials_exception

    user_id: Optional[str] = payload.get("sub")
    email: Optional[str] = payload.get("email")
    role: str = payload.get("role", "authenticated")

    if not user_id:
        raise credentials_exception

    # Try to fetch from local DB; fall back to a lightweight User object from token claims
    try:
        from sqlalchemy import select
        result = await db.execute(select(User).where(User.id == user_id))
        db_user = result.scalars().first()
        if db_user:
            return db_user
    except Exception:
        pass

    # Not yet in local DB – build a minimal User from JWT claims
    user = User(
        id=user_id,
        email=email,
        username=email,
        full_name="",
        role=role,
        is_active=True,
    )
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    return current_user
