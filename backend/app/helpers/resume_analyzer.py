"""
Resume Analysis Helper
Analyzes resume content using Gemini AI to provide skill-gap analysis and improvement suggestions
"""

import asyncio
from typing import Optional
from google import genai
from .. import schemas


class ResumeAnalyzer:
    """Analyze resumes using Gemini AI"""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = genai.Client(api_key=api_key)

    async def analyze_resume(
        self,
        resume_text: str,
        target_role: Optional[str] = None,
        experience_level: Optional[str] = None,
    ) -> schemas.ResumeFeedback:
        """
        Analyze a resume and provide comprehensive feedback

        Args:
            resume_text: The full text of the resume
            target_role: The job role the user is targeting (optional)
            experience_level: Entry-level, Mid-level, Senior, etc. (optional)

        Returns:
            ResumeFeedback: Comprehensive analysis and suggestions
        """
        query = self._build_analysis_query(resume_text, target_role, experience_level)

        response = await asyncio.to_thread(
            self.client.models.generate_content,
            model="gemini-2.5-flash-lite",
            contents=query,
            config={
                "response_mime_type": "application/json",
                "response_schema": schemas.ResumeFeedback,
            },
        )

        if isinstance(response.parsed, schemas.ResumeFeedback):
            return response.parsed
        return schemas.ResumeFeedback.model_validate(response.parsed)

    def _build_analysis_query(
        self,
        resume_text: str,
        target_role: Optional[str],
        experience_level: Optional[str],
    ) -> str:
        """Build the analysis prompt for Gemini"""
        query = f"""
You are an expert career advisor and resume reviewer. Analyze the following resume and provide comprehensive feedback.

Resume Content:
{resume_text}

"""
        if target_role:
            query += f"\nTarget Role: {target_role}\n"
        if experience_level:
            query += f"\nExperience Level: {experience_level}\n"

        query += """
Please provide a detailed analysis including:

1. Overall Score (0-100): Rate the resume's overall quality and effectiveness
2. Strengths: List 3-5 key strengths of this resume
3. Weaknesses: Identify 3-5 areas that need improvement
4. Skill Gaps: Identify missing skills that would be valuable for the target role (or general career advancement)
   - For each skill gap, specify the skill name, importance level (Critical/Important/Nice to have), and reason
5. Improvement Suggestions: Provide 5-7 specific, actionable suggestions to improve the resume
6. Recommended Courses: Suggest 3-5 online courses or topics the candidate should learn to fill skill gaps
7. Formatting Tips: Provide 3-5 tips for improving the resume's format and presentation

Be specific, constructive, and actionable in your feedback. Focus on helping the candidate improve their chances of landing interviews.
"""
        return query


async def analyze_resume(
    resume_text: str,
    api_key: str,
    target_role: Optional[str] = None,
    experience_level: Optional[str] = None,
) -> schemas.ResumeFeedback:
    """
    Convenience function to analyze a resume

    Args:
        resume_text: The full text of the resume
        api_key: Gemini API key
        target_role: Target job role (optional)
        experience_level: Experience level (optional)

    Returns:
        ResumeFeedback: Analysis results
    """
    analyzer = ResumeAnalyzer(api_key)
    return await analyzer.analyze_resume(resume_text, target_role, experience_level)
