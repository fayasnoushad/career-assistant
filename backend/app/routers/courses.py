from .. import schemas
from ..database import db
from .auth import oauth2_scheme, verify_token
from fastapi import APIRouter, Depends, HTTPException
from ..helpers.courses_find import get_courses, get_courses_by_prompt

router = APIRouter(prefix="/courses", tags=["courses"])


@router.post("/prompt/", response_model=schemas.Roadmaps)
async def get_course_details_by_prompt(
    details: schemas.Prompt,
    token: str = Depends(oauth2_scheme),
):
    user_prompt = details.prompt
    payload = verify_token(token)
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=400, detail="Email not found in token")
    api_key = await db.get_api(email)
    if not api_key:
        raise HTTPException(status_code=400, detail="Gemini API Key not found")
    courses = await get_courses_by_prompt(user_prompt, api_key)
    return courses


@router.post("/category/", response_model=schemas.Courses)
async def get_course_details_by_category(details: schemas.Name):
    courses = await get_courses([details.name])
    return courses
