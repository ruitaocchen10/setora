import os
from supabase import create_client


async def save_assistant_message(session_id: str, content: str) -> None:
    client = create_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_SERVICE_ROLE_KEY"],
    )
    client.table("messages").insert({
        "session_id": session_id,
        "role": "assistant",
        "content": content,
    }).execute()
