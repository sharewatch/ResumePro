// Mock data for Resume Builder

export const mockResumeData = {
  personalInfo: {
    fullName: "Alex Morgan",
    email: "alex.morgan@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
    portfolio: "alexmorgan.dev"
  },
  summary: "Results-driven Product Manager with 5+ years of experience leading cross-functional teams to deliver innovative AI-powered products. Proven track record of launching features that increased user engagement by 40% and revenue by $2M annually.",
  experience: [
    {
      id: "exp1",
      title: "Senior Product Manager",
      company: "TechCorp AI",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Led product strategy for AI-powered analytics platform serving 10,000+ enterprise users",
        "Increased user engagement by 40% through data-driven feature prioritization",
        "Managed cross-functional team of 12 engineers, designers, and data scientists",
        "Launched 3 major features that generated $2M in additional annual revenue"
      ]
    },
    {
      id: "exp2",
      title: "Product Manager",
      company: "StartupHub",
      location: "San Francisco, CA",
      startDate: "Jun 2019",
      endDate: "Dec 2020",
      current: false,
      bullets: [
        "Defined product roadmap for B2B SaaS platform with 50+ clients",
        "Conducted user research with 100+ customers to inform product decisions",
        "Improved customer retention by 25% through new onboarding experience"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      degree: "Master of Business Administration",
      school: "Stanford University",
      location: "Stanford, CA",
      graduationDate: "2019",
      gpa: "3.8"
    },
    {
      id: "edu2",
      degree: "Bachelor of Science in Computer Science",
      school: "UC Berkeley",
      location: "Berkeley, CA",
      graduationDate: "2017",
      gpa: "3.6"
    }
  ],
  skills: [
    "Product Strategy",
    "Agile/Scrum",
    "Data Analysis",
    "User Research",
    "A/B Testing",
    "SQL",
    "Jira",
    "Figma",
    "Cross-functional Leadership"
  ],
  projects: [
    {
      id: "proj1",
      name: "AI Content Recommendation Engine",
      description: "Built ML-powered content recommendation system that increased user session time by 35%"
    }
  ]
};

export const mockATSAnalysis = {
  score: 78,
  status: "Good",
  keywordAnalysis: {
    matched: [
      "Product Management",
      "Agile Scrum",
      "Cross-functional Collaboration",
      "Data-driven Decisions",
      "User Research"
    ],
    missing: [
      "Machine Learning",
      "Deep Learning",
      "Natural Language Processing",
      "Product Roadmap",
      "Stakeholder Management"
    ],
    overused: []
  },
  suggestions: [
    "You've mentioned 'Product Management' but 'Machine Learning' is a key requirement. Consider adding a project or skill related to ML.",
    "Add specific metrics to quantify your impact in more bullet points.",
    "Consider including 'Deep Learning' in your skills or project descriptions to match the job requirements."
  ],
  impactOpportunities: [
    {
      original: "Managed cross-functional team of engineers, designers, and data scientists",
      suggestion: "Led cross-functional team of 12 engineers, 3 designers, and 2 data scientists to deliver 5 major product releases on time"
    },
    {
      original: "Conducted user research with customers to inform product decisions",
      suggestion: "Conducted user research with 100+ enterprise customers, resulting in 3 high-impact features that increased NPS by 15 points"
    }
  ],
  readability: {
    score: 85,
    suggestions: [
      "Your summary could benefit from a strong opening statement. Try using an action verb.",
      "Consider breaking down complex sentences in your experience section for better readability."
    ]
  }
};

export const mockJobDescription = `Senior Product Manager, AI Focus

We are seeking an experienced Senior Product Manager to lead our AI-powered product initiatives. 

Key Responsibilities:
- Define and execute product strategy for machine learning products
- Lead cross-functional teams including engineers, data scientists, and designers
- Drive data-driven decision making through A/B testing and analytics
- Collaborate with stakeholders across the organization

Required Skills:
- 5+ years of product management experience
- Strong understanding of Machine Learning and Deep Learning concepts
- Experience with Agile/Scrum methodologies
- Excellent stakeholder management skills
- Natural Language Processing experience is a plus
- Proven track record of launching successful AI products`;

export const mockTemplates = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean and classic layout suitable for corporate roles",
    preview: "professional-preview.png"
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with accent colors for tech roles",
    preview: "modern-preview.png"
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Minimalist approach focusing on content clarity",
    preview: "minimal-preview.png"
  }
];
