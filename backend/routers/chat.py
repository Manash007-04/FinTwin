import os
import json
from openai import OpenAI
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

# Configure Groq (Llama 3.1 via Groq API)
# Groq is OpenAI compatible
api_key = os.getenv("GROQ_API_KEY")
client = None
if api_key:
    client = OpenAI(
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1",
    )
else:
    print("WARNING: GROQ_API_KEY not found in environment. AI will be in Mock mode.")

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    healthScore: int = 85

class ChatResponse(BaseModel):
    text: str
    mood: str = "neutral"
    action: Optional[dict] = None

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        msg = request.message
        score = request.healthScore
        
        # Determine Mood Base
        mood = "neutral"
        if score < 40: mood = "stressed"
        elif score > 80: mood = "happy"

        if not client:
            return ChatResponse(
                text=f"[MOCK] Please set a real GROQ_API_KEY in the backend .env file. Your score is {score}.",
                mood=mood
            )

        # Construct Persona Prompt (Optimized for Llama 3.1)
        system_instruction = f"""
        You are FinTwin, a highly capable financial AI assistant for Aarav. 
        Your personality and tone reflect Aarav's Financial Health Score: {score}/100.

        TONE & PERSONALITY GUIDELINES:
        - Health < 40 (BOSS MODE): You are strict, cynical, and use sharp humor to discourage spending. You prioritize survival over luxury.
        - Health > 80 (RICH MODE): You are celebratory, optimistic, and encourage smart reinvestment or small rewards.
        - Health 40-80 (STABLE): You are professional, balanced, and give data-driven advice.

        CORE CAPABILITY - ACTION EMISSION:
        If the user mentions an expense (e.g., "paid 200 for lunch"), you MUST detect the amount and category.
        You MUST append a JSON block at the absolute end of your response in this exact format:
        {{ "ACTION": {{"type": "log_expense", "amount": 250, "category": "Food", "description": "Lunch at cafe"}} }}
        
        If you are unsure of the category, use "General". If amount is missing, use 0.
        """

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": msg},
            ],
            temperature=0.7,
            max_tokens=500
        )

        full_text = response.choices[0].message.content
        
        # Extract Action
        action = None
        if '"ACTION":' in full_text:
            try:
                # Find the JSON start
                json_start = full_text.rfind('{ "ACTION":')
                if json_start != -1:
                    action_json = full_text[json_start:].strip()
                    display_text = full_text[:json_start].strip()
                    # Parse the actual action object
                    try:
                        action_data = json.loads(action_json)
                        action = action_data.get("ACTION")
                    except json.JSONDecodeError:
                        # Attempt to fix basic JSON errors if Llama hallucinates slightly
                        if not action_json.endswith("}"): action_json += "}"
                        action_data = json.loads(action_json)
                        action = action_data.get("ACTION")
                else:
                    display_text = full_text
            except Exception as e:
                print(f"Action parsing error: {e}")
                display_text = full_text
        else:
            display_text = full_text

        return ChatResponse(
            text=display_text,
            mood=mood,
            action=action
        )

    except Exception as e:
        print(f"CHAT ERROR: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
