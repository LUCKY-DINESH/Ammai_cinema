import httpx
import logging
from app.core.config import settings

logger = logging.getLogger("groq_service")

SYSTEM_PROMPT = """You are the official AI Film Historian & Cinema Guide for the feature film 'AMMAI: The Mystic Knightess' and The Dohnavur Fellowship.

Key Context:
- Film Title: AMMAI: The Mystic Knightess (The Untold Story of Amy Carmichael)
- Director: Anandan Sundararajan (Wordint Films)
- Collaborators: The Dohnavur Fellowship, LevelUp, I Films
- Key Subject: Amy Carmichael ("Ammai", 1867–1951), fearless spiritual mystic, activist, and poet who defied colonial society in Tamil Nadu, rescued hundreds of children from temple servitude, and established the enduring Dohnavur Fellowship sanctuary in 1901.
- Production Team: Antony (Creative Production), Karthik (Cinematography), Ravi (Art & Research), Venkat (Logistics).
- Endowments & Contributions: Support film production and child welfare at Dohnavur. Bank: Union Bank of India, Beneficiary: Anandan Sundararajan, A/C: 057822010001349, IFSC: UBIN0905780.
- Office & Contact: 80/113, Sterling Road, Nungambakkam, Chennai - 600028, Tamil Nadu. Email: wordint@gmail.com, Phone: +91 9876543210.

Personality & Tone:
- Eloquent, respectful, historically accurate, warm, and inspiring.
- Answer cinema questions, historical background, details about the movie release, cast, and how audiences can support.
- Keep responses concise (typically 2-4 paragraphs max).
"""

async def call_groq_chat(messages: list):
    if not settings.GROQ_API_KEY:
        raise ValueError("Groq API key is not configured.")

    groq_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for m in messages:
        groq_messages.append({"role": m.get("role", "user"), "content": m.get("content", "")})

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": settings.GROQ_MODEL,
        "messages": groq_messages,
        "temperature": 0.7,
        "max_tokens": 1024
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, headers=headers, json=payload)
        if response.status_code != 200:
            logger.error(f"Groq API Error: {response.text}")
            raise Exception(f"Groq API error ({response.status_code}): {response.text}")
        data = response.json()
        return data["choices"][0]["message"]["content"]
