from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.mongodb import connect_to_mongo, close_mongo_connection
from app.routes import auth, movies, reviews, uploads, contact, enquiry, users, ai

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect DB & ensure indexes
    await connect_to_mongo()
    yield
    # Shutdown: Close DB client
    await close_mongo_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-ready REST API for AMMAI: The Mystic Knightess and Dohnavur Cinema Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(movies.router, prefix=settings.API_V1_STR)
app.include_router(reviews.router, prefix=settings.API_V1_STR)
app.include_router(uploads.router, prefix=settings.API_V1_STR)
app.include_router(contact.router, prefix=settings.API_V1_STR)
app.include_router(enquiry.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "docs": "/docs"
    }

@app.get(settings.API_V1_STR, tags=["API"])
async def api_root():
    return {
        "message": "Welcome to the AMMAI Cinema Promotional REST API",
        "version": "1.0.0",
        "documentation": "/docs"
    }
