# Resume Builder - Backend Integration Contracts

## Overview
This document defines the API contracts and integration points between the frontend and backend for the Resume Builder application.

## Current Frontend State (Mocked)
- **Template Selection**: 12 industry-specific templates (all stored in frontend state)
- **Resume Data**: Personal info, summary, experience, education, skills, certifications, languages
- **AI Assistant**: ATS analysis, keyword matching, impact suggestions (currently using mock.js)
- **Export**: PDF/DOCX download (currently shows alert)
- **Save**: LocalStorage only (needs MongoDB integration)

## Backend API Endpoints

### 1. Resume CRUD Operations

#### POST /api/resumes
Create or update a resume
```json
Request:
{
  "resumeData": {
    "personalInfo": {...},
    "summary": "string",
    "experience": [...],
    "education": [...],
    "skills": [...],
    "certifications": [...],
    "languages": [...]
  },
  "template": "professional"
}

Response:
{
  "id": "resume_id",
  "resumeData": {...},
  "template": "professional",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### GET /api/resumes
Get all resumes (for future multi-resume support)
```json
Response:
[
  {
    "id": "resume_id",
    "personalInfo": {...},
    "template": "professional",
    "updatedAt": "timestamp"
  }
]
```

#### GET /api/resumes/:id
Get specific resume
```json
Response:
{
  "id": "resume_id",
  "resumeData": {...},
  "template": "professional"
}
```

---

### 2. AI-Powered ATS Analysis

#### POST /api/ai/analyze-ats
Analyze resume against job description
```json
Request:
{
  "resumeData": {
    "summary": "string",
    "experience": [...],
    "skills": [...]
  },
  "jobDescription": "string"
}

Response:
{
  "score": 78,
  "status": "Good",
  "keywordAnalysis": {
    "matched": ["keyword1", "keyword2"],
    "missing": ["keyword3", "keyword4"],
    "overused": []
  },
  "suggestions": [
    "Add Machine Learning to skills section",
    "Quantify achievements in bullet point 3"
  ],
  "impactOpportunities": [
    {
      "original": "Managed team",
      "suggestion": "Led team of 12 engineers, delivering 5 releases on time"
    }
  ],
  "readability": {
    "score": 85,
    "suggestions": ["Use stronger action verbs"]
  }
}
```

**Implementation**:
- Use OpenAI GPT-4 with system prompt for ATS analysis
- Extract keywords from job description using NLP
- Match against resume content
- Generate improvement suggestions
- Calculate ATS score based on keyword matches, formatting, quantification

---

### 3. Content Optimization

#### POST /api/ai/optimize-bullet
Optimize a single bullet point
```json
Request:
{
  "bullet": "Managed cross-functional team",
  "context": {
    "jobTitle": "Senior Product Manager",
    "company": "TechCorp"
  }
}

Response:
{
  "original": "Managed cross-functional team",
  "optimized": "Led cross-functional team of 12 engineers, 3 designers, and 2 data scientists to deliver 5 major product releases on schedule",
  "improvements": ["Added specific numbers", "Used stronger verb", "Added measurable outcome"]
}
```

**Implementation**:
- Use OpenAI API with prompt engineering
- Focus on: action verbs, quantification, impact, specificity

---

### 4. Export Functionality

#### POST /api/export/pdf
Generate PDF resume
```json
Request:
{
  "resumeData": {...},
  "template": "professional"
}

Response: PDF file download
Content-Type: application/pdf
Content-Disposition: attachment; filename="Alex_Morgan_Resume.pdf"
```

**Implementation**:
- Use `reportlab` or `weasyprint` for PDF generation
- Apply template-specific styling from frontend CSS
- Ensure ATS-friendly formatting (parseable text, no images in critical areas)

#### POST /api/export/docx
Generate DOCX resume
```json
Request:
{
  "resumeData": {...},
  "template": "professional"
}

Response: DOCX file download
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Content-Disposition: attachment; filename="Alex_Morgan_Resume.docx"
```

**Implementation**:
- Use `python-docx` library
- Convert template styling to Word format
- Maintain ATS compatibility

---

## MongoDB Schema

### Resume Collection
```javascript
{
  _id: ObjectId,
  userId: String (optional for future auth),
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    portfolio: String
  },
  summary: String,
  experience: [{
    id: String,
    title: String,
    company: String,
    location: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    bullets: [String]
  }],
  education: [{
    id: String,
    degree: String,
    school: String,
    location: String,
    graduationDate: String,
    gpa: String
  }],
  skills: [String],
  certifications: [{
    id: String,
    name: String,
    issuer: String,
    date: String
  }],
  languages: [{
    id: String,
    language: String,
    proficiency: String
  }],
  template: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Frontend Integration Changes

### Remove Mock Data
**File**: `/app/frontend/src/mock.js`
- Remove mock ATS analysis
- Keep template definitions (they're frontend-only)
- Keep initial sample resume for demo

### Update Components

#### ResumeBuilder.js
```javascript
// Replace mock save
const handleSave = async () => {
  try {
    const response = await axios.post(`${API}/resumes`, {
      resumeData,
      template: selectedTemplate
    });
    setSaveStatus('saved');
  } catch (error) {
    console.error('Save failed:', error);
    setSaveStatus('error');
  }
};
```

#### AIAssistant.js
```javascript
// Replace mock analyze
const handleAnalyze = async () => {
  setIsAnalyzing(true);
  try {
    const response = await axios.post(`${API}/ai/analyze-ats`, {
      resumeData,
      jobDescription
    });
    setAnalysis(response.data);
  } catch (error) {
    console.error('Analysis failed:', error);
  } finally {
    setIsAnalyzing(false);
  }
};
```

#### ExportDialog.js
```javascript
// Replace mock export
const handleExport = async (format) => {
  setExporting(true);
  try {
    const response = await axios.post(
      `${API}/export/${format}`,
      { resumeData, template: selectedTemplate },
      { responseType: 'blob' }
    );
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${resumeData.personalInfo.fullName}_Resume.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    setExportSuccess(true);
  } catch (error) {
    console.error('Export failed:', error);
  } finally {
    setExporting(false);
  }
};
```

---

## Dependencies to Install

### Backend (Python)
```bash
pip install openai python-docx reportlab weasyprint beautifulsoup4 pillow
```

### Environment Variables
```
OPENAI_API_KEY=sk-emergent-80574772fC606B86eC
MONGO_URL=mongodb://localhost:27017
DB_NAME=resume_builder
```

---

## Testing Checklist

### Backend API Tests
- [ ] POST /api/resumes - Create resume
- [ ] GET /api/resumes - List resumes
- [ ] GET /api/resumes/:id - Get single resume
- [ ] POST /api/ai/analyze-ats - ATS analysis returns valid score
- [ ] POST /api/ai/optimize-bullet - Content optimization works
- [ ] POST /api/export/pdf - PDF downloads correctly
- [ ] POST /api/export/docx - DOCX downloads correctly

### Frontend Integration Tests
- [ ] Save button stores resume in MongoDB
- [ ] AI Assistant calls real API and displays results
- [ ] Export generates and downloads actual files
- [ ] Template selection persists with resume
- [ ] All form data syncs with backend

---

## Notes
- All AI features use OpenAI GPT-4 via Emergent LLM key
- PDF/DOCX must maintain ATS-friendly formatting
- No authentication for MVP - add later for multi-user support
- LocalStorage backup remains as fallback
