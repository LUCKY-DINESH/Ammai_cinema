import cloudinary
import cloudinary.uploader
import cloudinary.api
from app.core.config import settings

def init_cloudinary():
    if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True
        )

def upload_image_file(file, folder: str = "ammai_cinema"):
    init_cloudinary()
    response = cloudinary.uploader.upload(
        file,
        folder=folder,
        transformation=[
            {"quality": "auto", "fetch_format": "auto"}
        ]
    )
    return {
        "url": response.get("secure_url"),
        "public_id": response.get("public_id"),
        "width": response.get("width"),
        "height": response.get("height")
    }

def delete_image_file(public_id: str):
    init_cloudinary()
    return cloudinary.uploader.destroy(public_id)

def upload_video_file(file, folder: str = "ammai_cinema_trailers"):
    init_cloudinary()
    response = cloudinary.uploader.upload(
        file,
        resource_type="video",
        folder=folder
    )
    return {
        "url": response.get("secure_url"),
        "public_id": response.get("public_id"),
        "duration": response.get("duration"),
        "format": response.get("format")
    }

