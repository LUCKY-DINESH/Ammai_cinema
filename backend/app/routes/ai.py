from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.groq_service import call_groq_chat
from app.core.config import settings

router = APIRouter(prefix="/ai", tags=["Groq AI Service"])

class ChatMessage(BaseModel):
    role: str = "user"
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    reply: str
    model: str = settings.GROQ_MODEL

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(req: ChatRequest):
    try:
        reply = await call_groq_chat([m.model_dump() for m in req.messages])
        return ChatResponse(reply=reply, model=settings.GROQ_MODEL)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/suggestions")
async def get_suggestions():
    return {
        "suggestions": [
            "Who was Amy Carmichael and why is she called 'Ammai'?",
            "What is the story behind 'AMMAI: The Mystic Knightess'?",
            "How does The Dohnavur Fellowship support children today?",
            "Who directed the movie and who is on the production team?",
            "How can I contribute to the film and preservation endowments?"
        ]
    }
