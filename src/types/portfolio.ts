export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface SocialLink {
  platform: "email" | "github" | "linkedin" | "twitter" | "website";
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
  slug: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  publicUrl: string | null;
}

export interface PortfolioListApiResponse {
  success: boolean;
  message: string;
  data: {
    items: Portfolio[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
