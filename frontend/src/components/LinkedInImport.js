import React, { useState } from 'react';
import axios from 'axios';
import { Linkedin, Download } from 'lucide-react';
import './LinkedInImport.css';

const LinkedInImport = ({ onImportComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLinkedInImport = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get LinkedIn authorization URL
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/linkedin/login`);
      
      if (response.data.authorization_url) {
        // Store state in sessionStorage for validation
        sessionStorage.setItem('linkedin_state', response.data.state);
        
        // Redirect to LinkedIn authorization page
        window.location.href = response.data.authorization_url;
      }
    } catch (err) {
      console.error('Error initiating LinkedIn import:', err);
      setError(err.response?.data?.detail || 'Failed to connect to LinkedIn. Please try again.');
      setLoading(false);
    }
  };

  // Check if we're returning from LinkedIn callback
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const linkedinProfile = urlParams.get('linkedin_profile');
    const linkedinImport = urlParams.get('linkedin_import');
    const errorMessage = urlParams.get('message');

    if (linkedinImport === 'success' && linkedinProfile) {
      try {
        // Decode base64 profile data
        const decoded = atob(linkedinProfile);
        const profileData = JSON.parse(decoded);

        // Convert to resume format
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/linkedin/prefill`, profileData)
          .then(response => {
            if (response.data.status === 'success') {
              onImportComplete(response.data.data);
              
              // Clean up URL
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          })
          .catch(err => {
            console.error('Error processing LinkedIn profile:', err);
            setError('Failed to process LinkedIn profile data');
          });
      } catch (err) {
        console.error('Error parsing LinkedIn profile:', err);
        setError('Failed to parse LinkedIn profile data');
      }
    } else if (linkedinImport === 'error') {
      setError(errorMessage || 'LinkedIn import failed');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [onImportComplete]);

  return (
    <div className="linkedin-import">
      <button
        className="linkedin-import-button"
        onClick={handleLinkedInImport}
        disabled={loading}
      >
        <Linkedin size={20} />
        {loading ? 'Connecting to LinkedIn...' : 'Import from LinkedIn'}
      </button>

      {error && (
        <div className="linkedin-import-error">
          <p>{error}</p>
          {error.includes('not configured') && (
            <div className="linkedin-setup-info">
              <h4>LinkedIn OAuth Setup Required</h4>
              <p>To enable LinkedIn import, you need to:</p>
              <ol>
                <li>Go to <a href="https://developer.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn Developer Portal</a></li>
                <li>Create a new app</li>
                <li>Get your Client ID and Client Secret</li>
                <li>Add them to your backend .env file:
                  <pre>
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:8001/api/auth/linkedin/callback
                  </pre>
                </li>
                <li>Restart the backend server</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkedInImport;
