from fastapi import APIRouter, Depends
from typing import List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr
from app.database.mongodb import get_database
from app.dependencies.auth import get_current_admin

router = APIRouter(prefix="/enquiry", tags=["Instant Message Inquiries"])

class EnquiryCreate(BaseModel):
    name: str
    email: EmailStr
    message: Optional[str] = None
    inquiry: Optional[str] = None

class EnquiryResponse(BaseModel):
    id: str
    name: str
    email: str
    message: str
    form_type: str = "Instant Message Inquiry"
    created_at: Optional[datetime] = None
    status: str = "unread"

@router.post("", response_model=EnquiryResponse)
async def submit_enquiry(enquiry_in: EnquiryCreate):
    db = get_database()
    msg = enquiry_in.message or enquiry_in.inquiry or ""
    enquiry_dict = {
        "name": enquiry_in.name.strip(),
        "email": enquiry_in.email.strip(),
        "message": msg.strip(),
        "form_type": "Instant Message Inquiry",
        "created_at": datetime.now(timezone.utc),
        "status": "unread"
    }

    if db is not None:
        result = await db.enquiry.insert_one(enquiry_dict)
        enquiry_dict["id"] = str(result.inserted_id)
    else:
        enquiry_dict["id"] = "offline-enquiry"

    return enquiry_dict

@router.get("", response_model=List[EnquiryResponse])
async def get_enquiries(admin=Depends(get_current_admin)):
    db = get_database()
    if db is None:
        return []

    cursor = db.enquiry.find().sort("created_at", -1)
    enquiries = []
    async for e in cursor:
        e["id"] = str(e["_id"])
        enquiries.append(e)
    return enquiries
