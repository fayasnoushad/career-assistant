from .. import schemas
from ..database import db
from ..configs import MIN_JOB_LIMIT
from .job_prompt_details import get_job_names
from .scrape_helper import simplyhired, naukri
from fastapi.concurrency import run_in_threadpool
from .scrape_helper.webdriver import get_web_driver


async def get_jobs(name: str) -> schemas.Jobs:
    # fetch jobs from database
    jobs = set()
    job_list = []
    for job in await db.get_jobs(name):
        # dict to avoid duplicates
        if job["id"] in jobs:
            continue
        jobs.add(job["id"])
        job_list.append(job)

    # if number of jobs are low, then scrape
    if len(jobs) < MIN_JOB_LIMIT:
        driver = await run_in_threadpool(get_web_driver)
        job_list.clear()
        try:
            job_list.extend(simplyhired.parse(name, driver))
        except Exception as e:
            print(f"Error occurred while scraping SimplyHired: {e}")
        try:
            job_list.extend(naukri.parse(name, driver))
        except Exception as e:
            print(f"Error occurred while scraping Naukri: {e}")
        driver.quit()
        job_list = await db.add_jobs(job_list)

    # return jobs
    return schemas.Jobs(jobs=job_list)


async def get_jobs_by_prompt(user_prompt: str, api_key: str) -> schemas.JobNames:
    # get suitable job names and skills from prompt
    prompt_details = await get_job_names(user_prompt, api_key)
    return prompt_details
