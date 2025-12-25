import asyncio
from .. import schemas
from google import genai


async def get_predicted_salary(job: schemas.Job, api_key: str) -> schemas.Salary:
    query = (
        "Predict monthly salary in Indian Rupees for the following job details:\n\n"
        f"Job Name: {job.name}\n"
        f"Description: {job.description}\n"
        f"Company: {job.company}\n"
        f"Location: {job.location}"
    )
    client = genai.Client(api_key=api_key)
    response = await asyncio.to_thread(
        client.models.generate_content,
        model="gemini-2.5-flash-lite",
        contents=query,
        config={
            "response_mime_type": "application/json",
            "response_schema": schemas.Salary,
        },
    )
    if isinstance(response.parsed, schemas.Salary):
        return response.parsed
    return schemas.Salary.model_validate(response.parsed)
