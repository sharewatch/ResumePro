import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { X, Target, TrendingUp, AlertCircle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { mockATSAnalysis, mockJobDescription } from '../mock';
import './AIAssistant.css';

const AIAssistant = ({ resumeData, onClose }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Mock API call
    setTimeout(() => {
      setAnalysis(mockATSAnalysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const loadSampleJD = () => {
    setJobDescription(mockJobDescription);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreStatus = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  return (
    <div className="ai-assistant">
      {/* Header */}
      <div className="ai-header">
        <div className="ai-title-section">
          <Target className="ai-icon" size={24} />
          <div>
            <h2 className="ai-title">AI Assistant</h2>
            <p className="ai-subtitle">Optimize for ATS & Impact</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      {/* Content */}
      <div className="ai-content">
        <Tabs defaultValue="ats" className="ai-tabs">
          <TabsList className="ai-tabs-list">
            <TabsTrigger value="ats">ATS Score</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
          </TabsList>

          {/* ATS Optimization Tab */}
          <TabsContent value="ats" className="ai-tab-content">
            {/* Job Description Input */}
            <div className="jd-section">
              <label className="jd-label">Paste Job Description</label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description you're applying for..."
                rows={6}
                className="jd-textarea"
              />
              <div className="jd-actions">
                <Button
                  onClick={handleAnalyze}
                  disabled={!jobDescription || isAnalyzing}
                  className="analyze-btn"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Match'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadSampleJD}
                >
                  Load Sample
                </Button>
              </div>
            </div>

            {/* ATS Score Display */}
            {analysis && (
              <div className="analysis-results">
                {/* Score Card */}
                <Card className="score-card">
                  <div className="score-header">
                    <span className="score-label">ATS Readiness Score</span>
                    <Badge 
                      style={{ 
                        background: getScoreColor(analysis.score),
                        color: 'white'
                      }}
                    >
                      {getScoreStatus(analysis.score)}
                    </Badge>
                  </div>
                  <div className="score-display">
                    <div className="score-number" style={{ color: getScoreColor(analysis.score) }}>
                      {analysis.score}%
                    </div>
                    <Progress 
                      value={analysis.score} 
                      className="score-progress"
                      style={{ '--progress-color': getScoreColor(analysis.score) }}
                    />
                  </div>
                </Card>

                {/* Keywords Section */}
                <div className="keywords-section">
                  <h4 className="subsection-title">
                    <CheckCircle2 size={18} /> Matched Keywords
                  </h4>
                  <div className="keyword-tags">
                    {analysis.keywordAnalysis.matched.map((keyword, idx) => (
                      <Badge key={idx} variant="secondary" className="keyword-badge matched">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="keywords-section">
                  <h4 className="subsection-title">
                    <AlertCircle size={18} /> Missing Keywords
                  </h4>
                  <div className="keyword-tags">
                    {analysis.keywordAnalysis.missing.map((keyword, idx) => (
                      <Badge key={idx} variant="destructive" className="keyword-badge missing">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="suggestions-section">
                  <h4 className="subsection-title">
                    <Lightbulb size={18} /> Recommendations
                  </h4>
                  <ul className="suggestions-list">
                    {analysis.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="suggestion-item">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Impact Multiplier Tab */}
          <TabsContent value="impact" className="ai-tab-content">
            <div className="impact-section">
              <div className="impact-header">
                <TrendingUp size={20} />
                <div>
                  <h4 className="impact-title">Impact Multiplier</h4>
                  <p className="impact-desc">Quantify your achievements for maximum impact</p>
                </div>
              </div>

              {analysis && analysis.impactOpportunities.length > 0 ? (
                <div className="impact-opportunities">
                  {analysis.impactOpportunities.map((opp, idx) => (
                    <Card key={idx} className="impact-card">
                      <div className="impact-label">Original</div>
                      <p className="impact-original">{opp.original}</p>
                      <div className="impact-label">AI Suggestion</div>
                      <p className="impact-suggestion">{opp.suggestion}</p>
                      <Button size="sm" variant="outline" className="apply-btn">
                        Apply Suggestion
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <AlertCircle size={32} className="empty-icon" />
                  <p>Analyze your resume with a job description first to get personalized impact suggestions.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAssistant;
