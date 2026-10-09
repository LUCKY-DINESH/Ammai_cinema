from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime, timezone
from bson import ObjectId
from app.schemas.review import ReviewCreate, ReviewResponse
from app.database.mongodb import get_database
from app.dependencies.auth import get_current_user

router = APIRouter(tags=["Reviews"])

@router.get("/movies/{movie_id}/reviews", response_model=List[ReviewResponse])
async def get_movie_reviews(movie_id: str):
    db = get_database()
    if db is None:
        return [
            ReviewResponse(
                id="rev-1",
                movie_id=movie_id,
                rating=10,
                comment="A magnificent, emotionally overwhelming cinematic tribute to Amy Carmichael.",
                user_name="Dr. Samuel K.",
                created_at=datetime.now(timezone.utc)
            )
        ]

    cursor = db.reviews.find({"movie_id": movie_id}).sort("created_at", -1)
    reviews = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        reviews.append(doc)
    return reviews

@router.post("/movies/{movie_id}/reviews", response_model=ReviewResponse)
async def create_review(movie_id: str, review_in: ReviewCreate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    review_dict = review_in.model_dump()
    review_dict["movie_id"] = movie_id
    review_dict["user_id"] = current_user.get("id")
    review_dict["user_name"] = current_user.get("full_name", review_in.user_name)
    review_dict["created_at"] = datetime.now(timezone.utc)

    if db is not None:
        result = await db.reviews.insert_one(review_dict)
        review_dict["id"] = str(result.inserted_id)
        
        # Recalculate average movie rating
        reviews_cursor = db.reviews.find({"movie_id": movie_id})
        all_ratings = [r["rating"] async for r in reviews_cursor]
        if all_ratings:
            avg_rating = sum(all_ratings) / len(all_ratings)
            try:
                await db.movies.update_one(
                    {"_id": ObjectId(movie_id)},
                    {"$set": {"rating": round(avg_rating, 1), "rating_count": len(all_ratings)}}
                )
            except Exception:
                await db.movies.update_one(
                    {"slug": movie_id},
                    {"$set": {"rating": round(avg_rating, 1), "rating_count": len(all_ratings)}}
                )
    else:
        review_dict["id"] = "offline-review-id"

    return review_dict

@router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    if db is not None:
        try:
            rev = await db.reviews.find_one({"_id": ObjectId(review_id)})
            if rev and (current_user.get("role") == "admin" or str(rev.get("user_id")) == current_user.get("id")):
                await db.reviews.delete_one({"_id": ObjectId(review_id)})
                return {"success": True, "message": "Review deleted"}
        except Exception:
            pass
    return {"success": True, "message": "Review deleted"}
