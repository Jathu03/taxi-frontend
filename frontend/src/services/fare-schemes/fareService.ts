import axiosClient from "@/api/axiosClient";
import type {
  ApiResponse,
  FareSchemeResponse,
  FareSchemeCreateRequest,
  FareSchemeUpdateRequest,
  QueryParams,
} from "./types";

const BASE_PATH = "/api/fare-schemes";

const fareService = {
  // ========================
  // GET ALL (Paginated)
  // ========================
  getAll: async (
    params: QueryParams = {}
  ): Promise<ApiResponse<FareSchemeResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<FareSchemeResponse[]>>(
      BASE_PATH,
      { params }
    );
    return response.data;
  },

  // ========================
  // GET BY ID
  // ========================
  getById: async (id: number): Promise<ApiResponse<FareSchemeResponse>> => {
    const response = await axiosClient.get<ApiResponse<FareSchemeResponse>>(
      `${BASE_PATH}/${id}`
    );
    return response.data;
  },

  // ========================
  // GET ACTIVE
  // ========================
  getActive: async (): Promise<ApiResponse<FareSchemeResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<FareSchemeResponse[]>>(
      `${BASE_PATH}/active`
    );
    return response.data;
  },

  // ========================
  // CREATE
  // ========================
  create: async (
    data: FareSchemeCreateRequest
  ): Promise<ApiResponse<FareSchemeResponse>> => {
    const response = await axiosClient.post<ApiResponse<FareSchemeResponse>>(
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
    data: FareSchemeUpdateRequest
  ): Promise<ApiResponse<FareSchemeResponse>> => {
    const response = await axiosClient.put<ApiResponse<FareSchemeResponse>>(
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
  toggleStatus: async (
    id: number
  ): Promise<ApiResponse<FareSchemeResponse>> => {
    const response = await axiosClient.patch<ApiResponse<FareSchemeResponse>>(
      `${BASE_PATH}/${id}/toggle-status`
    );
    return response.data;
  },

  // ========================
  // BULK DELETE
  // ========================
  bulkDelete: async (ids: number[]): Promise<void> => {
    await Promise.all(ids.map((id) => fareService.delete(id)));
  },
};

export default fareService;