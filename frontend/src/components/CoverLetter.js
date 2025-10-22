import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { FileText, Sparkles, Download, Loader2 } from 'lucide-react';
import axios from 'axios';
import './CoverLetter.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CoverLetter = ({ resumeData, customColor = '#2563eb', coverLetterData, onCoverLetterChange }) => {
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Use persisted state from parent - extract values
  const { companyName, companyAddress, jobTitle, jobDescription, content: coverLetterContent, suggestions } = coverLetterData;

  // Helper functions to update parent state
  const setCompanyName = (value) => {
    const newData = { ...coverLetterData, companyName: value };
    onCoverLetterChange(newData);
  };
  
  const setCompanyAddress = (value) => {
    const newData = { ...coverLetterData, companyAddress: value };
    onCoverLetterChange(newData);
  };
  
  const setJobTitle = (value) => {
    const newData = { ...coverLetterData, jobTitle: value };
    onCoverLetterChange(newData);
  };
  
  const setJobDescription = (value) => {
    const newData = { ...coverLetterData, jobDescription: value };
    onCoverLetterChange(newData);
  };
  
  const setCoverLetterContent = (value) => {
    const newData = { ...coverLetterData, content: value };
    onCoverLetterChange(newData);
  };
  
  const setSuggestions = (value) => {
    const newData = { ...coverLetterData, suggestions: value };
    onCoverLetterChange(newData);
  };

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    setGenerating(true);

    try {
      console.log('Sending request to generate cover letter...');
      const response = await axios.post(`${API}/cover-letter/generate`, {
        resumeData,
        jobDescription,
        companyName,
        jobTitle
      });

      console.log('Cover letter response:', response.data);
      
      if (response.data && response.data.content) {
        // Update both content and suggestions in a single state update
        const newData = {
          ...coverLetterData,
          content: response.data.content,
          suggestions: response.data.suggestions || []
        };
        onCoverLetterChange(newData);
        console.log('Cover letter generated successfully');
        console.log('Content length:', response.data.content.length);
      } else {
        console.error('No content in response:', response.data);
        alert('Received empty response from AI. Please try again.');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      console.error('Error details:', error.response?.data);
      alert(`Failed to generate cover letter: ${error.response?.data?.detail || error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async () => {
    if (!coverLetterContent) {
      alert('Please generate a cover letter first');
      return;
    }

    setExporting(true);

    try {
      const response = await axios.post(
        `${API}/cover-letter/export/pdf`,
        {
          personalInfo: resumeData.personalInfo,
          companyName,
          companyAddress,
          jobTitle,
          content: coverLetterContent
        },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Cover_Letter.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export cover letter. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="cover-letter-container">
      <div className="cover-letter-header">
        <div className="header-left">
          <FileText size={28} style={{ color: customColor }} />
          <div>
            <h2>Cover Letter Builder</h2>
            <p>AI-powered cover letter generation tailored to your resume</p>
          </div>
        </div>
        {coverLetterContent && (
          <Button onClick={handleExport} disabled={exporting} style={{ backgroundColor: customColor, borderColor: customColor }}>
            <Download size={16} />
            {exporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        )}
      </div>

      <Tabs defaultValue="create" className="cover-letter-tabs">
        <TabsList>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="create-tab">
          <Card className="input-section">
            <h3>Job Details</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Company Name</label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Google"
                />
              </div>
              <div className="form-field">
                <label>Job Title</label>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior Product Manager"
                />
              </div>
            </div>
            <div className="form-field full-width">
              <label>Company Address (Optional)</label>
              <Textarea
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="e.g., 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA"
                rows={2}
              />
            </div>
            <div className="form-field full-width">
              <label>Job Description *</label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={8}
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating || !jobDescription.trim()}
              className="generate-btn"
              style={{ backgroundColor: customColor, borderColor: customColor }}
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="spinning" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </Card>

          {coverLetterContent && (
            <Card className="editor-section">
              <div className="editor-header">
                <h3>Edit Cover Letter</h3>
                <Badge variant="outline" className="info-badge">
                  💡 Note: Cover letters use first-person (I, my, me) - unlike resumes
                </Badge>
              </div>
              <Textarea
                value={coverLetterContent}
                onChange={(e) => setCoverLetterContent(e.target.value)}
                rows={20}
                className="cover-letter-textarea"
              />
            </Card>
          )}

          {suggestions.length > 0 && (
            <Card className="suggestions-section">
              <h3>
                <Sparkles size={20} />
                AI Suggestions
              </h3>
              <ul className="suggestions-list">
                {suggestions.map((suggestion, idx) => (
                  <li key={idx}>
                    <Badge variant="secondary" className="suggestion-badge">
                      Tip {idx + 1}
                    </Badge>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preview" className="preview-tab">
          {coverLetterContent ? (
            <Card className="preview-card" style={{ borderColor: customColor }}>
              <div className="preview-header" style={{ borderBottomColor: customColor }}>
                <div>
                  <h3 style={{ color: customColor }}>{resumeData.personalInfo.fullName}</h3>
                  <p>{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</p>
                  {resumeData.personalInfo.location && <p>{resumeData.personalInfo.location}</p>}
                </div>
              </div>
              <div className="preview-body">
                <p className="date">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                {companyName && (
                  <div className="company-section">
                    <p className="company" style={{ fontWeight: 600 }}>{companyName}</p>
                    {companyAddress && (
                      <p className="company-address">{companyAddress}</p>
                    )}
                  </div>
                )}
                {jobTitle && <p className="job-title" style={{ color: customColor, marginTop: '1.5rem' }}>Re: {jobTitle}</p>}
                <div className="letter-content">
                  {coverLetterContent.split('\n\n').map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
                <p className="signature">Yours sincerely,<br/><span style={{ color: customColor }}>{resumeData.personalInfo.fullName}</span></p>
              </div>
            </Card>
          ) : (
            <div className="empty-preview">
              <FileText size={64} className="empty-icon" style={{ color: customColor }} />
              <p>Generate a cover letter to see the preview</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoverLetter;
