import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import './ResumeImport.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ResumeImport = ({ onImportComplete, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const fileExt = file.name.toLowerCase().split('.').pop();
    if (!['pdf', 'docx'].includes(fileExt)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API}/parse-resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setTimeout(() => {
        onImportComplete(response.data);
      }, 1500);
    } catch (err) {
      console.error('Upload failed:', err);
      let errorMessage = 'Failed to parse resume. ';
      
      if (err.response?.status === 401) {
        errorMessage += 'AI service temporarily unavailable. Please try again later or enter your information manually.';
      } else if (err.response?.status === 400) {
        errorMessage += err.response?.data?.detail || 'The file format may not be supported. Please ensure your resume is a valid PDF or DOCX file.';
      } else {
        errorMessage += 'Please try again or enter your information manually.';
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="resume-import">
      <Card className="import-card">
        <div className="import-header">
          <FileText size={32} className="import-icon" />
          <h2>Import Resume</h2>
          <p>Upload your existing resume (PDF or DOCX) to auto-fill your information</p>
        </div>

        {!success ? (
          <div className="upload-area">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              disabled={uploading}
              className="file-input"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="upload-label">
              {uploading ? (
                <>
                  <Loader2 size={48} className="uploading-icon" />
                  <p className="upload-text">Parsing your resume with AI...</p>
                  <p className="upload-subtext">This may take a few seconds</p>
                </>
              ) : (
                <>
                  <Upload size={48} className="upload-icon" />
                  <p className="upload-text">Click to upload or drag and drop</p>
                  <p className="upload-subtext">PDF or DOCX (max 5MB)</p>
                </>
              )}
            </label>

            {error && (
              <div className="error-message">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="success-message">
            <CheckCircle2 size={64} className="success-icon" />
            <h3>Resume Imported Successfully!</h3>
            <p>Your information has been parsed and will be filled in automatically</p>
          </div>
        )}

        <div className="import-actions">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ResumeImport;
