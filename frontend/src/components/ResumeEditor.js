import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import './ResumeEditor.css';

const ResumeEditor = ({ resumeData, setResumeData, selectedTemplate, setSelectedTemplate }) => {
  const updatePersonalInfo = (field, value) => {
    setResumeData({
      ...resumeData,
      personalInfo: { ...resumeData.personalInfo, [field]: value }
    });
  };

  const updateSummary = (value) => {
    setResumeData({ ...resumeData, summary: value });
  };

  const addExperience = () => {
    const newExp = {
      id: `exp${Date.now()}`,
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: ['']
    };
    setResumeData({ ...resumeData, experience: [...resumeData.experience, newExp] });
  };

  const updateExperience = (id, field, value) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const addBullet = (expId) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp =>
        exp.id === expId ? { ...exp, bullets: [...exp.bullets, ''] } : exp
      )
    });
  };

  const updateBullet = (expId, index, value) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp =>
        exp.id === expId
          ? { ...exp, bullets: exp.bullets.map((b, i) => i === index ? value : b) }
          : exp
      )
    });
  };

  const removeExperience = (id) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    const newEdu = {
      id: `edu${Date.now()}`,
      degree: '',
      school: '',
      location: '',
      graduationDate: '',
      gpa: ''
    };
    setResumeData({ ...resumeData, education: [...resumeData.education, newEdu] });
  };

  const updateEducation = (id, field, value) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    });
  };

  const addSkill = () => {
    setResumeData({ ...resumeData, skills: [...resumeData.skills, ''] });
  };

  const updateSkill = (index, value) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map((s, i) => i === index ? value : s)
    });
  };

  const removeSkill = (index) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="resume-editor">
      <Tabs defaultValue="personal" className="editor-tabs">
        <TabsList className="editor-tabs-list">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        {/* Personal Info */}
        <TabsContent value="personal" className="editor-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Full Name *</label>
              <Input
                value={resumeData.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="form-field">
              <label>Email *</label>
              <Input
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                placeholder="john@email.com"
              />
            </div>
            <div className="form-field">
              <label>Phone *</label>
              <Input
                value={resumeData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="form-field">
              <label>Location</label>
              <Input
                value={resumeData.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                placeholder="City, State"
              />
            </div>
            <div className="form-field">
              <label>LinkedIn</label>
              <Input
                value={resumeData.personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                placeholder="linkedin.com/in/username"
              />
            </div>
            <div className="form-field">
              <label>Portfolio</label>
              <Input
                value={resumeData.personalInfo.portfolio}
                onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                placeholder="yourwebsite.com"
              />
            </div>
          </div>
        </TabsContent>

        {/* Summary */}
        <TabsContent value="summary" className="editor-section">
          <h3 className="section-title">Professional Summary</h3>
          <div className="form-field">
            <label>Summary *</label>
            <Textarea
              value={resumeData.summary}
              onChange={(e) => updateSummary(e.target.value)}
              placeholder="Write a compelling 2-3 sentence summary highlighting your experience and key achievements..."
              rows={6}
              className="summary-textarea"
            />
            <p className="helper-text">Tip: Use action verbs and quantify your achievements</p>
          </div>
        </TabsContent>

        {/* Experience */}
        <TabsContent value="experience" className="editor-section">
          <div className="section-header">
            <h3 className="section-title">Work Experience</h3>
            <Button onClick={addExperience} size="sm">
              <Plus size={16} /> Add Experience
            </Button>
          </div>
          
          {resumeData.experience.map((exp, index) => (
            <Card key={exp.id} className="experience-card">
              <div className="card-header">
                <GripVertical size={20} className="drag-handle" />
                <span className="card-number">Experience {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                  className="remove-btn"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              
              <div className="form-grid">
                <div className="form-field">
                  <label>Job Title *</label>
                  <Input
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    placeholder="Senior Product Manager"
                  />
                </div>
                <div className="form-field">
                  <label>Company *</label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div className="form-field">
                  <label>Location</label>
                  <Input
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
                <div className="form-field">
                  <label>Start Date *</label>
                  <Input
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    placeholder="Jan 2021"
                  />
                </div>
                <div className="form-field">
                  <label>End Date</label>
                  <Input
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    placeholder="Present"
                    disabled={exp.current}
                  />
                </div>
              </div>
              
              <div className="bullets-section">
                <label>Key Achievements & Responsibilities</label>
                {exp.bullets.map((bullet, bIndex) => (
                  <div key={bIndex} className="bullet-input">
                    <Textarea
                      value={bullet}
                      onChange={(e) => updateBullet(exp.id, bIndex, e.target.value)}
                      placeholder="• Led product strategy that increased revenue by 40%..."
                      rows={2}
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addBullet(exp.id)}
                  className="add-bullet-btn"
                >
                  <Plus size={14} /> Add Bullet Point
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Education */}
        <TabsContent value="education" className="editor-section">
          <div className="section-header">
            <h3 className="section-title">Education</h3>
            <Button onClick={addEducation} size="sm">
              <Plus size={16} /> Add Education
            </Button>
          </div>
          
          {resumeData.education.map((edu, index) => (
            <Card key={edu.id} className="education-card">
              <div className="card-header">
                <span className="card-number">Education {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(edu.id)}
                  className="remove-btn"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              
              <div className="form-grid">
                <div className="form-field full-width">
                  <label>Degree *</label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor of Science in Computer Science"
                  />
                </div>
                <div className="form-field">
                  <label>School *</label>
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    placeholder="University Name"
                  />
                </div>
                <div className="form-field">
                  <label>Location</label>
                  <Input
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
                <div className="form-field">
                  <label>Graduation Date *</label>
                  <Input
                    value={edu.graduationDate}
                    onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                    placeholder="2021"
                  />
                </div>
                <div className="form-field">
                  <label>GPA (Optional)</label>
                  <Input
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="3.8"
                  />
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Skills */}
        <TabsContent value="skills" className="editor-section">
          <div className="section-header">
            <h3 className="section-title">Skills</h3>
            <Button onClick={addSkill} size="sm">
              <Plus size={16} /> Add Skill
            </Button>
          </div>
          
          <div className="skills-grid">
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <Input
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  placeholder="Skill name"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill(index)}
                  className="skill-remove"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeEditor;
