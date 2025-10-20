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
    setResumeData(parsedData);
    setShowImportDialog(false);
    setMainTab('resume');
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
              onClick={() => setMainTab('resume')}
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
            {mainTab === 'resume' && (
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
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
            <TabsTrigger value="score">Score & Analytics</TabsTrigger>
            <TabsTrigger value="customize">Customise</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="builder-main">
        {mainTab === 'resume' ? (
          <>
            <div className="builder-workspace">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="workspace-tabs">
                <TabsList className="tabs-list">
                  <TabsTrigger value="edit">Edit Content</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit" className="tab-content">
                  <ResumeEditor 
                    resumeData={resumeData}
                    setResumeData={setResumeData}
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                    onOpenSkillsImport={() => setShowSkillsImport(true)}
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="tab-content">
                  <ResumePreview 
                    resumeData={resumeData}
                    template={selectedTemplate}
                    customColor={customColor}
                    onColorChange={setCustomColor}
                  />
                </TabsContent>
              </Tabs>
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
          </>
        ) : mainTab === 'cover-letter' ? (
          <CoverLetter resumeData={resumeData} />
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
