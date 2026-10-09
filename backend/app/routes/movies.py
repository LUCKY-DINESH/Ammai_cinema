from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, List
from datetime import datetime, timezone
from bson import ObjectId
from app.schemas.movie import MovieCreate, MovieUpdate, MovieResponse, MovieListResponse
from app.database.mongodb import get_database
from app.dependencies.auth import get_current_admin

router = APIRouter(prefix="/movies", tags=["Movies"])

SEED_MOVIES = [
    {
        "_id": "ammai-the-mystic-knightess",
        "slug": "ammai-the-mystic-knightess",
        "title": "AMMAI: The Mystic Knightess",
        "tagline": "The Untold Story of Amy Carmichael",
        "description": "An extraordinary cinematic portrait chronicling the courageous life of Amy Carmichael—a fierce mystic who defied colonial norms, battled temple servitude, and founded the enduring sanctuary of The Dohnavur Fellowship.",
        "genre": ["Biography", "Historical", "Drama"],
        "language": "Tamil / English",
        "duration": 142,
        "release_date": "2026-11-20",
        "status": "coming_soon",
        "rating": 9.4,
        "rating_count": 84,
        "poster_url": "https://res.cloudinary.com/dzcss22tm/image/upload/v1790679797/ammai_cinema/b51b2a63ef343db27777ed80a03bd857.png",
        "backdrop_url": "https://res.cloudinary.com/dzcss22tm/image/upload/v1790679803/ammai_cinema/c9831bc8d85baa82e77524f903a5bb05.png",
        "trailer_url": "https://res.cloudinary.com/dzcss22tm/video/upload/v1790679805/ammai_cinema_trailers/e72aae448dda8ceea7d8f60b60eef696.mp4",
        "director": "Anandan Sundararajan",
        "cast": ["Amy Carmichael Ensemble", "Dohnavur Children Choir"],
        "featured": True
    },
    {
        "_id": "the-sanctuary-dohnavur",
        "slug": "the-sanctuary-dohnavur",
        "title": "The Sanctuary at Dohnavur",
        "tagline": "A Century of Compassion and Healing",
        "description": "An evocative documentary exploring the sacred grounds at the foothills of the Western Ghats where thousands of endangered lives were given education, love, and healthcare.",
        "genre": ["Documentary", "History"],
        "language": "Tamil",
        "duration": 88,
        "release_date": "2026-08-15",
        "status": "now_showing",
        "rating": 9.1,
        "rating_count": 42,
        "poster_url": "https://res.cloudinary.com/dzcss22tm/image/upload/v1790679799/ammai_cinema/64cb10626ae81464c6f4248218da767f.png",
        "backdrop_url": "https://res.cloudinary.com/dzcss22tm/image/upload/v1790679808/ammai_cinema/dohnavur/e3b3d85d15513aa8e17d5e0539406f87.jpg",
        "trailer_url": "https://res.cloudinary.com/dzcss22tm/video/upload/v1790679807/ammai_cinema_trailers/f6192a73f5dbe767f4715ec374a1e745.mp4",
        "director": "Anandan Sundararajan",
        "cast": ["Fellowship Leaders", "Community Elders"],
        "featured": True
    },
    {
        "_id": "defying-conventions",
        "slug": "defying-conventions",
        "title": "Defying Conventions",
        "tagline": "The Rescue Mission",
        "description": "A dramatic visual study into Amy's journey to break down social taboos and confront the oppressive practices of temple enslavement in 1900s South India.",
        "genre": ["Drama", "Action", "Biography"],
        "language": "English / Tamil",
        "duration": 110,
        "release_date": "2026-12-25",
        "status": "coming_soon",
        "rating": 8.8,
        "rating_count": 29,
        "poster_url": "https://res.cloudinary.com/dzcss22tm/image/upload/v1790679801/ammai_cinema/a10ea807af0e3cad44c2cd4fb6033267.png",
        "backdrop_url": "https://res.cloudinary.com/dzcss22tm/image/upload/v1790679815/ammai_cinema/dohnavur/bcae4a81ef22ec50d4216e1b4fa1ed68.jpg",
        "trailer_url": "https://res.cloudinary.com/dzcss22tm/video/upload/v1790679805/ammai_cinema_trailers/e72aae448dda8ceea7d8f60b60eef696.mp4",
        "director": "Anandan Sundararajan",
        "cast": ["Wordint Players"],
        "featured": True
    }
]

