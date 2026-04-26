from .. import schemas
from ..database import db
from .auth import get_user_id
from fastapi import APIRouter, Depends, HTTPException
from ..helpers.job_salary_predict import get_predicted_salary
from ..helpers.jobs_find import get_jobs, get_jobs_by_prompt
from ..helpers.job_details import get_job_details_by_ai
from ..helpers.scrape_helper.youtube_video_scrape import scrape_youtube_videos

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("/prompt/", response_model=schemas.JobNames)
async def get_job_details_by_prompt(
    details: schemas.Prompt, user_id: str = Depends(get_user_id)
):
    user_prompt = details.prompt
    api_key = await db.get_api(user_id)
    if not api_key:
        raise HTTPException(status_code=400, detail="Gemini API Key not found")
    jobs = await get_jobs_by_prompt(user_prompt, api_key)
    return jobs


@router.post("/category/", response_model=schemas.Jobs)
async def get_job_details_by_category(details: schemas.Name):
    jobs = await get_jobs(details.name)
    return jobs


@router.post("/save/")
async def save_job(details: schemas.Id, user_id: str = Depends(get_user_id)):
    job_id = details.id
    await db.save_job(job_id, user_id)


@router.post("/unsave/")
async def unsave_job(details: schemas.Id, user_id: str = Depends(get_user_id)):
    job_id = details.id
    await db.unsave_job(job_id, user_id)


@router.get("/saved_jobs/", response_model=schemas.Jobs)
async def get_saved_jobs(user_id: str = Depends(get_user_id)):
    return schemas.Jobs(jobs=await db.get_saved_jobs(user_id))


@router.post("/predict_salary/", response_model=schemas.Salary)
async def predict_salary(details: schemas.Id, user_id: str = Depends(get_user_id)):
    api_key = await db.get_api(user_id)
    if not api_key:
        raise HTTPException(status_code=400, detail="Gemini API Key not found")
    job = await db.get_job(details.id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return await get_predicted_salary(schemas.Job.model_validate(job), api_key)


@router.post("/details/", response_model=schemas.JobDetails)
async def get_job_details_using_name(
    details: schemas.Name, user_id: str = Depends(get_user_id)
):
    job_details = await db.get_job_details(details.name)
    if job_details:
        return job_details
    api_key = await db.get_api(user_id)
    if not api_key:
        raise HTTPException(status_code=400, detail="Gemini API Key not found")
    job_details = await get_job_details_by_ai(details.name, api_key)
    # Scrape YouTube videos related to the job and add them to the resources
    try:
        resources = await scrape_youtube_videos(details.name)
    except Exception as e:
        print(f"Error occurred while scraping YouTube videos: {e}")
        resources = []
    updated_job_details = schemas.JobDetails(
        job_name=job_details.job_name,
        description=job_details.description,
        responsibilities=job_details.responsibilities,
        minimum_skills_required=job_details.minimum_skills_required,
        career_scope=job_details.career_scope,
        resources=resources,
    )
    await db.add_job_details(updated_job_details)
    return updated_job_details
