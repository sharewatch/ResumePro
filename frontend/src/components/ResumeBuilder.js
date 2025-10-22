import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, Save, Download, Sparkles, Upload } from 'lucide-react';
import ResumeEditor from './ResumeEditor';
import ResumePreview from './ResumePreview';
import AIAssistant from './AIAssistant';
import ExportDialog from './ExportDialog';
import ResumeImport from './ResumeImport';
import CoverLetter from './CoverLetter';
import ResumeScore from './ResumeScore';
import TemplateCustomizer from './TemplateCustomizer';
import BulkSkillsImport from './BulkSkillsImport';
import { mockResumeData } from '../mock';
import axios from 'axios';
import './ResumeBuilder.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState(mockResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [customColor, setCustomColor] = useState(null);
  const [customization, setCustomization] = useState({
    font: 'inter',
    spacing: 1,
    fontSize: 1,
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications', 'languages']
  });
  const [coverLetterData, setCoverLetterData] = useState({
    companyName: '',
    companyAddress: '',
    jobTitle: '',
    jobDescription: '',
    content: '',
    suggestions: []
  });
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showSkillsImport, setShowSkillsImport] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const [mainTab, setMainTab] = useState('resume');
  const [saveStatus, setSaveStatus] = useState('');

  const handleSave = async () => {
    try {
      await axios.post(`${API}/resumes`, {
        resumeData,
        template: selectedTemplate
      });
      
      // Also keep localStorage backup
      localStorage.setItem('currentResume', JSON.stringify(resumeData));
      localStorage.setItem('selectedTemplate', selectedTemplate);
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const handleImportComplete = (parsedData) => {
    console.log('Parsed data received:', parsedData);
    
    // Merge imported data with existing structure
    const importedData = {
      personalInfo: {
        ...resumeData.personalInfo,
        ...parsedData.personalInfo
      },
      summary: parsedData.summary || resumeData.summary,
      experience: parsedData.experience && parsedData.experience.length > 0 
        ? parsedData.experience 
        : resumeData.experience,
      education: parsedData.education && parsedData.education.length > 0 
        ? parsedData.education 
        : resumeData.education,
      skills: parsedData.skills && parsedData.skills.length > 0 
        ? parsedData.skills 
        : resumeData.skills,
      certifications: parsedData.certifications && parsedData.certifications.length > 0 
        ? parsedData.certifications 
        : resumeData.certifications,
      languages: parsedData.languages && parsedData.languages.length > 0 
        ? parsedData.languages 
        : resumeData.languages
    };
    
    console.log('Merged data:', importedData);
    setResumeData(importedData);
    setShowImportDialog(false);
    setMainTab('edit'); // Switch to edit tab to show imported data
    setSaveStatus('imported');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleSkillsImport = (newSkills) => {
    const allSkills = [...new Set([...resumeData.skills, ...newSkills])];
    setResumeData({ ...resumeData, skills: allSkills });
    setShowSkillsImport(false);
  };

  return (
    <div className="resume-builder">
      {/* Header */}
      <header className="builder-header">
        <div className="header-content">
          <div className="header-left">
            <Button 
              variant="ghost" 
              onClick={() => setMainTab('edit')}
              className="home-btn"
              title="Home"
            >
              <FileText className="header-icon" size={28} />
            </Button>
            <div className="header-title-section">
              <h1 className="header-title">Resume Builder Pro</h1>
              <Badge variant="secondary" className="beta-badge">AI-Powered</Badge>
            </div>
          </div>
          <div className="header-actions">
            <Button 
              variant="outline"
              onClick={() => setShowImportDialog(true)}
              className="import-btn"
            >
              <Upload size={16} />
              Import Resume
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSave}
              className="save-btn"
            >
              <Save size={16} />
              {saveStatus === 'saved' ? 'Saved!' : saveStatus === 'imported' ? 'Imported!' : saveStatus === 'error' ? 'Error' : 'Save'}
            </Button>
            {(mainTab === 'edit' || mainTab === 'preview') && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => setShowAIPanel(!showAIPanel)}
                  className={showAIPanel ? 'ai-btn active' : 'ai-btn'}
                >
                  <Sparkles size={16} />
                  AI Assistant
                </Button>
                <Button 
                  onClick={handleExport}
                  className="export-btn"
                >
                  <Download size={16} />
                  Export
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <div className="main-navigation">
        <Tabs value={mainTab} onValueChange={setMainTab} className="main-tabs">
          <TabsList>
            <TabsTrigger value="edit">Edit Content</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
            <TabsTrigger value="score">Score & Analytics</TabsTrigger>
            <TabsTrigger value="customize">Customise</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="builder-main">
        {/* Welcome Section - Always show at top */}
        {mainTab === 'edit' && (
          <div className="welcome-section">
            <h1 className="welcome-title">Build Your Professional Resume in Minutes</h1>
            <p className="welcome-subtitle">
              Create an ATS-optimized resume with AI-powered assistance, choose from professional templates, and land your dream job faster
            </p>
            
            <div className="welcome-features">
              <div className="welcome-feature">
                <div className="welcome-feature-icon">
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2L2 8l12 6 12-6-12-6z"/><path d="M2 17l12 6 12-6M2 12l12 6 12-6"/></svg>
                </div>
                <h4>15+ Professional Templates</h4>
                <p>Choose from diverse, ATS-friendly designs for every industry</p>
              </div>
              <div className="welcome-feature">
                <div className="welcome-feature-icon">
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8a3 3 0 0 1 3 3"/></svg>
                </div>
                <h4>AI-Powered Analysis</h4>
                <p>Get instant ATS score, keyword suggestions, and optimization tips</p>
              </div>
              <div className="welcome-feature">
                <div className="welcome-feature-icon">
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </div>
                <h4>Easy Export & Import</h4>
                <p>Download as PDF/DOCX or import existing resume to enhance</p>
              </div>
            </div>

            <div className="welcome-steps">
              <h3>How It Works</h3>
              <div className="steps-grid">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Choose Template</h4>
                    <p>Pick a design that matches your industry from our library</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Add Your Information</h4>
                    <p>Fill in your details or import an existing resume</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Download & Apply</h4>
                    <p>Export your polished resume and start applying!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {mainTab === 'edit' ? (
          <div className="builder-workspace">
            <div className="tab-content">
              <ResumeEditor 
                resumeData={resumeData}
                setResumeData={setResumeData}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                onOpenSkillsImport={() => setShowSkillsImport(true)}
              />
            </div>
            {/* AI Assistant Panel */}
            {showAIPanel && (
              <div className="ai-panel">
                <AIAssistant 
                  resumeData={resumeData}
                  onClose={() => setShowAIPanel(false)}
                />
              </div>
            )}
          </div>
        ) : mainTab === 'preview' ? (
          <div className="builder-workspace">
            <div className="tab-content">
              <ResumePreview 
                resumeData={resumeData}
                template={selectedTemplate}
                customColor={customColor}
                onColorChange={setCustomColor}
                customization={customization}
              />
            </div>
            {/* AI Assistant Panel */}
            {showAIPanel && (
              <div className="ai-panel">
                <AIAssistant 
                  resumeData={resumeData}
                  onClose={() => setShowAIPanel(false)}
                />
              </div>
            )}
          </div>
        ) : mainTab === 'cover-letter' ? (
          <CoverLetter 
            resumeData={resumeData} 
            customColor={customColor}
            coverLetterData={coverLetterData}
            onCoverLetterChange={setCoverLetterData}
          />
        ) : mainTab === 'score' ? (
          <ResumeScore resumeData={resumeData} />
        ) : (
          <TemplateCustomizer 
            customization={customization}
            onCustomizationChange={setCustomization}
          />
        )}
      </div>

      {/* Dialogs */}
      {showExportDialog && (
        <ExportDialog 
          resumeData={resumeData}
          template={selectedTemplate}
          onClose={() => setShowExportDialog(false)}
        />
      )}

      {showImportDialog && (
        <ResumeImport
          onImportComplete={handleImportComplete}
          onClose={() => setShowImportDialog(false)}
        />
      )}

      {showSkillsImport && (
        <BulkSkillsImport
          currentSkills={resumeData.skills}
          onSkillsImport={handleSkillsImport}
          onClose={() => setShowSkillsImport(false)}
        />
      )}
    </div>
  );
};

export default ResumeBuilder;
