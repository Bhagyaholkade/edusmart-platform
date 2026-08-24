from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import security
from app.core.config import settings
from app.api import deps
from app.schemas.auth import Token
from app.schemas.user import User

router = APIRouter()

@router.post("/login", response_model=Token)
async def login_access_token(
    db: AsyncSession = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    # Simulate DB lookup
    # user = authenticate(db, email=form_data.username, password=form_data.password)
    # if not user:
    #     raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # Call Supabase to authenticate
    from app.integrations.supabase.client import SupabaseAuthClient
    supabase_client = SupabaseAuthClient(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
    try:
        auth_response = await supabase_client.sign_in(email=form_data.username, password=form_data.password)
    finally:
        await supabase_client.close()

    # Extract JWT and user info
    access_token = auth_response["access_token"]
    user_info = auth_response["user"]  # contains id (UUID), email, etc.
    user_id = user_info["id"]
    role = user_info.get("role", "STUDENT")  # default fallback

    # Upsert user into our local DB (create if not exists)
    from app.models.user import User
    from sqlalchemy import select
    result = await db.execute(select(User).where(User.id == user_id))
    existing_user = result.scalars().first()
    if not existing_user:
        new_user = User(id=user_id, email=user_info.get("email"), username=user_info.get("email"), role=role)
        db.add(new_user)
        await db.commit()
    else:
        # Update role if changed
        if existing_user.role != role:
            existing_user.role = role
            await db.commit()

    return {"access_token": access_token, "token_type": "bearer", "role": role, "user_id": user_id}


@router.get("/me", response_model=User)
async def read_users_me(
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Get current user.
    """
    return current_user
