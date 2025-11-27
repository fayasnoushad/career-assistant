from .. import schemas
from ..database import db
from .auth import get_user_id
from fastapi import APIRouter, Depends, HTTPException
from ..helpers.jobs_find import get_jobs, get_jobs_by_prompt

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("/prompt/", response_model=schemas.JobNames)
async def get_course_details_by_prompt(
    details: schemas.Prompt, user_id: str = Depends(get_user_id)
):
    user_prompt = details.prompt
    api_key = await db.get_api(user_id)
    if not api_key:
        raise HTTPException(status_code=400, detail="Gemini API Key not found")
    jobs = await get_jobs_by_prompt(user_prompt, api_key)
    return jobs


@router.post("/category/", response_model=schemas.Jobs)
async def get_course_details_by_category(details: schemas.Name):
    jobs = await get_jobs(details.name)
    return jobs
