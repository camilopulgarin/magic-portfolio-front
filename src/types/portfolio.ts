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

export interface Portfolio {
  id: string;
  name: string;
  template: 'creative' | 'formal';
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  publicUrl?: string;
}

export interface PortfolioListResponse {
  data: Portfolio[];
  total: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
