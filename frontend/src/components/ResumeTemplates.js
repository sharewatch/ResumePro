import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import './ResumeTemplates.css';

// Traditional Single Column Template
export const TraditionalTemplate = ({ resumeData, templateStyles }) => {
  const { personalInfo, summary, experience, education, skills, certifications, languages } = resumeData;
  
  return (
    <div className="template-traditional">
      <div className="header" style={{ borderBottomColor: templateStyles.accentColor }}>
        <div className="header-content-wrapper">
          <div className="header-text">
            <h1 className="name">{personalInfo.fullName}</h1>
            <div className="contact-row">
              {personalInfo.email && <span><Mail size={12} /> {personalInfo.email}</span>}
              {personalInfo.phone && <span><Phone size={12} /> {personalInfo.phone}</span>}
              {personalInfo.location && <span><MapPin size={12} /> {personalInfo.location}</span>}
            </div>
          </div>
          {personalInfo.photo && (
            <div className="header-photo">
              <img src={personalInfo.photo} alt={personalInfo.fullName} />
            </div>
          )}
        </div>
      </div>

      {summary && (
        <section className="section">
          <h2 style={{ color: templateStyles.accentColor }}>Professional Summary</h2>
          <p>{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="section">
          <h2 style={{ color: templateStyles.accentColor }}>Work Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="experience-item">
              <div className="exp-header">
                <div>
                  <h3>{exp.title}</h3>
                  <p className="company">{exp.company}</p>
                </div>
                <span className="dates">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <ul>
                {exp.bullets.map((bullet, idx) => bullet && <li key={idx}>{bullet}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="section">
          <h2 style={{ color: templateStyles.accentColor }}>Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="education-item">
              <h3>{edu.degree}</h3>
              <p>{edu.school} - {edu.graduationDate}</p>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="section">
          <h2 style={{ color: templateStyles.accentColor }}>Skills</h2>
          <div className="skills-list">
            {skills.map((skill, idx) => skill && <span key={idx} className="skill-tag" style={{ borderColor: templateStyles.accentColor }}>{skill}</span>)}
          </div>
        </section>
      )}
    </div>
  );
};

// Two-Column Sidebar Template
export const TwoColumnTemplate = ({ resumeData, templateStyles }) => {
  const { personalInfo, summary, experience, education, skills, certifications, languages } = resumeData;
  
  return (
    <div className="template-two-column">
      <aside className="sidebar" style={{ backgroundColor: `${templateStyles.accentColor}15` }}>
        {personalInfo.photo && (
          <div className="sidebar-photo">
            <img src={personalInfo.photo} alt={personalInfo.fullName} />
          </div>
        )}
        
        <div className="sidebar-section">
          <h2 style={{ color: templateStyles.accentColor }}>Contact</h2>
          <div className="contact-info">
            {personalInfo.email && <div><Mail size={14} /> <span>{personalInfo.email}</span></div>}
            {personalInfo.phone && <div><Phone size={14} /> <span>{personalInfo.phone}</span></div>}
            {personalInfo.location && <div><MapPin size={14} /> <span>{personalInfo.location}</span></div>}
            {personalInfo.linkedin && <div><Linkedin size={14} /> <span>{personalInfo.linkedin}</span></div>}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="sidebar-section">
            <h2 style={{ color: templateStyles.accentColor }}>Skills</h2>
            <div className="skills-sidebar">
              {skills.map((skill, idx) => skill && (
                <div key={idx} className="skill-item">
                  <span>{skill}</span>
                  <div className="skill-bar" style={{ backgroundColor: `${templateStyles.accentColor}30` }}>
                    <div className="skill-fill" style={{ backgroundColor: templateStyles.accentColor, width: '85%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div className="sidebar-section">
            <h2 style={{ color: templateStyles.accentColor }}>Languages</h2>
            {languages.map((lang) => (
              <div key={lang.id} className="language-item">
                <strong>{lang.language}</strong>
                <p>{lang.proficiency}</p>
              </div>
            ))}
          </div>
        )}
      </aside>

      <main className="main-content">
        <h1 className="name" style={{ color: templateStyles.accentColor }}>{personalInfo.fullName}</h1>
        
        {summary && (
          <section className="section">
            <h2 style={{ color: templateStyles.accentColor }}>Profile</h2>
            <p>{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="section">
            <h2 style={{ color: templateStyles.accentColor }}>Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="experience-item">
                <h3>{exp.title}</h3>
                <p className="company">{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                <ul>
                  {exp.bullets.map((bullet, idx) => bullet && <li key={idx}>{bullet}</li>)}
                </ul>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="section">
            <h2 style={{ color: templateStyles.accentColor }}>Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="education-item">
                <h3>{edu.degree}</h3>
                <p>{edu.school} - {edu.graduationDate}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

// Modern Creative Template
export const ModernCreativeTemplate = ({ resumeData, templateStyles }) => {
  const { personalInfo, summary, experience, education, skills } = resumeData;
  
  return (
    <div className="template-modern-creative">
      <div className="creative-header" style={{ background: `linear-gradient(135deg, ${templateStyles.accentColor}, ${templateStyles.accentColor}dd)` }}>
        <div className="header-content">
          {personalInfo.photo && (
            <div className="creative-photo">
              <img src={personalInfo.photo} alt={personalInfo.fullName} />
            </div>
          )}
          <div className="header-info">
            <h1>{personalInfo.fullName}</h1>
            <div className="contact-line">
              {personalInfo.email} • {personalInfo.phone} • {personalInfo.location}
            </div>
          </div>
        </div>
      </div>

      <div className="creative-body">
        {summary && (
          <section className="section">
            <div className="section-title" style={{ borderLeftColor: templateStyles.accentColor }}>
              <h2>About Me</h2>
            </div>
            <p>{summary}</p>
          </section>
        )}

        <div className="two-column-grid">
          <div className="left-col">
            {experience.length > 0 && (
              <section className="section">
                <div className="section-title" style={{ borderLeftColor: templateStyles.accentColor }}>
                  <h2>Experience</h2>
                </div>
                {experience.map((exp) => (
                  <div key={exp.id} className="experience-item">
                    <h3 style={{ color: templateStyles.accentColor }}>{exp.title}</h3>
                    <p className="company">{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                    <ul>
                      {exp.bullets.map((bullet, idx) => bullet && <li key={idx}>{bullet}</li>)}
                    </ul>
                  </div>
                ))}
              </section>
            )}
          </div>

          <div className="right-col">
            {education.length > 0 && (
              <section className="section">
                <div className="section-title" style={{ borderLeftColor: templateStyles.accentColor }}>
                  <h2>Education</h2>
                </div>
                {education.map((edu) => (
                  <div key={edu.id} className="education-item">
                    <h3>{edu.degree}</h3>
                    <p>{edu.school}</p>
                    <p>{edu.graduationDate}</p>
                  </div>
                ))}
              </section>
            )}

            {skills.length > 0 && (
              <section className="section">
                <div className="section-title" style={{ borderLeftColor: templateStyles.accentColor }}>
                  <h2>Skills</h2>
                </div>
                <div className="skills-grid">
                  {skills.map((skill, idx) => skill && (
                    <span key={idx} className="skill-badge" style={{ backgroundColor: `${templateStyles.accentColor}20`, color: templateStyles.accentColor }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Minimalist Template
export const MinimalistTemplate = ({ resumeData, templateStyles }) => {
  const { personalInfo, summary, experience, education, skills } = resumeData;
  
  return (
    <div className="template-minimalist">
      <header className="minimal-header">
        <div className="header-flex">
          <div>
            <h1 style={{ color: templateStyles.accentColor }}>{personalInfo.fullName}</h1>
            <div className="contact-minimal">
              {personalInfo.email} | {personalInfo.phone} | {personalInfo.location}
            </div>
          </div>
          {personalInfo.photo && (
            <div className="minimal-photo">
              <img src={personalInfo.photo} alt={personalInfo.fullName} />
            </div>
          )}
        </div>
      </header>

      {summary && (
        <section className="minimal-section">
          <p className="summary-text">{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="minimal-section">
          <h2 className="minimal-heading" style={{ borderBottomColor: templateStyles.accentColor }}>Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="minimal-item">
              <div className="item-header">
                <strong>{exp.title}</strong>
                <span className="dates-minimal">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <p className="company-minimal">{exp.company}</p>
              <ul className="minimal-list">
                {exp.bullets.map((bullet, idx) => bullet && <li key={idx}>{bullet}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="minimal-section">
          <h2 className="minimal-heading" style={{ borderBottomColor: templateStyles.accentColor }}>Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="minimal-item">
              <strong>{edu.degree}</strong>
              <p>{edu.school} - {edu.graduationDate}</p>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="minimal-section">
          <h2 className="minimal-heading" style={{ borderBottomColor: templateStyles.accentColor }}>Skills</h2>
          <p>{skills.filter(s => s).join(' • ')}</p>
        </section>
      )}
    </div>
  );
};

// Timeline Template (Enhancv-inspired)
export const TimelineTemplate = ({ resumeData, templateStyles }) => {
  const { personalInfo, summary, experience, education, skills } = resumeData;
  
  return (
    <div className="template-timeline">
      <div className="timeline-header" style={{ backgroundColor: templateStyles.accentColor }}>
        {personalInfo.photo && (
          <div className="timeline-photo">
            <img src={personalInfo.photo} alt={personalInfo.fullName} />
          </div>
        )}
        <h1>{personalInfo.fullName}</h1>
        <div className="contact-row">
          {personalInfo.email} • {personalInfo.phone} • {personalInfo.location}
        </div>
      </div>

      <div className="timeline-body">
        {summary && (
          <section className="timeline-section">
            <p className="summary-text">{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="timeline-section">
            <h2 style={{ color: templateStyles.accentColor }}>Career Journey</h2>
            <div className="timeline-container">
              {experience.map((exp, index) => (
                <div key={exp.id} className="timeline-item">
                  <div className="timeline-marker" style={{ backgroundColor: templateStyles.accentColor }}>
                    <div className="timeline-dot"></div>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-date" style={{ color: templateStyles.accentColor }}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </div>
                    <h3>{exp.title}</h3>
                    <p className="company">{exp.company}</p>
                    <ul>
                      {exp.bullets.map((bullet, idx) => bullet && <li key={idx}>{bullet}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="timeline-grid">
          {education.length > 0 && (
            <section className="timeline-section">
              <h2 style={{ color: templateStyles.accentColor }}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="edu-item">
                  <strong>{edu.degree}</strong>
                  <p>{edu.school} • {edu.graduationDate}</p>
                </div>
              ))}
            </section>
          )}

          {skills.length > 0 && (
            <section className="timeline-section">
              <h2 style={{ color: templateStyles.accentColor }}>Skills</h2>
              <div className="skills-tags">
                {skills.map((skill, idx) => skill && (
                  <span key={idx} className="skill-tag" style={{ borderColor: templateStyles.accentColor, color: templateStyles.accentColor }}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

// Infographic Template (Enhancv-inspired)
export const InfographicTemplate = ({ resumeData, templateStyles }) => {
  const { personalInfo, summary, experience, education, skills } = resumeData;
  
  return (
    <div className="template-infographic">
      <aside className="infographic-sidebar" style={{ backgroundColor: `${templateStyles.accentColor}15` }}>
        {personalInfo.photo && (
          <div className="infographic-photo">
            <img src={personalInfo.photo} alt={personalInfo.fullName} />
          </div>
        )}

        <h1 className="sidebar-name" style={{ color: templateStyles.accentColor }}>{personalInfo.fullName}</h1>
        
        <div className="contact-section">
          <h3 style={{ color: templateStyles.accentColor }}>Contact</h3>
          <div className="contact-item">
            <span>📧</span> {personalInfo.email}
          </div>
          <div className="contact-item">
            <span>📱</span> {personalInfo.phone}
          </div>
          <div className="contact-item">
            <span>📍</span> {personalInfo.location}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="skills-visual">
            <h3 style={{ color: templateStyles.accentColor }}>Skills</h3>
            {skills.slice(0, 8).map((skill, idx) => skill && (
              <div key={idx} className="skill-bar-item">
                <span className="skill-name">{skill}</span>
                <div className="skill-bar-bg">
                  <div 
                    className="skill-bar-fill" 
                    style={{ 
                      backgroundColor: templateStyles.accentColor,
                      width: `${90 - (idx * 5)}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>

      <main className="infographic-main">
        {summary && (
          <section className="infographic-section">
            <h2 className="section-title" style={{ borderLeftColor: templateStyles.accentColor }}>About Me</h2>
            <p>{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="infographic-section">
            <h2 className="section-title" style={{ borderLeftColor: templateStyles.accentColor }}>Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="experience-block">
                <div className="exp-header-infographic">
                  <div>
                    <h3 style={{ color: templateStyles.accentColor }}>{exp.title}</h3>
                    <p className="company">{exp.company}</p>
                  </div>
                  <span className="date-badge" style={{ backgroundColor: `${templateStyles.accentColor}20`, color: templateStyles.accentColor }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul>
                  {exp.bullets.map((bullet, idx) => bullet && <li key={idx}>{bullet}</li>)}
                </ul>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="infographic-section">
            <h2 className="section-title" style={{ borderLeftColor: templateStyles.accentColor }}>Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="education-block">
                <h3>{edu.degree}</h3>
                <p>{edu.school} • {edu.graduationDate}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

// Bold Visual Template
export const BoldVisualTemplate = ({ resumeData, templateStyles }) => {
  const { personalInfo, summary, experience, education, skills } = resumeData;
  
  return (
    <div className="template-bold-visual">
      <div className="bold-sidebar">
        <div className="bold-header" style={{ backgroundColor: templateStyles.accentColor }}>
          {personalInfo.photo && (
            <div className="bold-photo">
              <img src={personalInfo.photo} alt={personalInfo.fullName} />
            </div>
          )}
          <h1>{personalInfo.fullName}</h1>
        </div>

        <div className="bold-contact">
          {personalInfo.email && <div>✉️ {personalInfo.email}</div>}
          {personalInfo.phone && <div>📞 {personalInfo.phone}</div>}
          {personalInfo.location && <div>📍 {personalInfo.location}</div>}
        </div>

        {skills.length > 0 && (
          <div className="bold-skills">
            <h3 style={{ color: templateStyles.accentColor }}>EXPERTISE</h3>
            <div className="skills-badges">
              {skills.map((skill, idx) => skill && (
                <span key={idx} className="skill-badge" style={{ backgroundColor: templateStyles.accentColor }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <main className="bold-main">
        {summary && (
          <section className="bold-section">
            <div className="section-header-bold" style={{ backgroundColor: `${templateStyles.accentColor}15` }}>
              <h2 style={{ color: templateStyles.accentColor }}>PROFILE</h2>
            </div>
            <p className="summary-text">{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="bold-section">
            <div className="section-header-bold" style={{ backgroundColor: `${templateStyles.accentColor}15` }}>
              <h2 style={{ color: templateStyles.accentColor }}>EXPERIENCE</h2>
            </div>
            {experience.map((exp) => (
              <div key={exp.id} className="bold-experience">
                <div className="exp-title-row">
                  <h3>{exp.title}</h3>
                  <span className="dates">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="company-bold" style={{ color: templateStyles.accentColor }}>{exp.company}</p>
                <ul>
                  {exp.bullets.map((bullet, idx) => bullet && <li key={idx}>{bullet}</li>)}
                </ul>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="bold-section">
            <div className="section-header-bold" style={{ backgroundColor: `${templateStyles.accentColor}15` }}>
              <h2 style={{ color: templateStyles.accentColor }}>EDUCATION</h2>
            </div>
            {education.map((edu) => (
              <div key={edu.id} className="bold-edu">
                <h3>{edu.degree}</h3>
                <p>{edu.school} • {edu.graduationDate}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};