def format_movie(doc):
    doc["id"] = str(doc.get("_id", doc.get("slug")))
    return doc

@router.get("", response_model=MovieListResponse)
async def get_movies(
    search: Optional[str] = None,
    genre: Optional[str] = None,
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50)
):
    db = get_database()
    if db is None:
        items = [format_movie(dict(m)) for m in SEED_MOVIES]
        if search:
            s = search.lower()
            items = [m for m in items if s in m["title"].lower() or any(s in g.lower() for g in m["genre"])]
        if genre:
            items = [m for m in items if genre in m["genre"]]
        if status:
            items = [m for m in items if m["status"] == status]
        return {"items": items, "total": len(items), "page": page, "limit": limit}

    query = {}
    if search:
        query["$text"] = {"$search": search}
    if genre:
        query["genre"] = genre
    if status:
        query["status"] = status

    skip = (page - 1) * limit
    total = await db.movies.count_documents(query)
    cursor = db.movies.find(query).skip(skip).limit(limit)
    movies = [format_movie(m) async for m in cursor]

    if not movies and not query and page == 1:
        # Auto-seed if empty
        for sm in SEED_MOVIES:
            copy_sm = dict(sm)
            copy_sm["_id"] = ObjectId()
            await db.movies.insert_one(copy_sm)
        cursor = db.movies.find().limit(limit)
        movies = [format_movie(m) async for m in cursor]
        total = len(movies)

    return {"items": movies, "total": total, "page": page, "limit": limit}

@router.get("/{slug}", response_model=MovieResponse)
async def get_movie(slug: str):
    db = get_database()
    if db is None:
        for m in SEED_MOVIES:
            if m["slug"] == slug or m["_id"] == slug:
                return format_movie(dict(m))
        raise HTTPException(status_code=404, detail="Movie not found")

    try:
        movie = await db.movies.find_one({"_id": ObjectId(slug)})
    except Exception:
        movie = None

    if not movie:
        movie = await db.movies.find_one({"slug": slug})

    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    return format_movie(movie)

@router.post("", response_model=MovieResponse)
async def create_movie(movie_in: MovieCreate, admin=Depends(get_current_admin)):
    db = get_database()
    movie_dict = movie_in.model_dump()
    movie_dict["created_at"] = datetime.now(timezone.utc)
    movie_dict["updated_at"] = datetime.now(timezone.utc)

    if db is not None:
        result = await db.movies.insert_one(movie_dict)
        movie_dict["id"] = str(result.inserted_id)
    else:
        movie_dict["id"] = movie_in.slug
    return movie_dict

@router.put("/{movie_id}", response_model=MovieResponse)
async def update_movie(movie_id: str, movie_in: MovieUpdate, admin=Depends(get_current_admin)):
    db = get_database()
    update_data = {k: v for k, v in movie_in.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)

    if db is not None:
        try:
            await db.movies.update_one({"_id": ObjectId(movie_id)}, {"$set": update_data})
        except Exception:
            await db.movies.update_one({"slug": movie_id}, {"$set": update_data})

    return await get_movie(movie_id)

@router.delete("/{movie_id}")
async def delete_movie(movie_id: str, admin=Depends(get_current_admin)):
    db = get_database()
    if db is not None:
        try:
            await db.movies.delete_one({"_id": ObjectId(movie_id)})
        except Exception:
            await db.movies.delete_one({"slug": movie_id})
    return {"success": True, "message": "Movie deleted successfully"}
