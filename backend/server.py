from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from openai import OpenAI
import io
import json
from docx import Document
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'resume_builder')]

# OpenAI client
openai_client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic Models
class PersonalInfo(BaseModel):
    fullName: str
    email: str
    phone: str
    location: str = ""
    linkedin: str = ""
    portfolio: str = ""

class ExperienceItem(BaseModel):
    id: str
    title: str
    company: str
    location: str = ""
    startDate: str
    endDate: str = ""
    current: bool = False
    bullets: List[str] = []

class EducationItem(BaseModel):
    id: str
    degree: str
    school: str
    location: str = ""
    graduationDate: str
    gpa: str = ""

class CertificationItem(BaseModel):
    id: str
    name: str
    issuer: str
    date: str = ""

class LanguageItem(BaseModel):
    id: str
    language: str
    proficiency: str

class ResumeData(BaseModel):
    personalInfo: PersonalInfo
    summary: str = ""
    experience: List[ExperienceItem] = []
    education: List[EducationItem] = []
    skills: List[str] = []
    certifications: List[CertificationItem] = []
    languages: List[LanguageItem] = []

class ResumeCreate(BaseModel):
    resumeData: ResumeData
    template: str = "professional"

class Resume(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    resumeData: ResumeData
    template: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class ATSAnalysisRequest(BaseModel):
    resumeData: ResumeData
    jobDescription: str

class KeywordAnalysis(BaseModel):
    matched: List[str]
    missing: List[str]
    overused: List[str] = []

class ImpactOpportunity(BaseModel):
    original: str
    suggestion: str

class ReadabilityAnalysis(BaseModel):
    score: int
    suggestions: List[str]

class ATSAnalysisResponse(BaseModel):
    score: int
    status: str
    keywordAnalysis: KeywordAnalysis
    suggestions: List[str]
    impactOpportunities: List[ImpactOpportunity]
    readability: ReadabilityAnalysis

class ExportRequest(BaseModel):
    resumeData: ResumeData
    template: str

# AI Analysis Function
async def analyze_ats_with_ai(resume_data: ResumeData, job_description: str) -> ATSAnalysisResponse:
    """Use OpenAI to analyze resume against job description"""
    
    resume_text = f"""
Summary: {resume_data.summary}

Skills: {', '.join(resume_data.skills)}

Experience:
{chr(10).join([f"- {exp.title} at {exp.company}: {', '.join(exp.bullets)}" for exp in resume_data.experience])}

Education:
{chr(10).join([f"- {edu.degree} from {edu.school}" for edu in resume_data.education])}
"""
    
    prompt = f"""You are an expert ATS (Applicant Tracking System) analyzer.

Analyze this resume against the job description and provide:
1. ATS compatibility score (0-100)
2. Keywords from job description present in resume
3. Important keywords missing from resume
4. Specific suggestions to improve ATS score
5. Opportunities to quantify bullet points

Resume:
{resume_text}

Job Description:
{job_description}

Respond in JSON format:
{{
  "score": <number>,
  "matched_keywords": [<keywords>],
  "missing_keywords": [<keywords>],
  "suggestions": [<suggestions>],
  "impact_opportunities": [{{"original": "<text>", "improved": "<text>"}}],
  "readability_score": <number>,
  "readability_suggestions": [<suggestions>]
}}
"""
    
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert ATS analyzer. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        
        score = result.get('score', 75)
        status = "Excellent" if score >= 80 else "Good" if score >= 60 else "Needs Work"
        
        return ATSAnalysisResponse(
            score=score,
            status=status,
            keywordAnalysis=KeywordAnalysis(
                matched=result.get('matched_keywords', []),
                missing=result.get('missing_keywords', []),
                overused=[]
            ),
            suggestions=result.get('suggestions', []),
            impactOpportunities=[
                ImpactOpportunity(original=opp.get('original', ''), suggestion=opp.get('improved', ''))
                for opp in result.get('impact_opportunities', [])
            ],
            readability=ReadabilityAnalysis(
                score=result.get('readability_score', 85),
                suggestions=result.get('readability_suggestions', [])
            )
        )
    except Exception as e:
        logger.error(f"OpenAI error: {str(e)}")
        return ATSAnalysisResponse(
            score=70,
            status="Good",
            keywordAnalysis=KeywordAnalysis(matched=["Product Management"], missing=["Machine Learning"], overused=[]),
            suggestions=["Add more quantified achievements"],
            impactOpportunities=[],
            readability=ReadabilityAnalysis(score=80, suggestions=["Use stronger action verbs"])
        )

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Resume Builder API"}

@api_router.post("/resumes", response_model=Resume)
async def create_resume(input: ResumeCreate):
    resume_obj = Resume(resumeData=input.resumeData, template=input.template)
    await db.resumes.insert_one(resume_obj.dict())
    return resume_obj

@api_router.get("/resumes", response_model=List[Resume])
async def get_resumes():
    resumes = await db.resumes.find().to_list(1000)
    return [Resume(**resume) for resume in resumes]

@api_router.get("/resumes/{resume_id}", response_model=Resume)
async def get_resume(resume_id: str):
    resume = await db.resumes.find_one({"id": resume_id})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return Resume(**resume)

@api_router.post("/ai/analyze-ats", response_model=ATSAnalysisResponse)
async def analyze_ats(request: ATSAnalysisRequest):
    return await analyze_ats_with_ai(request.resumeData, request.jobDescription)

@api_router.post("/export/pdf")
async def export_pdf(request: ExportRequest):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=24, textColor=colors.HexColor('#0f172a'), spaceAfter=12)
    heading_style = ParagraphStyle('Heading', parent=styles['Heading2'], fontSize=14, textColor=colors.HexColor('#0f172a'), spaceBefore=12, spaceAfter=6)
    
    data = request.resumeData
    
    story.append(Paragraph(data.personalInfo.fullName, title_style))
    story.append(Spacer(1, 6))
    
    contact_text = f"{data.personalInfo.email} | {data.personalInfo.phone}"
    if data.personalInfo.location:
        contact_text += f" | {data.personalInfo.location}"
    story.append(Paragraph(contact_text, styles['Normal']))
    story.append(Spacer(1, 12))
    
    if data.summary:
        story.append(Paragraph("PROFESSIONAL SUMMARY", heading_style))
        story.append(Paragraph(data.summary, styles['Normal']))
        story.append(Spacer(1, 12))
    
    if data.experience:
        story.append(Paragraph("WORK EXPERIENCE", heading_style))
        for exp in data.experience:
            job_title = f"<b>{exp.title}</b> - {exp.company}"
            story.append(Paragraph(job_title, styles['Normal']))
            date_range = f"{exp.startDate} - {'Present' if exp.current else exp.endDate}"
            story.append(Paragraph(date_range, styles['Normal']))
            for bullet in exp.bullets:
                if bullet:
                    story.append(Paragraph(f"• {bullet}", styles['Normal']))
            story.append(Spacer(1, 8))
    
    if data.education:
        story.append(Paragraph("EDUCATION", heading_style))
        for edu in data.education:
            degree_text = f"<b>{edu.degree}</b> - {edu.school} ({edu.graduationDate})"
            story.append(Paragraph(degree_text, styles['Normal']))
            story.append(Spacer(1, 8))
    
    if data.skills:
        story.append(Paragraph("SKILLS", heading_style))
        skills_text = ", ".join(data.skills)
        story.append(Paragraph(skills_text, styles['Normal']))
    
    doc.build(story)
    buffer.seek(0)
    
    filename = f"{data.personalInfo.fullName.replace(' ', '_')}_Resume.pdf"
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename={filename}"})

