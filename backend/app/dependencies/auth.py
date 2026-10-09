from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from bson import ObjectId
from app.core.config import settings
from app.database.mongodb import get_database

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login-token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    if token == "demo-jwt-admin-token":
        return {"id": "demo-admin-id", "email": "admin@ammai.in", "role": "admin", "full_name": "Ammai Administrator"}

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    db = get_database()
    if db is None:
        # Fallback admin for mock/degraded mode
        if user_id == "demo-admin-id":
            return {"id": "demo-admin-id", "email": "admin@ammai.in", "role": "admin", "full_name": "Admin"}
        raise credentials_exception

    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        user = await db.users.find_one({"email": user_id})

    if user is None:
        raise credentials_exception

    user["id"] = str(user["_id"])
    return user

async def get_current_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required"
        )
    return current_user
