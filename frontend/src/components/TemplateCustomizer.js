import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Palette, Type, Space, List } from 'lucide-react';
import './TemplateCustomizer.css';

const TemplateCustomizer = ({ customization, onCustomizationChange }) => {
  const fonts = [
    { value: 'inter', label: 'Inter (Modern Sans-serif)' },
    { value: 'roboto', label: 'Roboto (Clean Sans-serif)' },
    { value: 'lato', label: 'Lato (Professional Sans-serif)' },
    { value: 'open-sans', label: 'Open Sans (Friendly Sans-serif)' },
    { value: 'playfair', label: 'Playfair Display (Elegant Serif)' },
    { value: 'georgia', label: 'Georgia (Classic Serif)' },
    { value: 'merriweather', label: 'Merriweather (Readable Serif)' },
    { value: 'source-code-pro', label: 'Source Code Pro (Tech Monospace)' }
  ];

  const lineHeightOptions = [
    { value: 1.4, label: 'Compact' },
    { value: 1.6, label: 'Normal' },
    { value: 1.8, label: 'Relaxed' }
  ];

  const sections = [
    { id: 'summary', label: 'Professional Summary' },
    { id: 'experience', label: 'Work Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'languages', label: 'Languages' }
  ];

  const handleFontChange = (value) => {
    onCustomizationChange({ ...customization, font: value });
  };

  const handleSpacingChange = (value) => {
    onCustomizationChange({ ...customization, spacing: value[0] });
  };

  const handleFontSizeChange = (value) => {
    onCustomizationChange({ ...customization, fontSize: value[0] });
  };

  const handleLineHeightChange = (value) => {
    onCustomizationChange({ ...customization, lineHeight: value[0] });
  };

  const handleMarginChange = (value) => {
    onCustomizationChange({ ...customization, margin: value[0] });
  };

  const handleSectionOrderChange = (newOrder) => {
    onCustomizationChange({ ...customization, sectionOrder: newOrder });
  };

  const moveSectionUp = (index) => {
    if (index === 0) return;
    const newOrder = [...(customization.sectionOrder || sections.map(s => s.id))];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    handleSectionOrderChange(newOrder);
  };

  const moveSectionDown = (index) => {
    const order = customization.sectionOrder || sections.map(s => s.id);
    if (index === order.length - 1) return;
    const newOrder = [...order];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    handleSectionOrderChange(newOrder);
  };

  const resetCustomization = () => {
    onCustomizationChange({
      font: 'inter',
      spacing: 1,
      fontSize: 1,
      sectionOrder: sections.map(s => s.id)
    });
  };

  const currentSectionOrder = customization.sectionOrder || sections.map(s => s.id);

  return (
    <div className="template-customizer">
      <div className="customizer-header">
        <Palette size={28} />
        <div>
          <h2>Template Customisation</h2>
          <p>Personalise your resume layout and styling</p>
        </div>
      </div>

      <div className="customizer-content">
        {/* Font Selection */}
        <Card className="customizer-section">
          <div className="section-header">
            <Type size={20} />
            <h3>Font Family</h3>
          </div>
          <div className="form-field">
            <Label>Select Font</Label>
            <Select value={customization.font || 'inter'} onValueChange={handleFontChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fonts.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Spacing & Size */}
        <Card className="customizer-section">
          <div className="section-header">
            <Space size={20} />
            <h3>Spacing & Size</h3>
          </div>
          <div className="form-field">
            <Label>Section Spacing: {customization.spacing || 1}x</Label>
            <Slider
              value={[customization.spacing || 1]}
              onValueChange={handleSpacingChange}
              min={0.5}
              max={2}
              step={0.1}
              className="spacing-slider"
            />
            <div className="slider-labels">
              <span>Compact</span>
              <span>Normal</span>
              <span>Spacious</span>
            </div>
          </div>
          <div className="form-field">
            <Label>Font Size: {customization.fontSize || 1}x</Label>
            <Slider
              value={[customization.fontSize || 1]}
              onValueChange={handleFontSizeChange}
              min={0.8}
              max={1.3}
              step={0.05}
              className="spacing-slider"
            />
            <div className="slider-labels">
              <span>Small</span>
              <span>Medium</span>
              <span>Large</span>
            </div>
          </div>
          <div className="form-field">
            <Label>Line Height: {customization.lineHeight || 1.6}</Label>
            <Slider
              value={[customization.lineHeight || 1.6]}
              onValueChange={handleLineHeightChange}
              min={1.3}
              max={2.0}
              step={0.1}
              className="spacing-slider"
            />
            <div className="slider-labels">
              <span>Tight</span>
              <span>Normal</span>
              <span>Loose</span>
            </div>
          </div>
          <div className="form-field">
            <Label>Page Margins: {customization.margin || 1}x</Label>
            <Slider
              value={[customization.margin || 1]}
              onValueChange={handleMarginChange}
              min={0.5}
              max={1.5}
              step={0.1}
              className="spacing-slider"
            />
            <div className="slider-labels">
              <span>Narrow</span>
              <span>Normal</span>
              <span>Wide</span>
            </div>
          </div>
        </Card>

        {/* Section Ordering */}
        <Card className="customizer-section">
          <div className="section-header">
            <List size={20} />
            <h3>Section Order</h3>
          </div>
          <p className="section-description">Drag or reorder sections to prioritise what matters most</p>
          <div className="sections-list">
            {currentSectionOrder.map((sectionId, index) => {
              const section = sections.find(s => s.id === sectionId);
              if (!section) return null;
              return (
                <div key={sectionId} className="section-order-item">
                  <span className="section-number">{index + 1}</span>
                  <span className="section-label">{section.label}</span>
                  <div className="section-actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSectionUp(index)}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSectionDown(index)}
                      disabled={index === currentSectionOrder.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Reset Button */}
        <Button variant="outline" onClick={resetCustomization} className="reset-btn">
          Reset to Default
        </Button>
      </div>
    </div>
  );
};

export default TemplateCustomizer;
