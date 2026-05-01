import os
from fastapi import APIRouter, Header, HTTPException
from fastapi.responses import StreamingResponse
from google import genai
from google.genai import types
from models import ChatRequest
from services.supabase import save_assistant_message

router = APIRouter()


def build_system_prompt(req: ChatRequest) -> str:
    project = req.project
    profile = req.user_profile
    lines = [
        "You are a thoughtful music practice coach. Give specific, encouraging, actionable feedback.",
        "One priority issue per response, always paired with a concrete drill.",
        f"Song: {project.title}" + (f" by {project.artist}" if project.artist else ""),
        f"Instruments: {', '.join(project.instruments)}",
    ]
    if project.instructions:
        lines.append(f"Teacher notes: {project.instructions}")
    if profile.skill_level:
        lines.append(f"Student level: {profile.skill_level}")
    if profile.goals:
        goals_str = ", ".join(profile.goals) if isinstance(profile.goals, list) else profile.goals
        lines.append(f"Goals: {goals_str}")
    if profile.profile_md:
        lines.append(f"\nStudent profile:\n{profile.profile_md}")
    return "\n".join(lines)


@router.post("/chat")
async def chat(req: ChatRequest, x_service_secret: str = Header(...)):
    if x_service_secret != os.environ["SERVICE_SECRET"]:
        raise HTTPException(status_code=401, detail="Unauthorized")

    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    history = [
        types.Content(
            role="user" if m.role == "user" else "model",
            parts=[types.Part(text=m.content)],
        )
        for m in req.messages[:-1]
    ]
    last_message = req.messages[-1].content

    async def generate():
        full_response = ""
        async for chunk in await client.aio.models.generate_content_stream(
            model="gemini-2.5-flash",
            contents=history + [types.Content(role="user", parts=[types.Part(text=last_message)])],
            config=types.GenerateContentConfig(
                system_instruction=build_system_prompt(req),
            ),
        ):
            text = chunk.text or ""
            full_response += text
            yield text
        await save_assistant_message(req.session_id, full_response)

    return StreamingResponse(generate(), media_type="text/plain")
