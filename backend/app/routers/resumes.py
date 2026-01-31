"""
Resume Router
Handles resume upload, analysis, and retrieval endpoints
"""

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from typing import Optional
from .. import schemas
from ..database import db
from ..routers.auth import get_user_id
from ..helpers.resume_parser import parse_resume
from ..helpers.resume_analyzer import analyze_resume

router = APIRouter(prefix="/resumes", tags=["resumes"])


@router.post("/upload", response_model=schemas.ResumeAnalysis)
async def upload_resume(
    file: UploadFile = File(...),
    target_role: Optional[str] = Form(None),
    experience_level: Optional[str] = Form(None),
    user_id: str = Depends(get_user_id),
):
    """
    Upload a resume for analysis

    - **file**: PDF or DOCX resume file
    - **target_role**: Optional target job role
    - **experience_level**: Optional experience level (Entry-level, Mid-level, Senior, etc.)
    """
    # Validate file type
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in ["pdf", "docx", "doc"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Only PDF and DOCX files are supported.",
        )

    try:
        # Read file content
        file_content = await file.read()
        # Parse resume
        parsed_data = parse_resume(file_content, file.filename)
        # Get user's saved API key
        api_key = await db.get_api(user_id)

        if not api_key:
            raise HTTPException(
                status_code=400,
                detail="No Gemini API key configured. Please set your API key in settings.",
            )

        # Analyze resume
        feedback = await analyze_resume(
            resume_text=parsed_data["text"],
            api_key=api_key,
            target_role=target_role,
            experience_level=experience_level,
        )

        # Save to database
        resume_data = {
            "filename": file.filename,
            "upload_date": datetime.now(timezone.utc).isoformat(),
            "target_role": target_role,
            "experience_level": experience_level,
            "feedback": feedback.model_dump(),
            "parsed_data": parsed_data,
        }
        resume_id = await db.save_resume_analysis(user_id, resume_data)
        return schemas.ResumeAnalysis(
            id=resume_id,
            filename=file.filename,
            upload_date=resume_data["upload_date"],
            target_role=target_role,
            experience_level=experience_level,
            feedback=feedback,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing resume: {str(e)}"
        )


@router.get("/", response_model=schemas.ResumeAnalysisList)
async def get_resume_analyses(user_id: str = Depends(get_user_id)):
    """
    Get all resume analyses for the current user
    """
    try:
        analyses = await db.get_resume_analyses(user_id)
        # Convert to schema format
        analysis_list = [
            schemas.ResumeAnalysis(
                id=analysis["id"],
                filename=analysis["filename"],
                upload_date=analysis["upload_date"],
                target_role=analysis.get("target_role"),
                experience_level=analysis.get("experience_level"),
                feedback=schemas.ResumeFeedback(**analysis["feedback"]),
            )
            for analysis in analyses
        ]
        return schemas.ResumeAnalysisList(analyses=analysis_list)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving resume analyses: {str(e)}",
        )


@router.get("/{resume_id}", response_model=schemas.ResumeAnalysis)
async def get_resume_analysis(
    resume_id: str,
    user_id: str = Depends(get_user_id),
):
    """
    Get a specific resume analysis by ID
    """
    try:
        analysis = await db.get_resume_analysis(user_id, resume_id)

        if not analysis:
            raise HTTPException(status_code=404, detail="Resume analysis not found")
        return schemas.ResumeAnalysis(
            id=analysis["id"],
            filename=analysis["filename"],
            upload_date=analysis["upload_date"],
            target_role=analysis.get("target_role"),
            experience_level=analysis.get("experience_level"),
            feedback=schemas.ResumeFeedback(**analysis["feedback"]),
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving resume analysis: {str(e)}"
        )


@router.delete("/{resume_id}")
async def delete_resume_analysis(
    resume_id: str,
    user_id: str = Depends(get_user_id),
):
    """
    Delete a resume analysis
    """
    try:
        # Check if analysis exists
        analysis = await db.get_resume_analysis(user_id, resume_id)
        if not analysis:
            raise HTTPException(status_code=404, detail="Resume analysis not found")
        await db.delete_resume_analysis(user_id, resume_id)
        return {"message": "Resume analysis deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error deleting resume analysis: {str(e)}"
        )
