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
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=400, detail="User ID not found in token")
    api_key = await db.get_api(user_id)
    if not api_key:
        raise HTTPException(status_code=400, detail="Gemini API Key not found")
    courses = await get_courses_by_prompt(user_prompt, api_key)
    return courses


@router.post("/category/", response_model=schemas.Courses)
async def get_course_details_by_category(details: schemas.Name):
    courses = await get_courses([details.name])
    return courses


@router.post("/save/")
async def save_course(
    details: schemas.Id,
    token: str = Depends(oauth2_scheme),
):
    course_id = details.id
    payload = verify_token(token)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=400, detail="User ID not found in token")
    await db.save_course(course_id, user_id)


@router.post("/unsave/")
async def unsave_course(
    details: schemas.Id,
    token: str = Depends(oauth2_scheme),
):
    course_id = details.id
    payload = verify_token(token)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=400, detail="User ID not found in token")
    await db.unsave_course(course_id, user_id)


@router.get("/saved_courses/", response_model=schemas.Courses)
async def get_saved_courses(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=400, detail="User ID not found in token")
    return schemas.Courses(courses=await db.get_saved_courses(user_id))
