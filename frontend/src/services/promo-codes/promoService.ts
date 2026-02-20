import axiosClient from "@/api/axiosClient";
import type {
  ApiResponse,
  PromoCodeResponse,
  PromoCodeCreateRequest,
  PromoCodeUpdateRequest,
  QueryParams,
} from "./types";

const BASE_PATH = "/api/promo-codes";

const promoService = {
  // ========================
  // GET ALL (Paginated)
  // ========================
  getAll: async (
    params: QueryParams = {}
  ): Promise<ApiResponse<PromoCodeResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<PromoCodeResponse[]>>(
      BASE_PATH,
      { params }
    );
    return response.data;
  },

  // ========================
  // GET BY ID
  // ========================
  getById: async (id: number): Promise<ApiResponse<PromoCodeResponse>> => {
    const response = await axiosClient.get<ApiResponse<PromoCodeResponse>>(
      `${BASE_PATH}/${id}`
    );
    return response.data;
  },

  // ========================
  // CREATE
  // ========================
  create: async (
    data: PromoCodeCreateRequest
  ): Promise<ApiResponse<PromoCodeResponse>> => {
    const response = await axiosClient.post<ApiResponse<PromoCodeResponse>>(
      BASE_PATH,
      data
    );
    return response.data;
  },

  // ========================
  // UPDATE
  // ========================
  update: async (
    id: number,
    data: PromoCodeUpdateRequest
  ): Promise<ApiResponse<PromoCodeResponse>> => {
    const response = await axiosClient.put<ApiResponse<PromoCodeResponse>>(
      `${BASE_PATH}/${id}`,
      data
    );
    return response.data;
  },

  // ========================
  // DELETE
  // ========================
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${BASE_PATH}/${id}`
    );
    return response.data;
  },

  // ========================
  // TOGGLE STATUS
  // ========================
  toggleStatus: async (id: number): Promise<ApiResponse<PromoCodeResponse>> => {
    const response = await axiosClient.patch<ApiResponse<PromoCodeResponse>>(
      `${BASE_PATH}/${id}/toggle-status`
    );
    return response.data;
  },

  // ========================
  // BULK DELETE
  // ========================
  bulkDelete: async (ids: number[]): Promise<void> => {
    await Promise.all(ids.map((id) => promoService.delete(id)));
  },
};

export default promoService;