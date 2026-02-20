import axiosClient from "@/api/axiosClient";
import type {
  ApiResponse,
  VehicleMakeResponse,
  VehicleMakeCreateRequest,
  VehicleMakeUpdateRequest,
  QueryParams,
} from "./types";

// Adjust this path based on your Gateway configuration
// Usually: /<service-name>/<controller-path>
const BASE_PATH = "/api/vehicle-makes";

const makeService = {
  // ========================
  // GET ALL (Paginated)
  // ========================
  getAll: async (
    params: QueryParams = {}
  ): Promise<ApiResponse<VehicleMakeResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<VehicleMakeResponse[]>>(
      BASE_PATH,
      { params }
    );
    return response.data;
  },

  // ========================
  // GET ALL (List for Dropdowns)
  // ========================
  getAllList: async (): Promise<ApiResponse<VehicleMakeResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<VehicleMakeResponse[]>>(
      `${BASE_PATH}/all`
    );
    return response.data;
  },

  // ========================
  // GET BY ID
  // ========================
  getById: async (id: number): Promise<ApiResponse<VehicleMakeResponse>> => {
    const response = await axiosClient.get<ApiResponse<VehicleMakeResponse>>(
      `${BASE_PATH}/${id}`
    );
    return response.data;
  },

  // ========================
  // CREATE
  // ========================
  create: async (
    data: VehicleMakeCreateRequest
  ): Promise<ApiResponse<VehicleMakeResponse>> => {
    const response = await axiosClient.post<ApiResponse<VehicleMakeResponse>>(
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
    data: VehicleMakeUpdateRequest
  ): Promise<ApiResponse<VehicleMakeResponse>> => {
    const response = await axiosClient.put<ApiResponse<VehicleMakeResponse>>(
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

export default makeService;