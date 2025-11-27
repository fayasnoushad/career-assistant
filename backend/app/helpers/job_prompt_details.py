import asyncio
from .. import schemas
from google import genai


async def get_job_names(prompt: str, api_key: str) -> schemas.JobNames:
    query = "Give job names according to user prompt" f"Prompt:\n{prompt}"
    client = genai.Client(api_key=api_key)
    response = await asyncio.to_thread(
        client.models.generate_content,
        model="gemini-2.5-flash-lite",
        contents=query,
        config={
            "response_mime_type": "application/json",
            "response_schema": schemas.JobNames,
        },
    )
    if isinstance(response.parsed, schemas.JobNames):
        return response.parsed
    return schemas.JobNames.model_validate(response.parsed)
