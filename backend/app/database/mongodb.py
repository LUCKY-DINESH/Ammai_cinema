from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import logging

logger = logging.getLogger("database")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    try:
        db_instance.client = AsyncIOMotorClient(settings.MONGODB_URI)
        db_instance.db = db_instance.client[settings.MONGODB_DB_NAME]
        logger.info(f"Connected to MongoDB at {settings.MONGODB_URI}, DB: {settings.MONGODB_DB_NAME}")
        
        # Ensure indexes
        await db_instance.db.movies.create_index("slug", unique=True)
        await db_instance.db.movies.create_index([("title", "text"), ("description", "text")])
        await db_instance.db.movies.create_index("status")
        await db_instance.db.movies.create_index("genre")
        await db_instance.db.users.create_index("email", unique=True)
        await db_instance.db.reviews.create_index("movie_id")
        logger.info("MongoDB indexes verified.")
    except Exception as e:
        logger.warning(f"Failed to connect to MongoDB: {e}. Running in degraded/mock mode if offline.")

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        logger.info("MongoDB connection closed.")

def get_database():
    return db_instance.db
