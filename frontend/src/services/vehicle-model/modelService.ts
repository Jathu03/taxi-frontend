import axiosClient from "@/api/axiosClient";
import type {
  ApiResponse,
  VehicleModelResponse,
  VehicleModelCreateRequest,
  VehicleModelUpdateRequest,
  QueryParams,
} from "./types";

const BASE_PATH = "/api/vehicle-models";

const modelService = {
  // ========================
  // GET ALL (Paginated)
  // ========================
  getAll: async (
    params: QueryParams = {}
  ): Promise<ApiResponse<VehicleModelResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<VehicleModelResponse[]>>(
      BASE_PATH,
      { params }
    );
    return response.data;
  },

  // ========================
  // GET BY ID
  // ========================
  getById: async (id: number): Promise<ApiResponse<VehicleModelResponse>> => {
    const response = await axiosClient.get<ApiResponse<VehicleModelResponse>>(
      `${BASE_PATH}/${id}`
    );
    return response.data;
  },

  // ========================
  // GET BY MAKE ID
  // ========================
  getByMakeId: async (
    makeId: number
  ): Promise<ApiResponse<VehicleModelResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<VehicleModelResponse[]>>(
      `${BASE_PATH}/by-make/${makeId}`
    );
    return response.data;
  },

  // ========================
  // CREATE
  // ========================
  create: async (
    data: VehicleModelCreateRequest
  ): Promise<ApiResponse<VehicleModelResponse>> => {
    const response = await axiosClient.post<ApiResponse<VehicleModelResponse>>(
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
    data: VehicleModelUpdateRequest
  ): Promise<ApiResponse<VehicleModelResponse>> => {
    const response = await axiosClient.put<ApiResponse<VehicleModelResponse>>(
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

export default modelService;