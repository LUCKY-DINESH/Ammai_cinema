from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class ReviewBase(BaseModel):
    rating: int = Field(ge=1, le=10)
    comment: str
    user_name: Optional[str] = "Audience"

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: str
    movie_id: str
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
