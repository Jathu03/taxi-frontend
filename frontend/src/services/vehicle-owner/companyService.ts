
import axiosClient from "@/api/axiosClient";
import type {
  ApiResponse,
  CompanyResponse,
  CompanyCreateRequest,
  CompanyUpdateRequest,
  CompanyQueryParams,
} from "./types";

const BASE_PATH = "/api/companies";

const companyService = {
  // ========================
  // GET ALL (Paginated + Search + Filter)
  // ========================
  getAll: async (
    params: CompanyQueryParams = {}
  ): Promise<ApiResponse<CompanyResponse[]>> => {
    const queryParams: Record<string, string | number | boolean> = {};

    if (params.page !== undefined) queryParams.page = params.page;
    if (params.size !== undefined) queryParams.size = params.size;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortDir) queryParams.sortDir = params.sortDir;
    if (params.search) queryParams.search = params.search;
    if (params.isActive !== undefined) queryParams.isActive = params.isActive;

    const response = await axiosClient.get<ApiResponse<CompanyResponse[]>>(
      BASE_PATH,
      { params: queryParams }
    );
    return response.data;
  },

  // ========================
  // GET BY ID
  // ========================
  getById: async (id: number): Promise<ApiResponse<CompanyResponse>> => {
    const response = await axiosClient.get<ApiResponse<CompanyResponse>>(
      `${BASE_PATH}/${id}`
    );
    return response.data;
  },

  // ========================
  // GET BY CODE
  // ========================
  getByCode: async (code: string): Promise<ApiResponse<CompanyResponse>> => {
    const response = await axiosClient.get<ApiResponse<CompanyResponse>>(
      `${BASE_PATH}/code/${code}`
    );
    return response.data;
  },

  // ========================
  // GET ALL ACTIVE (For dropdowns)
  // ========================
  getAllActive: async (): Promise<ApiResponse<CompanyResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<CompanyResponse[]>>(
      `${BASE_PATH}/active`
    );
    return response.data;
  },

  // ========================
  // CREATE
  // ========================
  create: async (
    data: CompanyCreateRequest
  ): Promise<ApiResponse<CompanyResponse>> => {
    const response = await axiosClient.post<ApiResponse<CompanyResponse>>(
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
    data: CompanyUpdateRequest
  ): Promise<ApiResponse<CompanyResponse>> => {
    const response = await axiosClient.put<ApiResponse<CompanyResponse>>(
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
  ): Promise<ApiResponse<CompanyResponse>> => {
    const response = await axiosClient.patch<ApiResponse<CompanyResponse>>(
      `${BASE_PATH}/${id}/toggle-status`
    );
    return response.data;
  },
};

export default companyService;