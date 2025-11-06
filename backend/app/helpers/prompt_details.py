import asyncio
from google import genai
from ..schemas import Roadmaps


async def get_prompt_details(prompt: str, api_key: str) -> Roadmaps:
    query = (
        "Given the following prompt, generate several distinct roadmaps. "
        "Each name must be the name of a course, and each roadmap should cover unique topics. "
        "Avoid course names like 'Introduction to HTML and CSS', 'JavaScript Fundamentals', or similar; "
        "use names like 'HTML', 'CSS', 'JavaScript'. "
        "Avoid names like 'Vite/Webpack'; use only one name per course. "
        f"Prompt:\n{prompt}"
    )
    client = genai.Client(api_key=api_key)
    response = await asyncio.to_thread(
        client.models.generate_content,
        model="gemini-2.5-flash-lite",
        contents=query,
        config={
            "response_mime_type": "application/json",
            "response_schema": Roadmaps,
        },
    )
    # Ensure the response is parsed into a Roadmap instance
    if isinstance(response.parsed, Roadmaps):
        return response.parsed
    return Roadmaps.model_validate(response.parsed)
