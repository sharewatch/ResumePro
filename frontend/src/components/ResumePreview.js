import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { TraditionalTemplate, TwoColumnTemplate, ModernCreativeTemplate, MinimalistTemplate } from './ResumeTemplates';
import './ResumePreview.css';

const ResumePreview = ({ resumeData, template, customColor, onColorChange, customization = {} }) => {
  const { personalInfo, summary, experience, education, skills, certifications, languages } = resumeData;

  // Template-specific styling
  const getTemplateStyles = () => {
    const baseColor = customColor || getDefaultColor(template);
    return {
      headerBorder: baseColor,
      accentColor: baseColor
    };
  };

  const getDefaultColor = (templateId) => {
    const colors = {
      professional: '#0f172a',
      modern: '#1e40af',
      minimal: '#64748b',
      creative: '#7c3aed',
      tech: '#059669',
      elegant: '#991b1b',
      healthcare: '#0284c7',
      academic: '#4f46e5',
      marketing: '#dc2626',
      finance: '#15803d',
      startup: '#ea580c',
      executive: '#1e293b',
      'two-column-sidebar': '#2563eb',
      'modern-creative': '#8b5cf6',
      'minimalist': '#6b7280',
      'traditional': '#0f172a'
    };
    return colors[templateId] || '#0f172a';
  };

  const templateStyles = getTemplateStyles();

  // Render specific template layout
  const renderTemplate = () => {
    // Two-column layouts
    if (template.includes('two-column') || template === 'sidebar') {
      return <TwoColumnTemplate resumeData={resumeData} templateStyles={templateStyles} />;
    }
    
    // Modern creative layouts
    if (template.includes('creative') || template === 'modern-creative') {
      return <ModernCreativeTemplate resumeData={resumeData} templateStyles={templateStyles} />;
    }
    
    // Minimalist layouts
    if (template.includes('minimal')) {
      return <MinimalistTemplate resumeData={resumeData} templateStyles={templateStyles} />;
    }
    
    // Default to traditional single-column layout
    return <TraditionalTemplate resumeData={resumeData} templateStyles={templateStyles} />;
  };

  return (
    <div className="resume-preview">
      {/* Color Customizer */}
      <div className="color-customizer">
        <label>Accent Colour:</label>
        <div className="color-options">
          {['#0f172a', '#1e40af', '#7c3aed', '#059669', '#dc2626', '#ea580c', '#0284c7', '#991b1b', '#6b7280'].map(color => (
            <button
              key={color}
              className={`color-btn ${customColor === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
              title={color}
            />
          ))}
          <input
            type="color"
            value={customColor || getDefaultColor(template)}
            onChange={(e) => onColorChange(e.target.value)}
            className="color-picker"
            title="Custom colour"
          />
        </div>
      </div>

      <div 
        className="preview-container"
        style={{
          fontFamily: getFontFamily(customization.font),
          fontSize: `${(customization.fontSize || 1) * 100}%`,
          lineHeight: customization.lineHeight || 1.6,
          padding: `${(customization.margin || 1) * 2}rem`,
          '--section-spacing': `${(customization.spacing || 1) * 1.5}rem`
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};

// Helper function to get font family
const getFontFamily = (font) => {
  const fontMap = {
    'inter': "'Inter', sans-serif",
    'roboto': "'Roboto', sans-serif",
    'lato': "'Lato', sans-serif",
    'open-sans': "'Open Sans', sans-serif",
    'georgia': "'Georgia', serif",
    'merriweather': "'Merriweather', serif",
    'source-code-pro': "'Source Code Pro', monospace"
  };
  return fontMap[font] || fontMap['inter'];
};

export default ResumePreview;
