from fastapi import APIRouter, Depends
from typing import List
from app.schemas.user import UserResponse
from app.database.mongodb import get_database
from app.dependencies.auth import get_current_admin

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("", response_model=List[UserResponse])
async def list_users(admin=Depends(get_current_admin)):
    db = get_database()
    if db is None:
        return [
            UserResponse(id="u-1", email="admin@ammai.in", full_name="Ammai Administrator", role="admin"),
            UserResponse(id="u-2", email="audience@ammai.in", full_name="Public Audience Member", role="user")
        ]

    cursor = db.users.find({}, {"hashed_password": 0})
    users = []
    async for u in cursor:
        u["id"] = str(u["_id"])
        users.append(u)
    return users
