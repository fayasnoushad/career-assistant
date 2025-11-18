from pydantic import BaseModel, EmailStr
from typing import Optional, List, Tuple


class UserCreate(BaseModel):
    first_name: str
    last_name: Optional[str] = ""
    email: EmailStr
    password: str


class User(BaseModel):
    first_name: str
    last_name: Optional[str] = ""
    email: EmailStr
    gemini_api: Optional[str] = ""
    admin: Optional[bool] = False


class UserUpdate(BaseModel):
    first_name: str
    last_name: Optional[str] = ""
    gemini_api: Optional[str] = ""


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    admin: bool = False


class LoginStatus(BaseModel):
    status: bool


class Prompt(BaseModel):
    prompt: str


class Name(BaseModel):
    name: str


class Id(BaseModel):
    id: str


class Course(BaseModel):
    id: str
    title: str
    channel: str
    channel_link: str
    link: str
    duration: Optional[str] = None
    level: Optional[str] = None


class Courses(BaseModel):
    courses: List[Course]


class CourseNames(BaseModel):
    courses: List[str]


class Roadmap(BaseModel):
    roadmap: List[str]


class Roadmaps(BaseModel):
    roadmaps: List[List[str]]


class SavedRoadmap(Roadmap):
    id: str


class SavedRoadmaps(BaseModel):
    roadmaps: List[SavedRoadmap]
