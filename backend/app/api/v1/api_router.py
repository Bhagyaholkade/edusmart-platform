from fastapi import APIRouter

from app.api.v1.endpoints import auth, school, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(school.router, prefix="/academic", tags=["academic hierarchy"])
api_router.include_router(users.router, prefix="/users", tags=["user management"])
