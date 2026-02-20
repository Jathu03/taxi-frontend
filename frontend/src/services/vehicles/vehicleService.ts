import axiosClient from "@/api/axiosClient";
import type {
  ApiResponse,
  VehicleResponse,
  VehicleCreateRequest,
  VehicleUpdateRequest,
  QueryParams,
} from "./types";

const BASE_PATH = "/api/vehicles";

const vehicleService = {
  getAll: async (
    params: QueryParams = {}
  ): Promise<ApiResponse<VehicleResponse[]>> => {
   
    
    const config = {
      params: params // The key 'params' tells axios to create query string
    };
    
    console.log("🚀 Sending request to vehicleService with config:", config);
    
    const response = await axiosClient.get<ApiResponse<VehicleResponse[]>>(
      BASE_PATH,
      config
    );
    
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<VehicleResponse>> => {
    const response = await axiosClient.get<ApiResponse<VehicleResponse>>(
      `${BASE_PATH}/${id}`
    );
    return response.data;
  },

  create: async (
    data: VehicleCreateRequest
  ): Promise<ApiResponse<VehicleResponse>> => {
    const response = await axiosClient.post<ApiResponse<VehicleResponse>>(
      BASE_PATH,
      data
    );
    return response.data;
  },

  update: async (
    id: number,
    data: VehicleUpdateRequest
  ): Promise<ApiResponse<VehicleResponse>> => {
    const response = await axiosClient.put<ApiResponse<VehicleResponse>>(
      `${BASE_PATH}/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${BASE_PATH}/${id}`
    );
    return response.data;
  },
};

export default vehicleService;