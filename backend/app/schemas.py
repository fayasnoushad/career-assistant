from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    first_name: str
    last_name: str | None = ""
    email: EmailStr
    password: str


class User(BaseModel):
    first_name: str
    last_name: str | None = ""
    email: EmailStr
    gemini_api: str | None = ""
    career_goal: str | None = ""
    admin: bool | None = False


class UserUpdate(BaseModel):
    first_name: str
    last_name: str | None = ""
    gemini_api: str | None = ""
    career_goal: str | None = ""


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
    company: str | None = None
    location: str | None = None
    salary: int | None = None
    link: str
    description: str | None = None
    time: str


class Job(JobScrape):
    id: str


class Jobs(BaseModel):
    jobs: list[Job]


class JobNames(BaseModel):
    jobs: list[str]


class JobDetailsByAI(BaseModel):
    job_name: str
    description: str
    responsibilities: list[str]
    minimum_skills_required: list[str]
    career_scope: str


class JobDetails(JobDetailsByAI):
    resources: list[str]


class Salary(BaseModel):
    salary: str


class Course(BaseModel):
    id: str
    title: str
    channel: str
    channel_link: str
    link: str
    duration: str | None = None
    level: str | None = None


class Courses(BaseModel):
    courses: list[Course]


class CourseNames(BaseModel):
    courses: list[str]


class Roadmap(BaseModel):
    roadmap: list[str]


class Roadmaps(BaseModel):
    roadmaps: list[list[str]]


class SavedRoadmap(Roadmap):
    id: str


class SavedRoadmaps(BaseModel):
    roadmaps: list[SavedRoadmap]


class SkillGap(BaseModel):
    skill: str
    importance: str
    reason: str


class ResumeFeedback(BaseModel):
    overall_score: int
    strengths: list[str]
    weaknesses: list[str]
    skill_gaps: list[SkillGap]
    improvement_suggestions: list[str]
    recommended_courses: list[str]
    formatting_tips: list[str]


class ResumeAnalysisRequest(BaseModel):
    target_role: str | None = None
    experience_level: str | None = None


class ResumeAnalysis(BaseModel):
    id: str
    filename: str
    upload_date: str
    target_role: str | None = None
    experience_level: str | None = None
    feedback: ResumeFeedback


class ResumeAnalysisList(BaseModel):
    analyses: list[ResumeAnalysis]


class DashboardData(BaseModel):
    career_goal: str | None = None
    resume_score: int | None = None
    score_trend: int | None = None
    resume_scores_history: list[int] = []
    saved_jobs_count: int = 0
    roadmap_progress: float = 0.0
    total_roadmap_steps: int = 0
    learned_courses_count: int = 0
