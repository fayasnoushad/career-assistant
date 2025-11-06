import re
from . import schemas
from typing import List, Optional
from pymongo import AsyncMongoClient
from .configs import DB_NAME, DB_URL


class Database:
    def __init__(self, url=DB_URL, database_name=DB_NAME):
        self.client = AsyncMongoClient(url)
        self.db = self.client[database_name]
        self.users = self.db["users"]
        self.courses = self.db["courses"]
        self.cache = {}

    async def add_user(self, user):
        await self.users.insert_one(user)

    async def get_user(self, email: str) -> Optional[dict]:
        user = await self.users.find_one({"email": email})
        if user:
            user["id"] = str(user["_id"])
            user.pop("_id", None)
        return user

    async def update_user(self, email: str, data: schemas.UserUpdate):
        await self.users.update_one(
            {"email": email},
            {
                "$set": {
                    "first_name": data.first_name,
                    "last_name": data.last_name,
                    "gemini_api": data.gemini_api,
                }
            },
        )

    async def get_api(self, email: str) -> Optional[str]:
        user = await self.users.find_one({"email": email})
        return user.get("gemini_api") if user else None

    async def add_courses(self, courses: List[dict]):
        await self.courses.insert_many(courses)

    async def get_courses(self, name):
        courses = []
        async for course in self.courses.find(
            {"title": {"$regex": re.escape(name), "$options": "i"}}
        ):
            del course["_id"]
            courses.append(course)
        return courses


db = Database()
