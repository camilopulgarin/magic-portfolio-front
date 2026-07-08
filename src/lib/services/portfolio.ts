import type { Portfolio, PaginatedResponse } from '@/types/portfolio';

const mockPortfolios: Portfolio[] = [
  {
    id: '1',
    name: 'Mi Portafolio Creativo',
    template: 'creative',
    status: 'published',
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-07T14:30:00Z',
    publicUrl: '/portfolio/mi-portafolio-creativo',
  },
  {
    id: '2',
    name: 'CV Profesional',
    template: 'formal',
    status: 'published',
    createdAt: '2026-06-15T08:00:00Z',
    updatedAt: '2026-07-05T09:15:00Z',
    publicUrl: '/portfolio/cv-profesional',
  },
  {
    id: '3',
    name: 'Portafolio Draft',
    template: 'creative',
    status: 'draft',
    createdAt: '2026-07-07T16:00:00Z',
    updatedAt: '2026-07-07T16:00:00Z',
  },
  {
    id: '4',
    name: 'Portfolio Designer',
    template: 'creative',
    status: 'published',
    createdAt: '2026-06-20T12:00:00Z',
    updatedAt: '2026-07-04T18:45:00Z',
    publicUrl: '/portfolio/portfolio-designer',
  },
  {
    id: '5',
    name: 'CV Ingeniero de Software',
    template: 'formal',
    status: 'published',
    createdAt: '2026-05-10T09:00:00Z',
    updatedAt: '2026-07-03T11:20:00Z',
    publicUrl: '/portfolio/cv-ingeniero-software',
  },
  {
    id: '6',
    name: 'Portafolio Fotógrafo',
    template: 'creative',
    status: 'draft',
    createdAt: '2026-07-02T14:00:00Z',
    updatedAt: '2026-07-02T14:00:00Z',
  },
  {
    id: '7',
    name: 'CV Arquitecto',
    template: 'formal',
    status: 'published',
    createdAt: '2026-04-25T10:30:00Z',
    updatedAt: '2026-07-01T16:00:00Z',
    publicUrl: '/portfolio/cv-arquitecto',
  },
  {
    id: '8',
    name: 'Portfolio Marketing Digital',
    template: 'creative',
    status: 'published',
    createdAt: '2026-06-05T08:15:00Z',
    updatedAt: '2026-06-30T09:30:00Z',
    publicUrl: '/portfolio/marketing-digital',
  },
  {
    id: '9',
    name: 'CV Diseñador UX',
    template: 'formal',
    status: 'published',
    createdAt: '2026-05-18T11:00:00Z',
    updatedAt: '2026-06-28T14:45:00Z',
    publicUrl: '/portfolio/cv-disenador-ux',
  },
  {
    id: '10',
    name: 'Portafolio Emprendedor',
    template: 'creative',
    status: 'draft',
    createdAt: '2026-07-06T10:00:00Z',
    updatedAt: '2026-07-06T10:00:00Z',
  },
  {
    id: '11',
    name: 'CV Científico de Datos',
    template: 'formal',
    status: 'published',
    createdAt: '2026-04-12T13:00:00Z',
    updatedAt: '2026-06-25T08:20:00Z',
    publicUrl: '/portfolio/cv-cientifico-datos',
  },
  {
    id: '12',
    name: 'Portfolio Freelancer',
    template: 'creative',
    status: 'published',
    createdAt: '2026-06-01T09:45:00Z',
    updatedAt: '2026-06-22T17:10:00Z',
    publicUrl: '/portfolio/freelancer',
  },
  {
    id: '13',
    name: 'CV Project Manager',
    template: 'formal',
    status: 'published',
    createdAt: '2026-05-22T14:30:00Z',
    updatedAt: '2026-06-20T10:00:00Z',
    publicUrl: '/portfolio/cv-project-manager',
  },
  {
    id: '14',
    name: 'Portafolio Artista Digital',
    template: 'creative',
    status: 'draft',
    createdAt: '2026-07-05T15:00:00Z',
    updatedAt: '2026-07-05T15:00:00Z',
  },
  {
    id: '15',
    name: 'CV DevOps Engineer',
    template: 'formal',
    status: 'published',
    createdAt: '2026-04-30T10:00:00Z',
    updatedAt: '2026-06-18T12:30:00Z',
    publicUrl: '/portfolio/cv-devops',
  },
  {
    id: '16',
    name: 'Portfolio Startup',
    template: 'creative',
    status: 'published',
    createdAt: '2026-06-10T08:00:00Z',
    updatedAt: '2026-06-15T14:00:00Z',
    publicUrl: '/portfolio/startup',
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const portfolioService = {
  getPortfolios: async (
    page: number = 1,
    pageSize: number = 5
  ): Promise<PaginatedResponse<Portfolio>> => {
    await delay(500);
    const sorted = [...mockPortfolios].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = sorted.slice(start, end);

    return {
      data: paginatedData,
      meta: {
        page,
        pageSize,
        total: sorted.length,
        totalPages: Math.ceil(sorted.length / pageSize),
      },
    };
  },

  deletePortfolio: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockPortfolios.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Portafolio no encontrado');
    }
    mockPortfolios.splice(index, 1);
  },
};
