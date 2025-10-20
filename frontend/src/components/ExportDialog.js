import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { FileText, Download, CheckCircle } from 'lucide-react';
import './ExportDialog.css';

const ExportDialog = ({ resumeData, template, onClose }) => {
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = (format) => {
    setExporting(true);
    // Mock export
    setTimeout(() => {
      setExporting(false);
      setExportSuccess(true);
      
      // Simulate download
      const filename = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.${format}`;
      alert(`Mock export: ${filename} would be downloaded`);
      
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="export-dialog">
        <DialogHeader>
          <DialogTitle className="export-title">
            <FileText size={24} />
            Export Resume
          </DialogTitle>
          <DialogDescription>
            Choose your preferred format. Your resume will be optimized for ATS compatibility.
          </DialogDescription>
        </DialogHeader>

        {exportSuccess ? (
          <div className="export-success">
            <CheckCircle size={48} className="success-icon" />
            <p className="success-text">Resume exported successfully!</p>
          </div>
        ) : (
          <div className="export-options">
            <div className="export-card" onClick={() => !exporting && handleExport('pdf')}>
              <div className="export-icon-wrapper pdf">
                <FileText size={32} />
              </div>
              <div className="export-info">
                <h3 className="export-format">PDF Format</h3>
                <p className="export-desc">Best for applications and printing</p>
                <ul className="export-features">
                  <li>ATS-friendly formatting</li>
                  <li>Universal compatibility</li>
                  <li>Professional appearance</li>
                </ul>
              </div>
              <Button 
                className="export-btn"
                disabled={exporting}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExport('pdf');
                }}
              >
                <Download size={16} />
                {exporting ? 'Exporting...' : 'Download PDF'}
              </Button>
            </div>

            <div className="export-card" onClick={() => !exporting && handleExport('docx')}>
              <div className="export-icon-wrapper docx">
                <FileText size={32} />
              </div>
              <div className="export-info">
                <h3 className="export-format">DOCX Format</h3>
                <p className="export-desc">Editable for further customization</p>
                <ul className="export-features">
                  <li>Easy to edit in Word</li>
                  <li>Preserve formatting</li>
                  <li>Company-specific adjustments</li>
                </ul>
              </div>
              <Button 
                className="export-btn"
                disabled={exporting}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExport('docx');
                }}
              >
                <Download size={16} />
                {exporting ? 'Exporting...' : 'Download DOCX'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
