"""
Resume Parser Helper
Extracts text and metadata from PDF and DOCX resume files
"""

import io
import re
from typing import Dict
from PyPDF2 import PdfReader
from docx import Document


class ResumeParser:
    """Parse resumes from PDF and DOCX formats"""

    def __init__(self, file_content: bytes, filename: str):
        self.file_content = file_content
        self.filename = filename
        self.file_extension = filename.split(".")[-1].lower()

    def parse(self) -> Dict[str, str]:
        """
        Parse the resume and return extracted text and metadata

        Returns:
            dict: Contains 'text', 'skills', 'experience', 'education'
        """
        if self.file_extension == "pdf":
            text = self._parse_pdf()
        elif self.file_extension in ["docx", "doc"]:
            text = self._parse_docx()
        else:
            raise ValueError(f"Unsupported file format: {self.file_extension}")

        # Extract structured information
        skills = self._extract_skills(text)
        experience = self._extract_experience(text)
        education = self._extract_education(text)
        contact = self._extract_contact(text)

        return {
            "text": text,
            "skills": skills,
            "experience": experience,
            "education": education,
            "contact": contact,
        }

    def _parse_pdf(self) -> str:
        """Extract text from PDF file"""
        try:
            pdf_file = io.BytesIO(self.file_content)
            pdf_reader = PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            raise ValueError(f"Error parsing PDF: {str(e)}")

    def _parse_docx(self) -> str:
        """Extract text from DOCX file"""
        try:
            doc_file = io.BytesIO(self.file_content)
            doc = Document(doc_file)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text.strip()
        except Exception as e:
            raise ValueError(f"Error parsing DOCX: {str(e)}")

    def _extract_skills(self, text: str) -> str:
        """Extract skills section from resume text"""
        # Common skill section headers
        skill_patterns = [
            r"(?i)skills?:?\s*(.*?)(?=\n\n|\n[A-Z][a-z]+:|\Z)",
            r"(?i)technical skills?:?\s*(.*?)(?=\n\n|\n[A-Z][a-z]+:|\Z)",
            r"(?i)core competencies:?\s*(.*?)(?=\n\n|\n[A-Z][a-z]+:|\Z)",
        ]

        for pattern in skill_patterns:
            match = re.search(pattern, text, re.DOTALL)
            if match:
                return match.group(1).strip()

        return ""

    def _extract_experience(self, text: str) -> str:
        """Extract experience section from resume text"""
        # Common experience section headers
        exp_patterns = [
            r"(?i)(?:work\s+)?experience:?\s*(.*?)(?=\n\n[A-Z][a-z]+:|\Z)",
            r"(?i)professional experience:?\s*(.*?)(?=\n\n[A-Z][a-z]+:|\Z)",
            r"(?i)employment history:?\s*(.*?)(?=\n\n[A-Z][a-z]+:|\Z)",
        ]

        for pattern in exp_patterns:
            match = re.search(pattern, text, re.DOTALL)
            if match:
                return match.group(1).strip()

        return ""

    def _extract_education(self, text: str) -> str:
        """Extract education section from resume text"""
        # Common education section headers
        edu_patterns = [
            r"(?i)education:?\s*(.*?)(?=\n\n[A-Z][a-z]+:|\Z)",
            r"(?i)academic background:?\s*(.*?)(?=\n\n[A-Z][a-z]+:|\Z)",
            r"(?i)qualifications?:?\s*(.*?)(?=\n\n[A-Z][a-z]+:|\Z)",
        ]

        for pattern in edu_patterns:
            match = re.search(pattern, text, re.DOTALL)
            if match:
                return match.group(1).strip()

        return ""

    def _extract_contact(self, text: str) -> str:
        """Extract contact information from resume text"""
        # Extract email
        email_pattern = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
        email_match = re.search(email_pattern, text)

        # Extract phone
        phone_pattern = r"[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}"
        phone_match = re.search(phone_pattern, text)

        contact_info = []
        if email_match:
            contact_info.append(f"Email: {email_match.group()}")
        if phone_match:
            contact_info.append(f"Phone: {phone_match.group()}")

        return "\n".join(contact_info) if contact_info else ""


def parse_resume(file_content: bytes, filename: str) -> Dict[str, str]:
    """
    Convenience function to parse a resume file

    Args:
        file_content: Binary content of the resume file
        filename: Name of the file including extension

    Returns:
        dict: Parsed resume data
    """
    parser = ResumeParser(file_content, filename)
    return parser.parse()
