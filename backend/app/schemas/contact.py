from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactResponse(ContactCreate):
    id: str
    created_at: Optional[datetime] = None
    status: str = "unread"
