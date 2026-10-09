import asyncio
import os
import sys
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

# Add parent directory to sys.path so app modules are resolvable
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.security import get_password_hash

async def seed():
    print(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]

    # 1. Seed Admin User
    existing_admin = await db.users.find_one({"email": settings.INITIAL_ADMIN_EMAIL})
    if not existing_admin:
        admin_doc = {
            "email": settings.INITIAL_ADMIN_EMAIL,
            "hashed_password": get_password_hash(settings.INITIAL_ADMIN_PASSWORD),
            "full_name": settings.INITIAL_ADMIN_NAME,
            "role": "admin",
            "created_at": datetime.now(timezone.utc)
        }
        await db.users.insert_one(admin_doc)
        print(f"✓ Initial Admin user created: {settings.INITIAL_ADMIN_EMAIL}")
    else:
        print(f"• Admin user already exists: {settings.INITIAL_ADMIN_EMAIL}")

    # 2. Seed Movies
    movies_to_seed = [
        {
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
            "cast": ["Amy Carmichael Ensemble", "Dohnavur Children Choir", "Historical Cast"],
            "featured": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
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
            "featured": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
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
            "featured": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
    ]

    for m in movies_to_seed:
        existing = await db.movies.find_one({"slug": m["slug"]})
        if not existing:
            await db.movies.insert_one(m)
            print(f"✓ Seeded movie: {m['title']}")
        else:
            print(f"• Movie already present: {m['title']}")

    print("\nDatabase seeding completed successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
