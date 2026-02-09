import asyncio
from .. import schemas
from google import genai


async def get_job_details_by_ai(job_name: str, api_key: str) -> schemas.JobDetailsByAI:
    query = f'Give job details of "{job_name}"'
    client = genai.Client(api_key=api_key)
    response = await asyncio.to_thread(
        client.models.generate_content,
        model="gemini-2.5-flash",
        contents=query,
        config={
            "response_mime_type": "application/json",
            "response_schema": schemas.JobDetailsByAI,
        },
    )
    if isinstance(response.parsed, schemas.JobDetailsByAI):
        return response.parsed
    return schemas.JobDetailsByAI.model_validate(response.parsed)
