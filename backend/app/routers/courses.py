from .. import schemas
from ..database import db
from .auth import oauth2_scheme, verify_token, get_user_id
from fastapi import APIRouter, Depends, HTTPException
from ..helpers.courses_find import get_courses, get_courses_by_prompt

router = APIRouter(prefix="/courses", tags=["courses"])


@router.post("/prompt/", response_model=schemas.Roadmaps)
async def get_course_details_by_prompt(
    details: schemas.Prompt, user_id: str = Depends(get_user_id)
):
    user_prompt = details.prompt
    api_key = await db.get_api(user_id)
    if not api_key:
        raise HTTPException(status_code=400, detail="Gemini API Key not found")
    courses = await get_courses_by_prompt(user_prompt, api_key)
    return courses


@router.post("/category/", response_model=schemas.Courses)
async def get_course_details_by_category(details: schemas.Name):
    courses = await get_courses([details.name])
    return courses


@router.post("/save_roadmap/")
async def save_roadmap(
    details: schemas.Roadmap,
    user_id: str = Depends(get_user_id),
):
    roadmap = details.roadmap
    await db.save_roadmap(user_id, roadmap)


@router.get("/saved_roadmaps/", response_model=schemas.SavedRoadmaps)
async def get_saved_roadmaps(user_id: str = Depends(get_user_id)):
    roadmaps = await db.get_saved_roadmaps(user_id)
    return schemas.SavedRoadmaps(roadmaps=roadmaps)


@router.post("/remove_roadmap/")
async def remove_roadmap(details: schemas.Id, user_id: str = Depends(get_user_id)):
    roadmap_id = details.id
    await db.remove_roadmap(user_id, roadmap_id)


@router.post("/save/")
async def save_course(details: schemas.Id, user_id: str = Depends(get_user_id)):
    course_id = details.id
    await db.save_course(course_id, user_id)


@router.post("/unsave/")
async def unsave_course(details: schemas.Id, user_id: str = Depends(get_user_id)):
    course_id = details.id
    await db.unsave_course(course_id, user_id)


@router.get("/saved_courses/", response_model=schemas.Courses)
async def get_saved_courses(user_id: str = Depends(get_user_id)):
    return schemas.Courses(courses=await db.get_saved_courses(user_id))


@router.get("/learned_courses/", response_model=schemas.CourseNames)
async def get_learned_courses(user_id: str = Depends(get_user_id)):
    learned_courses = await db.get_learned_courses(user_id)
    return schemas.CourseNames(courses=learned_courses)


@router.post("/add_learned_course/")
async def add_learned_course(
    details: schemas.Name, user_id: str = Depends(get_user_id)
):
    course_name = details.name
    await db.add_learned_course(user_id, course_name)


@router.post("/remove_learned_course/")
async def remove_learned_course(
    details: schemas.Name, user_id: str = Depends(get_user_id)
):
    course_name = details.name
    await db.remove_learned_course(user_id, course_name)
