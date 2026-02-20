import axiosClient from "@/api/axiosClient";
import type {
  ApiResponse,
  VehicleOwnerResponse,
  VehicleOwnerCreateRequest,
  VehicleOwnerUpdateRequest,
  VehicleOwnerQueryParams,
} from "./types";

const BASE_PATH = "/api/vehicle-owners";

const ownerService = {
  // ========================
  // GET ALL (Paginated + Search + Filter)
  // ========================
  getAll: async (
    params: VehicleOwnerQueryParams = {}
  ): Promise<ApiResponse<VehicleOwnerResponse[]>> => {
    const queryParams: Record<string, string | number | boolean> = {};

    if (params.page !== undefined) queryParams.page = params.page;
    if (params.size !== undefined) queryParams.size = params.size;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortDir) queryParams.sortDir = params.sortDir;
    if (params.search) queryParams.search = params.search;
    if (params.isActive !== undefined) queryParams.isActive = params.isActive;

    const response = await axiosClient.get<ApiResponse<VehicleOwnerResponse[]>>(
      BASE_PATH,
      { params: queryParams }
    );
    return response.data;
  },

  // ========================
  // GET BY ID
  // ========================
  getById: async (
    id: number
  ): Promise<ApiResponse<VehicleOwnerResponse>> => {
    const response = await axiosClient.get<ApiResponse<VehicleOwnerResponse>>(
      `${BASE_PATH}/${id}`
    );
    return response.data;
  },

  // ========================
  // GET ALL ACTIVE (For dropdowns)
  // ========================
  getAllActive: async (): Promise<ApiResponse<VehicleOwnerResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<VehicleOwnerResponse[]>>(
      `${BASE_PATH}/active`
    );
    return response.data;
  },

  // ========================
  // GET BY CONTACT
  // ========================
  getByContact: async (
    contact: string
  ): Promise<ApiResponse<VehicleOwnerResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<VehicleOwnerResponse[]>>(
      `${BASE_PATH}/by-contact/${contact}`
    );
    return response.data;
  },

  // ========================
  // CREATE
  // ========================
  create: async (
    data: VehicleOwnerCreateRequest
  ): Promise<ApiResponse<VehicleOwnerResponse>> => {
    const response = await axiosClient.post<ApiResponse<VehicleOwnerResponse>>(
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
    data: VehicleOwnerUpdateRequest
  ): Promise<ApiResponse<VehicleOwnerResponse>> => {
    const response = await axiosClient.put<ApiResponse<VehicleOwnerResponse>>(
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
  ): Promise<ApiResponse<VehicleOwnerResponse>> => {
    const response = await axiosClient.patch<ApiResponse<VehicleOwnerResponse>>(
      `${BASE_PATH}/${id}/toggle-status`
    );
    return response.data;
  },

  // ========================
  // BULK DELETE
  // ========================
  bulkDelete: async (ids: number[]): Promise<void> => {
    await Promise.all(ids.map((id) => ownerService.delete(id)));
  },
};

export default ownerService;