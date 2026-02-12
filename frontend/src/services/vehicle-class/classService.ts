import axiosClient from "@/api/axiosClient";
import type{
  ApiResponse,
  VehicleClassResponse,
  VehicleClassCreateRequest,
  VehicleClassUpdateRequest,
  QueryParams,
} from "./types";

const BASE_PATH = "/api/vehicle-classes";

const classService = {
  // ========================
  // GET ALL (Paginated)
  // ========================
  getAll: async (
    params: QueryParams = {}
  ): Promise<ApiResponse<VehicleClassResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<VehicleClassResponse[]>>(
      BASE_PATH,
      { params }
    );
    return response.data;
  },

  // ========================
  // GET ACTIVE (List)
  // ========================
  getActive: async (): Promise<ApiResponse<VehicleClassResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<VehicleClassResponse[]>>(
      `${BASE_PATH}/active`
    );
    return response.data;
  },

  // ========================
  // GET BY ID
  // ========================
  getById: async (id: number): Promise<ApiResponse<VehicleClassResponse>> => {
    const response = await axiosClient.get<ApiResponse<VehicleClassResponse>>(
      `${BASE_PATH}/${id}`
    );
    return response.data;
  },

  // ========================
  // CREATE
  // ========================
  create: async (
    data: VehicleClassCreateRequest
  ): Promise<ApiResponse<VehicleClassResponse>> => {
    const response = await axiosClient.post<ApiResponse<VehicleClassResponse>>(
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
    data: VehicleClassUpdateRequest
  ): Promise<ApiResponse<VehicleClassResponse>> => {
    const response = await axiosClient.put<ApiResponse<VehicleClassResponse>>(
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
};

export default classService;