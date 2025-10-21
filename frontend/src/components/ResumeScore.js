import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { TrendingUp, Award, AlertCircle, CheckCircle2, Target, Lightbulb, Loader2 } from 'lucide-react';
import axios from 'axios';
import './ResumeScore.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ResumeScore = ({ resumeData }) => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateScore();
  }, [resumeData]);

  const calculateScore = async () => {
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/resume/analyze-score`, {
        resumeData
      });
      setScore(response.data);
    } catch (error) {
      console.error('Score calculation failed:', error);
      // Fallback to local calculation
      setScore(calculateLocalScore());
    } finally {
      setLoading(false);
    }
  };

  const calculateLocalScore = () => {
    let totalScore = 0;
    const sections = {};

    // Personal Info Score (20 points)
    let personalScore = 0;
    if (resumeData.personalInfo.fullName) personalScore += 5;
    if (resumeData.personalInfo.email) personalScore += 5;
    if (resumeData.personalInfo.phone) personalScore += 5;
    if (resumeData.personalInfo.location) personalScore += 2;
    if (resumeData.personalInfo.linkedin || resumeData.personalInfo.portfolio) personalScore += 3;
    sections.personalInfo = { score: personalScore, max: 20 };
    totalScore += personalScore;

    // Summary Score (15 points)
    let summaryScore = 0;
    if (resumeData.summary) {
      if (resumeData.summary.length > 50) summaryScore += 5;
      if (resumeData.summary.length > 100) summaryScore += 5;
      if (resumeData.summary.length > 150) summaryScore += 5;
    }
    sections.summary = { score: summaryScore, max: 15 };
    totalScore += summaryScore;

    // Experience Score (30 points)
    let experienceScore = 0;
    if (resumeData.experience.length > 0) experienceScore += 10;
    if (resumeData.experience.length > 1) experienceScore += 5;
    resumeData.experience.forEach(exp => {
      if (exp.bullets.length >= 3) experienceScore += 3;
      if (exp.bullets.some(b => /\d+/.test(b))) experienceScore += 2; // Has numbers
    });
    sections.experience = { score: Math.min(experienceScore, 30), max: 30 };
    totalScore += Math.min(experienceScore, 30);

    // Education Score (15 points)
    let educationScore = 0;
    if (resumeData.education.length > 0) educationScore += 10;
    if (resumeData.education.length > 1) educationScore += 5;
    sections.education = { score: educationScore, max: 15 };
    totalScore += educationScore;

    // Skills Score (15 points)
    let skillsScore = 0;
    if (resumeData.skills.length >= 5) skillsScore += 5;
    if (resumeData.skills.length >= 10) skillsScore += 5;
    if (resumeData.skills.length >= 15) skillsScore += 5;
    sections.skills = { score: skillsScore, max: 15 };
    totalScore += skillsScore;

    // Additional Sections (5 points)
    let additionalScore = 0;
    if (resumeData.certifications?.length > 0) additionalScore += 2.5;
    if (resumeData.languages?.length > 0) additionalScore += 2.5;
    sections.additional = { score: additionalScore, max: 5 };
    totalScore += additionalScore;

    // Calculate analytics
    const analytics = calculateAnalytics(resumeData);

    return {
      overall: Math.round(totalScore),
      sections,
      suggestions: generateSuggestions(sections, resumeData, analytics),
      analytics
    };
  };

  const calculateAnalytics = (data) => {
    // Keywords Analysis
    const keywords = extractKeywords(data);
    
    // Length Analysis
    const wordCount = calculateWordCount(data);
    
    // Formatting Analysis
    const formatting = analyzeFormatting(data);
    
    // ATS Compatibility
    const atsScore = calculateATSScore(data, keywords, formatting);
    
    return {
      keywords,
      wordCount,
      formatting,
      atsScore
    };
  };

  const extractKeywords = (data) => {
    const text = [
      data.summary || '',
      ...data.experience.flatMap(exp => exp.bullets || []),
      ...data.skills
    ].join(' ').toLowerCase();

    // Action verbs
    const actionVerbs = ['led', 'managed', 'developed', 'created', 'designed', 'implemented', 
      'improved', 'increased', 'launched', 'achieved', 'delivered', 'built', 'established',
      'coordinated', 'optimized', 'streamlined', 'collaborated', 'analyzed', 'spearheaded'];
    
    const foundActionVerbs = actionVerbs.filter(verb => text.includes(verb));

    // Technical skills (common keywords)
    const technicalKeywords = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'aws',
      'docker', 'kubernetes', 'api', 'agile', 'scrum', 'git', 'ci/cd', 'typescript', 'mongodb'];
    
    const foundTechnical = technicalKeywords.filter(keyword => text.includes(keyword));

    // Metrics/Numbers
    const metricsCount = (text.match(/\d+%|\$\d+|\d+\+/g) || []).length;

    return {
      actionVerbs: foundActionVerbs,
      actionVerbsCount: foundActionVerbs.length,
      technicalKeywords: foundTechnical,
      technicalCount: foundTechnical.length,
      metricsCount,
      totalKeywords: data.skills.length
    };
  };

  const calculateWordCount = (data) => {
    let total = 0;
    
    if (data.summary) total += data.summary.split(/\s+/).length;
    data.experience.forEach(exp => {
      exp.bullets.forEach(bullet => {
        if (bullet) total += bullet.split(/\s+/).length;
      });
    });

    const optimal = { min: 400, max: 600 };
    const status = total < optimal.min ? 'short' : total > optimal.max ? 'long' : 'optimal';

    return {
      total,
      optimal,
      status
    };
  };

  const analyzeFormatting = (data) => {
    const checks = {
      hasActionVerbs: false,
      hasMetrics: false,
      hasConsistentDates: true,
      bulletPointsOptimal: true,
      noPronouns: true
    };

    // Check for action verbs
    const expText = data.experience.flatMap(exp => exp.bullets || []).join(' ').toLowerCase();
    const actionVerbs = ['led', 'managed', 'developed', 'created', 'designed', 'implemented'];
    checks.hasActionVerbs = actionVerbs.some(verb => expText.includes(verb));

    // Check for metrics
    checks.hasMetrics = /\d+%|\$\d+|\d+\+/.test(expText);

    // Check bullet points
    data.experience.forEach(exp => {
      if (exp.bullets.length < 2 || exp.bullets.length > 6) {
        checks.bulletPointsOptimal = false;
      }
    });

    // Check for pronouns (I, me, my, we)
    checks.noPronouns = !/\b(i|me|my|we|our)\b/i.test(data.summary + ' ' + expText);

    const passedChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;

    return {
      checks,
      score: Math.round((passedChecks / totalChecks) * 100)
    };
  };

  const calculateATSScore = (data, keywords, formatting) => {
    let score = 0;

    // Keywords presence (40 points)
    if (keywords.actionVerbsCount >= 10) score += 20;
    else if (keywords.actionVerbsCount >= 5) score += 10;
    
    if (keywords.totalKeywords >= 15) score += 20;
    else if (keywords.totalKeywords >= 10) score += 10;

    // Metrics presence (20 points)
    if (keywords.metricsCount >= 5) score += 20;
    else if (keywords.metricsCount >= 3) score += 10;

    // Formatting (20 points)
    if (formatting.checks.hasActionVerbs) score += 5;
    if (formatting.checks.hasMetrics) score += 5;
    if (formatting.checks.hasConsistentDates) score += 5;
    if (formatting.checks.noPronouns) score += 5;

    // Section completeness (20 points)
    if (data.personalInfo.email && data.personalInfo.phone) score += 5;
    if (data.summary && data.summary.length > 100) score += 5;
    if (data.experience.length >= 2) score += 5;
    if (data.skills.length >= 10) score += 5;

    return Math.min(score, 100);
  };

  const generateSuggestions = (sections, data) => {
    const suggestions = [];

    if (sections.personalInfo.score < 15) {
      suggestions.push({
        type: 'warning',
        message: 'Add missing contact information (LinkedIn, portfolio)'
      });
    }

    if (sections.summary.score < 10) {
      suggestions.push({
        type: 'critical',
        message: 'Write a compelling professional summary (150+ words recommended)'
      });
    }

    if (sections.experience.score < 20) {
      suggestions.push({
        type: 'critical',
        message: 'Add more work experience with quantified achievements'
      });
    }

    if (sections.skills.score < 10) {
      suggestions.push({
        type: 'warning',
        message: 'Add more skills (aim for 10-15 relevant skills)'
      });
    }

    if (!data.certifications || data.certifications.length === 0) {
      suggestions.push({
        type: 'info',
        message: 'Consider adding relevant certifications to stand out'
      });
    }

    return suggestions;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  };

  if (loading) {
    return (
      <div className="score-loading">
        <Loader2 size={48} className="spinning" />
        <p>Analysing your resume...</p>
      </div>
    );
  }

  if (!score) return null;

  return (
    <div className="resume-score">
      <div className="score-header">
        <Award size={28} className="score-icon" />
        <div>
          <h2>Resume Score & Analytics</h2>
          <p>Comprehensive analysis of your resume quality</p>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="overall-score-card">
        <div className="overall-score">
          <div className="score-circle" style={{ borderColor: getScoreColor(score.overall) }}>
            <div className="score-number" style={{ color: getScoreColor(score.overall) }}>
              {score.overall}
            </div>
            <div className="score-label">{getScoreLabel(score.overall)}</div>
          </div>
          <div className="score-info">
            <h3>Overall Resume Score</h3>
            <p>Your resume scores {score.overall} out of 100 points</p>
            <Progress 
              value={score.overall} 
              className="score-progress"
              style={{ '--progress-color': getScoreColor(score.overall) }}
            />
          </div>
        </div>
      </Card>

      {/* Section Breakdown */}
      <Card className="sections-breakdown">
        <h3>Section Breakdown</h3>
        <div className="sections-grid">
          {Object.entries(score.sections).map(([key, data]) => (
            <div key={key} className="section-item">
              <div className="section-header">
                <span className="section-name">{formatSectionName(key)}</span>
                <span className="section-score">{data.score}/{data.max}</span>
              </div>
              <Progress 
                value={(data.score / data.max) * 100} 
                className="section-progress"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Suggestions */}
      {score.suggestions && score.suggestions.length > 0 && (
        <Card className="suggestions-card">
          <h3>
            <Lightbulb size={20} />
            Improvement Suggestions
          </h3>
          <div className="suggestions-list">
            {score.suggestions.map((suggestion, idx) => (
              <div key={idx} className={`suggestion-item ${suggestion.type}`}>
                {suggestion.type === 'critical' && <AlertCircle size={20} />}
                {suggestion.type === 'warning' && <Target size={20} />}
                {suggestion.type === 'info' && <CheckCircle2 size={20} />}
                <span>{suggestion.message}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="quick-stats">
        <Card className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
            <TrendingUp size={24} style={{ color: '#1e40af' }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{resumeData.experience.length}</div>
            <div className="stat-label">Work Experiences</div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7' }}>
            <Target size={24} style={{ color: '#16a34a' }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{resumeData.skills.length}</div>
            <div className="stat-label">Skills Listed</div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <Award size={24} style={{ color: '#ca8a04' }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{resumeData.certifications?.length || 0}</div>
            <div className="stat-label">Certifications</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const formatSectionName = (key) => {
  const names = {
    personalInfo: 'Contact Info',
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    additional: 'Additional'
  };
  return names[key] || key;
};

export default ResumeScore;