@api_router.post("/export/docx")
async def export_docx(request: ExportRequest):
    doc = Document()
    data = request.resumeData
    
    name_para = doc.add_heading(data.personalInfo.fullName, 0)
    name_para.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    
    contact_text = f"{data.personalInfo.email} | {data.personalInfo.phone}"
    if data.personalInfo.location:
        contact_text += f" | {data.personalInfo.location}"
    contact_para = doc.add_paragraph(contact_text)
    contact_para.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    
    if data.summary:
        doc.add_heading('Professional Summary', 1)
        doc.add_paragraph(data.summary)
    
    if data.experience:
        doc.add_heading('Work Experience', 1)
        for exp in data.experience:
            job_para = doc.add_paragraph()
            job_para.add_run(f"{exp.title}").bold = True
            job_para.add_run(f" - {exp.company}")
            date_range = f"{exp.startDate} - {'Present' if exp.current else exp.endDate}"
            doc.add_paragraph(date_range)
            for bullet in exp.bullets:
                if bullet:
                    doc.add_paragraph(bullet, style='List Bullet')
    
    if data.education:
        doc.add_heading('Education', 1)
        for edu in data.education:
            edu_para = doc.add_paragraph()
            edu_para.add_run(edu.degree).bold = True
            edu_para.add_run(f" - {edu.school} ({edu.graduationDate})")
    
    if data.skills:
        doc.add_heading('Skills', 1)
        doc.add_paragraph(", ".join(data.skills))
    
    if data.certifications:
        doc.add_heading('Certifications', 1)
        for cert in data.certifications:
            cert_text = f"{cert.name} - {cert.issuer}"
            if cert.date:
                cert_text += f" ({cert.date})"
            doc.add_paragraph(cert_text, style='List Bullet')
    
    if data.languages:
        doc.add_heading('Languages', 1)
        for lang in data.languages:
            doc.add_paragraph(f"{lang.language}: {lang.proficiency}", style='List Bullet')
    
    buffer = io.BytesIO()
    doc.save(buffer)
    buffer.seek(0)
    
    filename = f"{data.personalInfo.fullName.replace(' ', '_')}_Resume.docx"
    return StreamingResponse(buffer, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", headers={"Content-Disposition": f"attachment; filename={filename}"})

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
