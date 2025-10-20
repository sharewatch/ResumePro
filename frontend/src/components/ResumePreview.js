import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { TraditionalTemplate, TwoColumnTemplate, ModernCreativeTemplate, MinimalistTemplate } from './ResumeTemplates';
import './ResumePreview.css';

const ResumePreview = ({ resumeData, template, customColor, onColorChange }) => {
  const { personalInfo, summary, experience, education, skills, certifications, languages } = resumeData;

  // Template-specific styling
  const getTemplateStyles = () => {
    const baseColor = customColor || getDefaultColor(template);
    return {
      headerBorder: baseColor,
      accentColor: baseColor
    };
  };

  const getDefaultColor = (templateId) => {
    const colors = {
      professional: '#0f172a',
      modern: '#1e40af',
      minimal: '#64748b',
      creative: '#7c3aed',
      tech: '#059669',
      elegant: '#991b1b',
      healthcare: '#0284c7',
      academic: '#4f46e5',
      marketing: '#dc2626',
      finance: '#15803d',
      startup: '#ea580c',
      executive: '#1e293b',
      'two-column-sidebar': '#2563eb',
      'modern-creative': '#8b5cf6',
      'minimalist': '#6b7280',
      'traditional': '#0f172a'
    };
    return colors[templateId] || '#0f172a';
  };

  const templateStyles = getTemplateStyles();

  // Render specific template layout
  const renderTemplate = () => {
    // Two-column layouts
    if (template.includes('two-column') || template === 'sidebar') {
      return <TwoColumnTemplate resumeData={resumeData} templateStyles={templateStyles} />;
    }
    
    // Modern creative layouts
    if (template.includes('creative') || template === 'modern-creative') {
      return <ModernCreativeTemplate resumeData={resumeData} templateStyles={templateStyles} />;
    }
    
    // Minimalist layouts
    if (template.includes('minimal')) {
      return <MinimalistTemplate resumeData={resumeData} templateStyles={templateStyles} />;
    }
    
    // Default to traditional single-column layout
    return <TraditionalTemplate resumeData={resumeData} templateStyles={templateStyles} />;
  };

  return (
    <div className="resume-preview">
      {/* Color Customizer */}
      <div className="color-customizer">
        <label>Accent Colour:</label>
        <div className="color-options">
          {['#0f172a', '#1e40af', '#7c3aed', '#059669', '#dc2626', '#ea580c', '#0284c7', '#991b1b', '#6b7280'].map(color => (
            <button
              key={color}
              className={`color-btn ${customColor === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
              title={color}
            />
          ))}
          <input
            type="color"
            value={customColor || getDefaultColor(template)}
            onChange={(e) => onColorChange(e.target.value)}
            className="color-picker"
            title="Custom colour"
          />
        </div>
      </div>

      <div className="preview-container">
        {renderTemplate()}
      </div>
    </div>
  );
};

export default ResumePreview;

  return (
    <div className="resume-preview">
      <div className={`resume-template resume-${template}`}>
        {/* Header */}
        <div className="resume-header" style={{ borderBottomColor: templateStyles.headerBorder }}>
          <div className="header-content-wrapper">
            <div className="header-text">
              <h1 className="resume-name">{personalInfo.fullName}</h1>
              <div className="contact-info">
                {personalInfo.email && (
                  <div className="contact-item">
                    <Mail size={14} />
                    <span>{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="contact-item">
                    <Phone size={14} />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="contact-item">
                    <MapPin size={14} />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="contact-item">
                    <Linkedin size={14} />
                    <span>{personalInfo.linkedin}</span>
                  </div>
                )}
                {personalInfo.portfolio && (
                  <div className="contact-item">
                    <Globe size={14} />
                    <span>{personalInfo.portfolio}</span>
                  </div>
                )}
              </div>
            </div>
            {personalInfo.photo && (
              <div className="header-photo">
                <img src={personalInfo.photo} alt={personalInfo.fullName} />
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="resume-section">
            <h2 className="section-heading" style={{ color: templateStyles.accentColor }}>Professional Summary</h2>
            <p className="summary-text">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="resume-section">
            <h2 className="section-heading" style={{ color: templateStyles.accentColor }}>Work Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="experience-item">
                <div className="exp-header">
                  <div className="exp-title-company">
                    <h3 className="exp-title">{exp.title}</h3>
                    <span className="exp-company">{exp.company}</span>
                  </div>
                  <div className="exp-dates">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                {exp.location && <p className="exp-location">{exp.location}</p>}
                <ul className="exp-bullets">
                  {exp.bullets.map((bullet, idx) => (
                    bullet && <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="resume-section">
            <h2 className="section-heading" style={{ color: templateStyles.accentColor }}>Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="education-item">
                <div className="edu-header">
                  <div>
                    <h3 className="edu-degree">{edu.degree}</h3>
                    <p className="edu-school">{edu.school}</p>
                  </div>
                  <div className="edu-date">{edu.graduationDate}</div>
                </div>
                {edu.gpa && <p className="edu-gpa">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="resume-section">
            <h2 className="section-heading" style={{ color: templateStyles.accentColor }}>Skills</h2>
            <div className="skills-list">
              {skills.map((skill, idx) => (
                skill && (
                  <span key={idx} className="skill-tag" style={{ borderColor: templateStyles.accentColor }}>
                    {skill}
                  </span>
                )
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div className="resume-section">
            <h2 className="section-heading" style={{ color: templateStyles.accentColor }}>Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="certification-item">
                <h3 className="cert-name">{cert.name}</h3>
                <p className="cert-details">
                  {cert.issuer}{cert.date && ` • ${cert.date}`}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="resume-section">
            <h2 className="section-heading" style={{ color: templateStyles.accentColor }}>Languages</h2>
            <div className="languages-list">
              {languages.map((lang) => (
                <div key={lang.id} className="language-item">
                  <span className="lang-name">{lang.language}</span>
                  <span className="lang-proficiency">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
