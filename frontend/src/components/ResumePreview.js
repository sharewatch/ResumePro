import React from 'react';
import { Card } from './ui/card';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import './ResumePreview.css';

const ResumePreview = ({ resumeData, template }) => {
  const { personalInfo, summary, experience, education, skills } = resumeData;

  return (
    <div className="resume-preview">
      <div className={`resume-template resume-${template}`}>
        {/* Header */}
        <div className="resume-header">
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

        {/* Summary */}
        {summary && (
          <div className="resume-section">
            <h2 className="section-heading">Professional Summary</h2>
            <p className="summary-text">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="resume-section">
            <h2 className="section-heading">Work Experience</h2>
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
            <h2 className="section-heading">Education</h2>
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
            <h2 className="section-heading">Skills</h2>
            <div className="skills-list">
              {skills.map((skill, idx) => (
                skill && (
                  <span key={idx} className="skill-tag">
                    {skill}
                  </span>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
