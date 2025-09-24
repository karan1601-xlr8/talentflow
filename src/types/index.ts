  
  // UI Component Props
  export interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }
  
  export interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'sm' | 'md' | 'lg';
  }
  
  // Section Props
  export interface FeatureItem {
    id: string;
    title: string;
    description: string;
    icon: string;
  }
  
  export interface StatItem {
    label: string;
    value: string;
  }
  