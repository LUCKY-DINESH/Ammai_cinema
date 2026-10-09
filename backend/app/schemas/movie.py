from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class MovieBase(BaseModel):
    title: str
    slug: str
    tagline: Optional[str] = None
    description: str
    genre: List[str] = []
    language: str = "Tamil"
    duration: Optional[int] = None
    release_date: Optional[str] = None
    status: str = "coming_soon"  # "now_showing", "coming_soon", "archived"
    rating: float = 9.0
    rating_count: int = 0
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None
    trailer_url: Optional[str] = None
    director: Optional[str] = "Anandan Sundararajan"
    cast: List[str] = []
    featured: bool = False

class MovieCreate(MovieBase):
    pass

class MovieUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    genre: Optional[List[str]] = None
    language: Optional[str] = None
    duration: Optional[int] = None
    release_date: Optional[str] = None
    status: Optional[str] = None
    rating: Optional[float] = None
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None
    trailer_url: Optional[str] = None
    director: Optional[str] = None
    cast: Optional[List[str]] = None
    featured: Optional[bool] = None

class MovieResponse(MovieBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class MovieListResponse(BaseModel):
    items: List[MovieResponse]
    total: int
    page: int
    limit: int
