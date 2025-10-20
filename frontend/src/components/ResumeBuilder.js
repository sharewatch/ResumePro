import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, Save, Download, Sparkles } from 'lucide-react';
import ResumeEditor from './ResumeEditor';
import ResumePreview from './ResumePreview';
import AIAssistant from './AIAssistant';
import ExportDialog from './ExportDialog';
import { mockResumeData } from '../mock';
import axios from 'axios';
import './ResumeBuilder.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState(mockResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
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

  return (
    <div className="resume-builder">
      {/* Header */}
      <header className="builder-header">
        <div className="header-content">
          <div className="header-left">
            <FileText className="header-icon" size={28} />
            <h1 className="header-title">Resume Builder Pro</h1>
            <Badge variant="secondary" className="beta-badge">AI-Powered</Badge>
          </div>
          <div className="header-actions">
            <Button 
              variant="outline" 
              onClick={handleSave}
              className="save-btn"
            >
              <Save size={16} />
              {saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save'}
            </Button>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="builder-main">
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
              />
            </TabsContent>
            
            <TabsContent value="preview" className="tab-content">
              <ResumePreview 
                resumeData={resumeData}
                template={selectedTemplate}
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
      </div>

      {/* Export Dialog */}
      {showExportDialog && (
        <ExportDialog 
          resumeData={resumeData}
          template={selectedTemplate}
          onClose={() => setShowExportDialog(false)}
        />
      )}
    </div>
  );
};

export default ResumeBuilder;
