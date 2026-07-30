import { http } from "@/lib/api/http";
import type {
  Portfolio,
  PortfolioListApiResponse,
  PaginatedResponse,
} from "@/types/portfolio";

export const portfolioService = {
  getPortfolios: async (
    page: number = 1,
    pageSize: number = 5,
  ): Promise<PaginatedResponse<Portfolio>> => {
    const response = await http.get<PortfolioListApiResponse>(
      `/api/portfolios?page=${page}&limit=${pageSize}`,
    );

    return {
      data: response.data.items,
      meta: {
        page: response.data.page,
        pageSize: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages,
      },
    };
  },

  getPortfolioById: async (id: string): Promise<Portfolio> => {
    const response = await http.get<{
      success: boolean;
      message: string;
      data: Portfolio;
    }>(`/api/portfolios/${id}`);

    return response.data;
  },

  deletePortfolio: async (id: string): Promise<void> => {
    await http.delete(`/api/portfolios/${id}`);
  },
};
