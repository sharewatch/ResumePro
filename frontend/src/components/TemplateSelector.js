import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Check } from 'lucide-react';
import './TemplateSelector.css';

const templates = [
  {
    id: 'professional',
    name: 'Professional',
    category: 'Traditional',
    description: 'Classic single-column layout for corporate roles',
    color: '#0f172a',
    layout: 'single-column',
    preview: '/templates/professional.svg'
  },
  {
    id: 'two-column-sidebar',
    name: 'Two-Column Sidebar',
    category: 'Modern',
    description: 'Sidebar with skills and contact, main area for experience',
    color: '#2563eb',
    layout: 'two-column',
    preview: '/templates/two-column.svg'
  },
  {
    id: 'modern-creative',
    name: 'Modern Creative',
    category: 'Creative',
    description: 'Colourful header with split content layout',
    color: '#8b5cf6',
    layout: 'creative',
    preview: '/templates/creative.svg'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    category: 'Clean',
    description: 'Simple, content-focused design with minimal styling',
    color: '#6b7280',
    layout: 'single-column',
    preview: '/templates/minimal.svg'
  },
  {
    id: 'modern',
    name: 'Modern Executive',
    category: 'Corporate',
    description: 'Contemporary design with subtle accent colours',
    color: '#1e40af',
    layout: 'single-column',
    preview: '/templates/modern.svg'
  },
  {
    id: 'minimal',
    name: 'Tech Minimal',
    category: 'Tech',
    description: 'Clean tech-inspired layout for developers',
    color: '#64748b',
    layout: 'single-column',
    preview: '/templates/minimal.svg'
  },
  {
    id: 'creative',
    name: 'Creative Pro',
    category: 'Design',
    description: 'Bold design for creative professionals',
    color: '#7c3aed',
    layout: 'creative',
    preview: '/templates/creative.svg'
  },
  {
    id: 'tech',
    name: 'Tech Specialist',
    category: 'Tech',
    description: 'Clean code-inspired layout for developers',
    color: '#059669',
    layout: 'single-column',
    preview: '/templates/tech.svg'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    category: 'Traditional',
    description: 'Sophisticated serif-based design',
    color: '#991b1b',
    layout: 'single-column',
    preview: '/templates/elegant.svg'
  },
  {
    id: 'healthcare',
    name: 'Healthcare Pro',
    category: 'Healthcare',
    description: 'Professional design for medical fields',
    color: '#0284c7',
    layout: 'single-column',
    preview: '/templates/healthcare.svg'
  },
  {
    id: 'academic',
    name: 'Academic',
    category: 'Education',
    description: 'Publication-style for researchers and professors',
    color: '#4f46e5',
    layout: 'single-column',
    preview: '/templates/academic.svg'
  },
  {
    id: 'marketing',
    name: 'Marketing Maven',
    category: 'Marketing',
    description: 'Vibrant design for marketing professionals',
    color: '#dc2626',
    layout: 'creative',
    preview: '/templates/marketing.svg'
  },
  {
    id: 'finance',
    name: 'Finance Expert',
    category: 'Finance',
    description: 'Conservative design for financial roles',
    color: '#15803d',
    layout: 'single-column',
    preview: '/templates/finance.svg'
  },
  {
    id: 'startup',
    name: 'Startup Founder',
    category: 'Entrepreneurship',
    description: 'Dynamic layout for startup culture',
    color: '#ea580c',
    layout: 'creative',
    preview: '/templates/startup.svg'
  },
  {
    id: 'executive',
    name: 'C-Suite Executive',
    category: 'Corporate',
    description: 'Premium design for senior leadership',
    color: '#1e293b',
    layout: 'two-column',
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
              <div className="template-badges">
                <Badge variant="secondary" className="template-category">
                  {template.category}
                </Badge>
                <Badge variant="outline" className="template-layout">
                  {template.layout === 'two-column' ? '2-Column' : template.layout === 'creative' ? 'Creative' : 'Classic'}
                </Badge>
              </div>
              <p className="template-description">{template.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;