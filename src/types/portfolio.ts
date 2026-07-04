export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface SocialLink {
  platform: 'email' | 'github' | 'linkedin' | 'twitter' | 'website';
  url: string;
  label: string;
}

export interface PortfolioData {
  fullName: string;
  profession: string;
  avatarUrl: string;
  bio: string;
  skills: string[];
  projects: Project[];
  socialLinks: SocialLink[];
}
