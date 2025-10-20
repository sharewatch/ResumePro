import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, Trash2, GripVertical, Sparkles } from 'lucide-react';
import TemplateSelector from './TemplateSelector';
import './ResumeEditor.css';

const ResumeEditor = ({ resumeData, setResumeData, selectedTemplate, setSelectedTemplate, onOpenSkillsImport }) => {
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

  const addCertification = () => {
    const newCert = {
      id: `cert${Date.now()}`,
      name: '',
      issuer: '',
      date: ''
    };
    setResumeData({ 
      ...resumeData, 
      certifications: [...(resumeData.certifications || []), newCert] 
    });
  };

  const updateCertification = (id, field, value) => {
    setResumeData({
      ...resumeData,
      certifications: (resumeData.certifications || []).map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    });
  };

  const removeCertification = (id) => {
    setResumeData({
      ...resumeData,
      certifications: (resumeData.certifications || []).filter(cert => cert.id !== id)
    });
  };

  const addLanguage = () => {
    const newLang = {
      id: `lang${Date.now()}`,
      language: '',
      proficiency: ''
    };
    setResumeData({ 
      ...resumeData, 
      languages: [...(resumeData.languages || []), newLang] 
    });
  };

  const updateLanguage = (id, field, value) => {
    setResumeData({
      ...resumeData,
      languages: (resumeData.languages || []).map(lang =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    });
  };

  const removeLanguage = (id) => {
    setResumeData({
      ...resumeData,
      languages: (resumeData.languages || []).filter(lang => lang.id !== id)
    });
  };

  return (
    <div className="resume-editor">
      <Tabs defaultValue="template" className="editor-tabs">
        <TabsList className="editor-tabs-list">
          <TabsTrigger value="template">Template</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="extra">More</TabsTrigger>
        </TabsList>

        {/* Template Selection */}
        <TabsContent value="template" className="editor-section">
          <TemplateSelector 
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
          />
        </TabsContent>

        {/* Personal Info */}
        <TabsContent value="personal" className="editor-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="form-grid">
            <div className="form-field full-width">
              <label>Profile Photo (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      updatePersonalInfo('photo', reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {resumeData.personalInfo.photo && (
                <div className="photo-preview">
                  <img src={resumeData.personalInfo.photo} alt="Profile" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updatePersonalInfo('photo', '')}
                    className="remove-photo-btn"
                  >
                    Remove Photo
                  </Button>
                </div>
              )}
            </div>
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
                placeholder="City, Country"
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
                    placeholder="City, Country"
                  />
                </div>
                <div className="form-field">
                  <label>Start Date * (DD-MM-YYYY)</label>
                  <Input
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    placeholder="01-01-2021"
                  />
                </div>
                <div className="form-field">
                  <label>End Date (DD-MM-YYYY)</label>
                  <Input
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    placeholder="Present or 31-12-2023"
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
                  <label>School Level/University Degree *</label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor of Science in Computer Science"
                  />
                </div>
                <div className="form-field">
                  <label>School/University *</label>
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
                    placeholder="City, Country"
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
            <div className="skills-actions">
              {onOpenSkillsImport && (
                <Button onClick={onOpenSkillsImport} size="sm" variant="outline">
                  <Sparkles size={16} /> Bulk Import
                </Button>
              )}
              <Button onClick={addSkill} size="sm">
                <Plus size={16} /> Add Skill
              </Button>
            </div>
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

        {/* Additional Sections */}
        <TabsContent value="extra" className="editor-section">
          <h3 className="section-title">Additional Information</h3>
          
          {/* Certifications */}
          <div className="subsection">
            <div className="section-header">
              <h4 className="subsection-title">Certifications</h4>
              <Button onClick={addCertification} size="sm" variant="outline">
                <Plus size={16} /> Add Certification
              </Button>
            </div>
            
            {(resumeData.certifications || []).map((cert) => (
              <Card key={cert.id} className="extra-card">
                <div className="card-header">
                  <span className="card-number">Certification</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCertification(cert.id)}
                    className="remove-btn"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                
                <div className="form-grid">
                  <div className="form-field full-width">
                    <label>Certification Name *</label>
                    <Input
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                      placeholder="Certified Scrum Product Owner"
                    />
                  </div>
                  <div className="form-field">
                    <label>Issuing Organization *</label>
                    <Input
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                      placeholder="Scrum Alliance"
                    />
                  </div>
                  <div className="form-field">
                    <label>Date Obtained</label>
                    <Input
                      value={cert.date}
                      onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                      placeholder="2020"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Languages */}
          <div className="subsection">
            <div className="section-header">
              <h4 className="subsection-title">Languages</h4>
              <Button onClick={addLanguage} size="sm" variant="outline">
                <Plus size={16} /> Add Language
              </Button>
            </div>
            
            {(resumeData.languages || []).map((lang) => (
              <Card key={lang.id} className="extra-card">
                <div className="card-header">
                  <span className="card-number">Language</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLanguage(lang.id)}
                    className="remove-btn"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                
                <div className="form-grid">
                  <div className="form-field">
                    <label>Language *</label>
                    <Input
                      value={lang.language}
                      onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                      placeholder="Spanish"
                    />
                  </div>
                  <div className="form-field">
                    <label>Proficiency Level *</label>
                    <Input
                      value={lang.proficiency}
                      onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                      placeholder="Native, Fluent, Professional, Basic"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeEditor;
