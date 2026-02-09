import re
from . import schemas
from bson.objectid import ObjectId
from typing import List, Optional
from pymongo import AsyncMongoClient
from .configs import DB_NAME, DB_URL
from datetime import datetime, timezone


class Database:
    def __init__(self, url=DB_URL, database_name=DB_NAME):
        self.client = AsyncMongoClient(url)
        self.db = self.client[database_name]
        self.users = self.db["users"]
        self.pending_users = self.db["pending_users"]
        self.job_details = self.db["job_details"]
        self.jobs = self.db["jobs"]
        self.courses = self.db["courses"]
        self.saved_jobs = self.db["saved_jobs"]
        self.saved_courses = self.db["saved_courses"]
        self.saved_roadmaps = self.db["saved_roadmaps"]
        self.learned_courses = self.db["learned_courses"]
        self.resumes = self.db["resumes"]
        self.cache = {}

    async def add_user(self, user):
        result = await self.users.insert_one(user)
        return str(result.inserted_id)

    async def add_pending_user(self, user):
        await self.pending_users.delete_many({"email": user["email"]})
        await self.pending_users.insert_one(user)

    async def get_user(self, user_id: str = "", email: str = ""):
        if not user_id and not email:
            return
        user = await self.users.find_one(
            {"_id": ObjectId(user_id)} if user_id else {"email": email}
        )
        if user:
            user["id"] = str(user["_id"])
            user.pop("_id", None)
        return user

    async def verify_user_otp(self, email: str, otp: str):
        user = await self.pending_users.find_one({"email": email})
        if not user:
            return None
        if user.get("otp") != otp:
            return None
        if user.get("otp_exp"):
            otp_exp = user["otp_exp"]
            # Ensure otp_exp is timezone-aware (assume UTC if naive)
            if otp_exp.tzinfo is None or otp_exp.tzinfo.utcoffset(otp_exp) is None:
                otp_exp = otp_exp.replace(tzinfo=timezone.utc)
            if otp_exp < datetime.now(timezone.utc):
                return None
        user.pop("_id", None)
        user.pop("otp", None)
        user.pop("otp_exp", None)
        user_id = await self.add_user(user)
        await self.pending_users.delete_many({"email": email})
        return await self.get_user(user_id)

    async def update_user(self, user_id: str, data: schemas.UserUpdate):
        await self.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "first_name": data.first_name,
                    "last_name": data.last_name,
                    "gemini_api": data.gemini_api,
                    "career_goal": data.career_goal,
                }
            },
        )

    async def get_api(self, user_id: str) -> Optional[str]:
        user = await self.users.find_one({"_id": ObjectId(user_id)})
        return user.get("gemini_api") if user else None

    async def add_job_details(self, job_details: schemas.JobDetails):
        await self.job_details.insert_one(job_details)

    async def get_job_details(self, job_name) -> schemas.JobDetails | None:
        job_details = await self.job_details.find_one({"name": job_name})
        return job_details if job_details else None

    async def add_job(self, job: dict) -> str:
        # check the same job stored in database or not
        same_job = await self.jobs.find_one({"link": job.get("name")})
        if same_job:
            same_job["id"] = str(same_job["_id"])
            same_job.pop("_id", None)
            return same_job
        result = await self.jobs.insert_one(job)
        return str(result.inserted_id)

    async def add_jobs(self, jobs: List[dict]) -> List[schemas.Job]:
        job_list = []
        for job in jobs:
            try:
                inserted_job_id = await self.add_job(job)
                job.pop("_id", None)
                job["id"] = inserted_job_id
                job_list.append(schemas.Job(**job))
            except Exception:
                pass
        return job_list

    async def get_job(self, job_id: str):
        job = await self.jobs.find_one({"_id": ObjectId(job_id)})
        if job:
            job["id"] = job_id
            del job["_id"]
        return job

    async def get_jobs(self, job_name: str) -> List[dict]:
        jobs = []
        async for job in self.jobs.find(
            {"name": {"$regex": re.escape(job_name), "$options": "i"}}
        ):
            job["id"] = str(job["_id"])
            del job["_id"]
            jobs.append(job)
        return jobs

    async def save_job(self, job_id, user_id):
        await self.unsave_job(job_id, user_id)
        await self.saved_jobs.insert_one(
            {"job_id": ObjectId(job_id), "user_id": ObjectId(user_id)}
        )

    async def unsave_job(self, job_id, user_id):
        await self.saved_jobs.delete_one(
            {"job_id": ObjectId(job_id), "user_id": ObjectId(user_id)}
        )

    async def get_saved_jobs(self, user_id):
        jobs = []
        async for saved_job in self.saved_jobs.find({"user_id": ObjectId(user_id)}):
            job_id = saved_job["job_id"]
            job = await self.jobs.find_one({"_id": job_id})
            if job:
                job["id"] = str(job_id)
                del job["_id"]
                jobs.append(job)
        return jobs

    async def add_courses(self, courses: List[dict]):
        result = await self.courses.insert_many(courses)
        return result.inserted_ids

    async def get_courses(self, name):
        courses = []
        async for course in self.courses.find(
            {"title": {"$regex": re.escape(name), "$options": "i"}}
        ):
            course["id"] = str(course["_id"])
            del course["_id"]
            courses.append(course)
        return courses

    async def save_course(self, course_id, user_id):
        await self.unsave_course(course_id, user_id)
        await self.saved_courses.insert_one(
            {"course_id": ObjectId(course_id), "user_id": ObjectId(user_id)}
        )

    async def unsave_course(self, course_id, user_id):
        await self.saved_courses.delete_one(
            {"course_id": ObjectId(course_id), "user_id": ObjectId(user_id)}
        )

    async def get_saved_courses(self, user_id):
        courses = []
        async for saved_course in self.saved_courses.find(
            {"user_id": ObjectId(user_id)}
        ):
            course_id = saved_course["course_id"]
            course = await self.courses.find_one({"_id": course_id})
            if course:
                course["id"] = str(course_id)
                del course["_id"]
                courses.append(course)
        return courses

    async def save_roadmap(self, user_id, roadmap: List[str]):
        await self.saved_roadmaps.insert_one(
            {"user_id": ObjectId(user_id), "roadmap": roadmap}
        )

    async def get_saved_roadmaps(self, user_id):
        roadmaps = []
        async for saved_roadmap in self.saved_roadmaps.find(
            {"user_id": ObjectId(user_id)}
        ):
            saved_roadmap["id"] = str(saved_roadmap["_id"])
            del saved_roadmap["user_id"]
            del saved_roadmap["_id"]
            roadmaps.append(saved_roadmap)
        return roadmaps

    async def remove_roadmap(self, user_id, roadmap_id):
        await self.saved_roadmaps.delete_one(
            {"_id": ObjectId(roadmap_id), "user_id": ObjectId(user_id)}
        )

    async def get_learned_courses(self, user_id: str):
        doc = await self.learned_courses.find_one({"user_id": ObjectId(user_id)})
        learned_courses = doc["courses"] if doc else []
        return learned_courses

    async def add_learned_course(self, user_id, course_name: str):
        learned_courses = await self.get_learned_courses(user_id)
        if course_name not in learned_courses:
            learned_courses.append(course_name)
        await self.learned_courses.update_one(
            {"user_id": ObjectId(user_id)},
            {"$set": {"courses": learned_courses}},
            upsert=True,
        )

    async def remove_learned_course(self, user_id, course_name: str):
        learned_courses = await self.get_learned_courses(user_id)
        if course_name in learned_courses:
            learned_courses.remove(course_name)
        await self.learned_courses.update_one(
            {"user_id": ObjectId(user_id)},
            {"$set": {"courses": learned_courses}},
            upsert=True,
        )

    async def save_resume_analysis(self, user_id: str, resume_data: dict) -> str:
        """Save a resume analysis to the database"""
        resume_data["user_id"] = ObjectId(user_id)
        result = await self.resumes.insert_one(resume_data)
        return str(result.inserted_id)

    async def get_resume_analyses(self, user_id: str) -> List[dict]:
        """Get all resume analyses for a user"""
        analyses = []
        async for resume in self.resumes.find({"user_id": ObjectId(user_id)}).sort(
            "_id", -1
        ):
            resume["id"] = str(resume["_id"])
            del resume["_id"]
            del resume["user_id"]
            analyses.append(resume)
        return analyses

    async def get_resume_analysis(self, user_id: str, resume_id: str) -> Optional[dict]:
        """Get a specific resume analysis"""
        resume = await self.resumes.find_one(
            {"_id": ObjectId(resume_id), "user_id": ObjectId(user_id)}
        )
        if resume:
            resume["id"] = str(resume["_id"])
            del resume["_id"]
            del resume["user_id"]
        return resume

    async def delete_resume_analysis(self, user_id: str, resume_id: str):
        """Delete a resume analysis"""
        await self.resumes.delete_one(
            {"_id": ObjectId(resume_id), "user_id": ObjectId(user_id)}
        )


db = Database()
