from fastapi import APIRouter, Depends
from typing import List
from datetime import datetime, timezone
from app.schemas.contact import ContactCreate, ContactResponse
from app.database.mongodb import get_database
from app.dependencies.auth import get_current_admin

router = APIRouter(prefix="/contact", tags=["Contact Inquiries"])

@router.post("", response_model=ContactResponse)
async def submit_contact(contact_in: ContactCreate):
    db = get_database()
    contact_dict = contact_in.model_dump()
    contact_dict["created_at"] = datetime.now(timezone.utc)
    contact_dict["status"] = "unread"

    if db is not None:
        result = await db.contact.insert_one(contact_dict)
        contact_dict["id"] = str(result.inserted_id)
    else:
        contact_dict["id"] = "offline-contact"

    return contact_dict

@router.get("", response_model=List[ContactResponse])
async def get_contacts(admin=Depends(get_current_admin)):
    db = get_database()
    if db is None:
        return [
            ContactResponse(
                id="c-1",
                name="Grace Murugan",
                email="grace@example.com",
                message="Inquiring about school screening permissions for Dohnavur documentary.",
                created_at=datetime.now(timezone.utc),
                status="unread"
            )
        ]

    cursor = db.contact.find().sort("created_at", -1)
    contacts = []
    async for c in cursor:
        c["id"] = str(c["_id"])
        contacts.append(c)
    return contacts
