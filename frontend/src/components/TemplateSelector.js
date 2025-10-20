import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Check } from 'lucide-react';
import './TemplateSelector.css';

const templates = [
  {
    id: 'professional',
    name: 'Professional',
    category: 'Corporate',
    description: 'Clean and classic layout for corporate roles',
    color: '#0f172a',
    preview: '/templates/professional.svg'
  },
  {
    id: 'modern',
    name: 'Modern Executive',
    category: 'Corporate',
    description: 'Contemporary design with subtle accent colors',
    color: '#1e40af',
    preview: '/templates/modern.svg'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    category: 'Tech',
    description: 'Minimalist approach focusing on content clarity',
    color: '#64748b',
    preview: '/templates/minimal.svg'
  },
  {
    id: 'creative',
    name: 'Creative Pro',
    category: 'Design',
    description: 'Bold design for creative professionals',
    color: '#7c3aed',
    preview: '/templates/creative.svg'
  },
  {
    id: 'tech',
    name: 'Tech Specialist',
    category: 'Tech',
    description: 'Clean code-inspired layout for developers',
    color: '#059669',
    preview: '/templates/tech.svg'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    category: 'Corporate',
    description: 'Sophisticated serif-based design',
    color: '#991b1b',
    preview: '/templates/elegant.svg'
  },
  {
    id: 'healthcare',
    name: 'Healthcare Pro',
    category: 'Healthcare',
    description: 'Professional design for medical fields',
    color: '#0284c7',
    preview: '/templates/healthcare.svg'
  },
  {
    id: 'academic',
    name: 'Academic',
    category: 'Education',
    description: 'Publication-style for researchers and professors',
    color: '#4f46e5',
    preview: '/templates/academic.svg'
  },
  {
    id: 'marketing',
    name: 'Marketing Maven',
    category: 'Marketing',
    description: 'Vibrant design for marketing professionals',
    color: '#dc2626',
    preview: '/templates/marketing.svg'
  },
  {
    id: 'finance',
    name: 'Finance Expert',
    category: 'Finance',
    description: 'Conservative design for financial roles',
    color: '#15803d',
    preview: '/templates/finance.svg'
  },
  {
    id: 'startup',
    name: 'Startup Founder',
    category: 'Entrepreneurship',
    description: 'Dynamic layout for startup culture',
    color: '#ea580c',
    preview: '/templates/startup.svg'
  },
  {
    id: 'executive',
    name: 'C-Suite Executive',
    category: 'Corporate',
    description: 'Premium design for senior leadership',
    color: '#1e293b',
    preview: '/templates/executive.svg'
  }
];

const TemplateSelector = ({ selectedTemplate, onSelectTemplate }) => {
  const categories = ['All', ...new Set(templates.map(t => t.category))];
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filteredTemplates = activeCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="template-selector">
      <div className="template-header">
        <div>
          <h3 className="template-title">Choose Your Template</h3>
          <p className="template-subtitle">Select a design that matches your industry</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="template-grid">
        {filteredTemplates.map(template => (
          <Card
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
            onClick={() => onSelectTemplate(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className="selected-badge">
                <Check size={16} />
              </div>
            )}
            
            <div className="template-preview" style={{ borderColor: template.color }}>
              <div className="preview-placeholder" style={{ background: `linear-gradient(135deg, ${template.color}15 0%, ${template.color}30 100%)` }}>
                <div className="preview-header" style={{ backgroundColor: template.color }}></div>
                <div className="preview-content">
                  <div className="preview-line" style={{ backgroundColor: template.color }}></div>
                  <div className="preview-line short" style={{ backgroundColor: `${template.color}80` }}></div>
                  <div className="preview-line" style={{ backgroundColor: `${template.color}60` }}></div>
                  <div className="preview-line short" style={{ backgroundColor: `${template.color}40` }}></div>
                </div>
              </div>
            </div>
            
            <div className="template-info">
              <div className="template-name">{template.name}</div>
              <Badge variant="secondary" className="template-category">
                {template.category}
              </Badge>
              <p className="template-description">{template.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;