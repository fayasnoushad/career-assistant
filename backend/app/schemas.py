from pydantic import BaseModel, EmailStr
from typing import Optional, List


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
    career_goal: Optional[str] = ""
    admin: Optional[bool] = False


class UserUpdate(BaseModel):
    first_name: str
    last_name: Optional[str] = ""
    gemini_api: Optional[str] = ""
    career_goal: Optional[str] = ""


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    admin: bool = False


class LoginStatus(BaseModel):
    status: bool


class OTPVerify(BaseModel):
    email: EmailStr
    otp: str


class Prompt(BaseModel):
    prompt: str


class Name(BaseModel):
    name: str


class Id(BaseModel):
    id: str


class JobScrape(BaseModel):
    name: str
    company: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[int] = None
    link: str
    description: str
    time: str


class Job(JobScrape):
    id: str


class Jobs(BaseModel):
    jobs: List[Job]


class JobNames(BaseModel):
    jobs: List[str]


class Salary(BaseModel):
    salary: str


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


class SkillGap(BaseModel):
    skill: str
    importance: str
    reason: str


class ResumeFeedback(BaseModel):
    overall_score: int
    strengths: List[str]
    weaknesses: List[str]
    skill_gaps: List[SkillGap]
    improvement_suggestions: List[str]
    recommended_courses: List[str]
    formatting_tips: List[str]


class ResumeAnalysisRequest(BaseModel):
    target_role: Optional[str] = None
    experience_level: Optional[str] = None


class ResumeAnalysis(BaseModel):
    id: str
    filename: str
    upload_date: str
    target_role: Optional[str] = None
    experience_level: Optional[str] = None
    feedback: ResumeFeedback


class ResumeAnalysisList(BaseModel):
    analyses: List[ResumeAnalysis]


class DashboardData(BaseModel):
    career_goal: Optional[str] = None
    resume_score: Optional[int] = None
    score_trend: Optional[int] = None
    resume_scores_history: List[int] = []
    saved_jobs_count: int = 0
    roadmap_progress: float = 0.0
    total_roadmap_steps: int = 0
    learned_courses_count: int = 0
