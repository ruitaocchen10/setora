from pydantic import BaseModel

class MessageParam(BaseModel):
    role: str
    content: str | None = None

class Project(BaseModel):
    title: str
    artist: str | None = None
    instruments: list[str]
    instructions: str | None = None

class UserProfile(BaseModel):
    skill_level: str | None = None
    goals: list[str] | str | None = None
    profile_md: str | None = None

class ChatRequest(BaseModel):
    session_id: str
    messages: list[MessageParam]
    project: Project
    user_profile: UserProfile
