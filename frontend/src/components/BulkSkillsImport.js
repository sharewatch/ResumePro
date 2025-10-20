import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Plus, Sparkles, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import './BulkSkillsImport.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BulkSkillsImport = ({ currentSkills, onSkillsImport, onClose }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [extracting, setExtracting] = useState(false);
  const [imported, setImported] = useState(false);

  const handleExtract = async () => {
    if (!jobDescription.trim()) {
      alert('Please paste a job description');
      return;
    }

    setExtracting(true);

    try {
      const response = await axios.post(`${API}/skills/extract`, {
        text: jobDescription,
        existingSkills: currentSkills
      });

      const skills = response.data.skills || [];
      setExtractedSkills(skills);
      // Auto-select new skills (not already in resume)
      setSelectedSkills(skills.filter(s => !currentSkills.includes(s.name)));
    } catch (error) {
      console.error('Extraction failed:', error);
      // Fallback to local extraction
      const localSkills = extractSkillsLocally(jobDescription);
      setExtractedSkills(localSkills);
      setSelectedSkills(localSkills.filter(s => !currentSkills.includes(s.name)));
    } finally {
      setExtracting(false);
    }
  };

  const extractSkillsLocally = (text) => {
    // Common technical and professional skills
    const skillKeywords = [
      'JavaScript', 'Python', 'Java', 'C++', 'React', 'Angular', 'Vue',
      'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'HTML', 'CSS',
      'TypeScript', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'CI/CD',
      'Agile', 'Scrum', 'Jira', 'REST API', 'GraphQL', 'Microservices',
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
      'Data Analysis', 'Excel', 'Power BI', 'Tableau', 'R',
      'Product Management', 'Project Management', 'Leadership',
      'Communication', 'Problem Solving', 'Team Collaboration',
      'UX/UI Design', 'Figma', 'Sketch', 'Adobe Creative Suite',
      'SEO', 'Marketing', 'Content Strategy', 'Social Media',
      'Sales', 'Customer Service', 'Negotiation', 'Presentation Skills'
    ];

    const found = [];
    const textLower = text.toLowerCase();

    skillKeywords.forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) {
        const alreadyHave = currentSkills.some(s => 
          s.toLowerCase() === skill.toLowerCase()
        );
        found.push({
          name: skill,
          category: categorizeSkill(skill),
          alreadyAdded: alreadyHave
        });
      }
    });

    return found;
  };

  const categorizeSkill = (skill) => {
    const categories = {
      'Programming': ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript'],
      'Frameworks': ['React', 'Angular', 'Vue', 'Node.js', 'Django', 'Flask'],
      'Databases': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
      'Cloud': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes'],
      'Tools': ['Git', 'Jira', 'Figma', 'Sketch'],
      'Soft Skills': ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration'],
      'Other': []
    };

    for (const [category, skills] of Object.entries(categories)) {
      if (skills.includes(skill)) return category;
    }
    return 'Other';
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => {
      const exists = prev.some(s => s.name === skill.name);
      if (exists) {
        return prev.filter(s => s.name !== skill.name);
      } else {
        return [...prev, skill];
      }
    });
  };

  const handleImport = () => {
    const newSkills = selectedSkills.map(s => s.name);
    onSkillsImport(newSkills);
    setImported(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="bulk-skills-import">
      <Card className="import-card">
        <div className="import-header">
          <div className="header-left">
            <Plus size={32} className="import-icon" />
            <div>
              <h2>Bulk Skills Import</h2>
              <p>Extract relevant skills from job descriptions</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {!imported ? (
          <>
            <div className="jd-input-section">
              <label>Paste Job Description</label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here to extract required skills..."
                rows={8}
                disabled={extracting}
              />
              <Button
                onClick={handleExtract}
                disabled={extracting || !jobDescription.trim()}
                className="extract-btn"
              >
                {extracting ? (
                  <>
                    <Sparkles size={16} className="spinning" />
                    Extracting Skills...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Extract Skills
                  </>
                )}
              </Button>
            </div>

            {extractedSkills.length > 0 && (
              <div className="extracted-skills-section">
                <div className="section-header">
                  <h3>Found {extractedSkills.length} Skills</h3>
                  <p>Select skills to add to your resume</p>
                </div>

                <div className="skills-by-category">
                  {['Programming', 'Frameworks', 'Databases', 'Cloud', 'Tools', 'Soft Skills', 'Other'].map(category => {
                    const categorySkills = extractedSkills.filter(s => s.category === category);
                    if (categorySkills.length === 0) return null;

                    return (
                      <div key={category} className="category-group">
                        <h4 className="category-title">{category}</h4>
                        <div className="skills-grid">
                          {categorySkills.map(skill => (
                            <div 
                              key={skill.name} 
                              className={`skill-checkbox-item ${skill.alreadyAdded ? 'already-added' : ''}`}
                              onClick={() => !skill.alreadyAdded && toggleSkill(skill)}
                            >
                              <Checkbox
                                checked={selectedSkills.some(s => s.name === skill.name) || skill.alreadyAdded}
                                disabled={skill.alreadyAdded}
                              />
                              <span>{skill.name}</span>
                              {skill.alreadyAdded && (
                                <Badge variant="secondary" className="added-badge">Added</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="import-actions">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleImport}
                    disabled={selectedSkills.length === 0}
                    className="import-btn"
                  >
                    <Plus size={16} />
                    Add {selectedSkills.length} Skill{selectedSkills.length !== 1 ? 's' : ''}
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="success-message">
            <CheckCircle size={64} className="success-icon" />
            <h3>Skills Imported Successfully!</h3>
            <p>{selectedSkills.length} skill{selectedSkills.length !== 1 ? 's have' : ' has'} been added to your resume</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BulkSkillsImport;
