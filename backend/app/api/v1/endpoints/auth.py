from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.api import deps
from app.schemas.auth import Token
from app.schemas.user import User as UserSchema

router = APIRouter()


@router.post("/signup", response_model=Token)
async def signup_user(
    db: AsyncSession = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    """
    Create a new user via Supabase Email/Password and return a JWT.
    """
    from app.integrations.supabase.client import SupabaseAuthClient
    supabase_client = SupabaseAuthClient(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_KEY,
    )
    try:
        auth_response = await supabase_client.sign_up(
            email=form_data.username,
            password=form_data.password,
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    finally:
        await supabase_client.close()

    access_token = auth_response.get("access_token", "")
    user_info = auth_response.get("user") or {}
    user_id = user_info.get("id", "")
    role = user_info.get("role", "STUDENT")

    # Best-effort local DB upsert – never blocks authentication
    try:
        from app.models.user import User
        from sqlalchemy import select
        result = await db.execute(select(User).where(User.id == user_id))
        existing_user = result.scalars().first()
        if not existing_user:
            new_user = User(
                id=user_id,
                email=user_info.get("email"),
                username=user_info.get("email"),
                role=role,
            )
            db.add(new_user)
            await db.commit()
        elif existing_user.role != role:
            existing_user.role = role
            await db.commit()
    except Exception:
        pass  # DB upsert is non-critical; auth still succeeds

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": role,
        "user_id": user_id,
    }


@router.post("/login", response_model=Token)
async def login_user(
    db: AsyncSession = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    """
    Authenticate an existing user via Supabase Email/Password and return a JWT.
    """
    from app.integrations.supabase.client import SupabaseAuthClient
    supabase_client = SupabaseAuthClient(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_KEY,
    )
    try:
        auth_response = await supabase_client.sign_in(
            email=form_data.username,
            password=form_data.password,
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    finally:
        await supabase_client.close()

    access_token = auth_response.get("access_token", "")
    user_info = auth_response.get("user") or {}
    user_id = user_info.get("id", "")
    role = user_info.get("role", "STUDENT")

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": role,
        "user_id": user_id,
    }


@router.get("/me", response_model=UserSchema)
async def read_users_me(
    current_user: UserSchema = Depends(deps.get_current_active_user),
):
    """
    Get current user.
    """
    return current_user
