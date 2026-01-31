"""
Dashboard Router
Provides aggregated career progress data for dashboard view
"""

from .. import schemas
from ..database import db
from ..routers.auth import get_user_id
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/", response_model=schemas.DashboardData)
async def get_dashboard_data(user_id: str = Depends(get_user_id)):
    """
    Get aggregated dashboard data for the current user

    Returns:
    - Career goal (most recent roadmap title or target role from latest resume)
    - Resume score & improvement trend
    - Saved jobs count
    - Roadmap progress (percentage based on learned courses)
    """
    try:
        # Get career goal from user settings first
        user_data = await db.get_user(user_id=user_id)
        career_goal = user_data.get("career_goal") if user_data else None

        # Get resume analyses for scoring
        resume_analyses = await db.get_resume_analyses(user_id)

        # If no user-set career goal, try to get from resume
        if not career_goal:
            if resume_analyses and len(resume_analyses) > 0:
                latest_resume = resume_analyses[0]
                career_goal = latest_resume.get("target_role")

        # If no resume target role, try to infer from saved roadmaps
        if not career_goal:
            saved_roadmaps = await db.get_saved_roadmaps(user_id)
            if saved_roadmaps and len(saved_roadmaps) > 0:
                # Try to extract career goal from first roadmap step
                first_roadmap = saved_roadmaps[0]
                if first_roadmap.get("roadmap") and len(first_roadmap["roadmap"]) > 0:
                    career_goal = first_roadmap["roadmap"][0]

        # Get resume scores and calculate trend
        resume_scores = []
        if resume_analyses:
            for analysis in resume_analyses:
                if "feedback" in analysis and "overall_score" in analysis["feedback"]:
                    resume_scores.append(analysis["feedback"]["overall_score"])

        current_score = resume_scores[0] if resume_scores else None
        previous_score = resume_scores[1] if len(resume_scores) > 1 else None
        score_trend = None
        if current_score is not None and previous_score is not None:
            score_trend = current_score - previous_score

        # Get saved jobs count
        saved_jobs = await db.get_saved_jobs(user_id)
        saved_jobs_count = len(saved_jobs)

        # Calculate roadmap progress
        saved_roadmaps = await db.get_saved_roadmaps(user_id)
        learned_courses = await db.get_learned_courses(user_id)

        roadmap_progress = 0.0
        total_steps = 0
        if saved_roadmaps:
            for roadmap in saved_roadmaps:
                if roadmap.get("roadmap"):
                    total_steps += len(roadmap["roadmap"])

        if total_steps > 0:
            learned_count = len(learned_courses)
            roadmap_progress = round((learned_count / total_steps) * 100, 1)
            # Cap at 100%
            if roadmap_progress > 100:
                roadmap_progress = 100.0

        return schemas.DashboardData(
            career_goal=career_goal,
            resume_score=current_score,
            score_trend=score_trend,
            resume_scores_history=resume_scores,
            saved_jobs_count=saved_jobs_count,
            roadmap_progress=roadmap_progress,
            total_roadmap_steps=total_steps,
            learned_courses_count=len(learned_courses),
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching dashboard data: {str(e)}"
        )
