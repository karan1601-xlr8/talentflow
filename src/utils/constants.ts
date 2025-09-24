import type { FeatureItem, StatItem } from '../types';

// Local Job interface for sample data
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  tags: string[];
}

// Navigation Links
export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Jobs', href: '#jobs' },
];
export const HR_NAV_LINKS = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Candidates', href: '/dashboard/candidates' },
  { label: 'Jobs', href: '/dashboard/jobs' },
  { label: 'Assessments', href: '/dashboard/assessments' },
];

// Platform Statistics
export const PLATFORM_STATS: StatItem[] = [
  { label: 'Users', value: '120k+' },
  { label: 'Companies', value: '120+' },
];

// Platform Features
export const FEATURES: FeatureItem[] = [
  {
    id: '1',
    title: 'Easy To Post Hiring',
    description: 'Create and publish job listings in minutes. Help you reach the right talent.',
    icon: 'briefcase',
  },
  {
    id: '2',
    title: 'Manage Candidates',
    description: 'Track, review, and organize. Gain full visibility into every stage of the pipeline.',
    icon: 'users',
  },
  {
    id: '3',
    title: 'Assessment Tools',
    description: 'Evaluate candidates with comprehensive assessments. Make data-driven hiring decisions.',
    icon: 'clipboard-check',
  },
];

// Sample Jobs (for demo)
export const SAMPLE_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Product Designer',
    company: 'Microsoft',
    location: 'San Francisco, United States',
    type: 'Full-time',
    salary: '$8,000/Month',
    description: 'Lead the design and process, from discovery, ideation, prototyping, and final UI & UX.',
    requirements: ['5+ years experience', 'Figma expertise', 'Design systems knowledge'],
    postedDate: '2025-01-15',
    tags: ['Full-Time', 'Senior Level'],
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Google',
    location: 'Remote',
    type: 'Remote',
    salary: '$6,500/Month',
    description: 'Build and maintain user interfaces using modern frontend technologies.',
    requirements: ['React expertise', '3+ years experience', 'TypeScript knowledge'],
    postedDate: '2025-01-14',
    tags: ['Remote', 'Mid-Level'],
  },
  {
    id: '3',
    title: 'Product Manager',
    company: 'Apple',
    location: 'New York, United States',
    type: 'Full-time',
    salary: '$7,200/Month',
    description: 'Drive product strategy and work with cross-functional teams.',
    requirements: ['Product management experience', 'Technical background', 'Leadership skills'],
    postedDate: '2025-01-13',
    tags: ['Full-Time', 'Senior Level'],
  },
];

// Company Info
export const COMPANY_INFO = {
  name: 'TalentFlow',
  tagline: 'Transform Your Hiring Process With Smarter, Faster, Data-Driven Technology',
  description: 'From sourcing to onboarding, our platform streamlines every step. Hire confidently with tools built to reduce bias and boost efficiency.',
};
