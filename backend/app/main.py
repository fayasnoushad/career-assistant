from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from .routers import jobs, courses, auth, resumes


app = FastAPI(
    title="Career Assistant API",
    description="Career Assistant API",
)

allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(jobs.router)
app.include_router(courses.router)
app.include_router(auth.router)
app.include_router(resumes.router)


@app.get("/")
async def root():
    return RedirectResponse("/docs")
