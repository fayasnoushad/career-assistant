from typing import List
from .. import schemas
from ..database import db
from ..configs import MIN_COURSE_LIMIT
from .scrape_helper import edx_scrape
from .scrape_helper import youtube_scrape
from .prompt_details import get_prompt_details
from .scrape_helper.webdriver import get_web_driver


async def get_courses(name: str) -> schemas.Courses:
    courses = []
    course_links = set()
    for course in await db.get_courses(name):
        if course.get("link") not in course_links:
            course_links.add(course.get("link"))
            courses.append(course)
    if len(courses) < MIN_COURSE_LIMIT:
        driver = await get_web_driver()
        edx_courses = edx_scrape.parse(driver, name)
        ids = await db.add_courses(edx_courses)
        for i in range(len(ids)):
            edx_courses[i]["id"] = str(ids[i])
        courses.extend(edx_courses)
        youtube_courses = youtube_scrape.parse(driver, name)
        ids = await db.add_courses(youtube_courses)
        for i in range(len(ids)):
            youtube_courses[i]["id"] = str(ids[i])
        courses.extend(youtube_courses)
        driver.quit()
    return schemas.Courses(courses=courses)


async def get_courses_by_prompt(prompt: str, api_key: str) -> schemas.Roadmaps:
    roadmap = await get_prompt_details(prompt, api_key)
    return roadmap
