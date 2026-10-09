from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from datetime import datetime, timezone
from app.core.cloudinary import upload_image_file, upload_video_file, delete_image_file
from app.database.mongodb import get_database
from app.dependencies.auth import get_current_admin

router = APIRouter(prefix="/uploads", tags=["Uploads & Media"])

ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
MAX_IMAGE_SIZE = 25 * 1024 * 1024  # 25 MB

ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska", "video/ogg", "application/octet-stream"]
MAX_VIDEO_SIZE = 150 * 1024 * 1024  # 150 MB

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="Image size exceeds 25MB limit.")

    try:
        result = upload_image_file(contents)
        db = get_database()
        if db is not None:
            await db.media_assets.insert_one({
                "original_filename": file.filename,
                "cloudinary_url": result.get("url"),
                "public_id": result.get("public_id"),
                "resource_type": "image",
                "width": result.get("width"),
                "height": result.get("height"),
                "created_at": datetime.now(timezone.utc)
            })
        return {
            "success": True,
            "url": result.get("url"),
            "public_id": result.get("public_id"),
            "resource_type": "image"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Cloudinary image upload failed: {str(e)}"
        )

@router.post("/video")
async def upload_video(file: UploadFile = File(...)):
    contents = await file.read()
    if len(contents) > MAX_VIDEO_SIZE:
        raise HTTPException(status_code=400, detail="Video size exceeds 150MB limit.")

    try:
        result = upload_video_file(contents)
        db = get_database()
        if db is not None:
            await db.media_assets.insert_one({
                "original_filename": file.filename,
                "cloudinary_url": result.get("url"),
                "public_id": result.get("public_id"),
                "resource_type": "video",
                "duration": result.get("duration"),
                "format": result.get("format"),
                "created_at": datetime.now(timezone.utc)
            })
        return {
            "success": True,
            "url": result.get("url"),
            "public_id": result.get("public_id"),
            "duration": result.get("duration"),
            "resource_type": "video"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Cloudinary video upload failed: {str(e)}"
        )

@router.get("/media")
async def list_media():
    db = get_database()
    if db is None:
        return []
    cursor = db.media_assets.find().sort("created_at", -1)
    items = []
    async for doc in cursor:
        doc["id"] = str(doc.get("_id"))
        del doc["_id"]
        items.append(doc)
    return items

@router.delete("/image/{public_id:path}")
async def delete_image(public_id: str, admin=Depends(get_current_admin)):
    try:
        delete_image_file(public_id)
        db = get_database()
        if db is not None:
            await db.media_assets.delete_many({"public_id": public_id})
        return {"success": True, "message": "Image deleted from Cloudinary and MongoDB"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete image: {str(e)}")


