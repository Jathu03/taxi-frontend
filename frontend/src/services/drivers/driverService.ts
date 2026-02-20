import axiosClient from "@/api/axiosClient";
import type { ApiResponse } from "@/services/vehicles/types";
import type {
  DriverResponse,
  DriverCreateRequest,
  DriverUpdateRequest,
  DriverBlockRequest,
  DriverQueryParams,
} from "./types";

const BASE_PATH = "/api/drivers";

const driverService = {
  // ========================
  // GET ALL (Paginated)
  // ========================
  getAll: async (params: DriverQueryParams = {}): Promise<any> => {
    const response = await axiosClient.get(BASE_PATH, { params });
    return response.data;
  },

  // ========================
  // GET BY ID
  // Changed return type to 'any' since backend may or may not wrap in ApiResponse
  // ========================
  getById: async (id: number): Promise<any> => {
    const response = await axiosClient.get(`${BASE_PATH}/${id}`);
    return response.data;
  },

  // ========================
  // CREATE
  // ========================
  create: async (data: DriverCreateRequest): Promise<any> => {
    const response = await axiosClient.post(BASE_PATH, data);
    return response.data;
  },

  // ========================
  // UPDATE
  // ========================
  update: async (id: number, data: DriverUpdateRequest): Promise<any> => {
    const response = await axiosClient.put(`${BASE_PATH}/${id}`, data);
    return response.data;
  },

  // ========================
  // DELETE
  // ========================
  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`${BASE_PATH}/${id}`);
  },

  // ========================
  // BLOCK/UNBLOCK
  // ========================
  toggleBlock: async (id: number, data: DriverBlockRequest): Promise<any> => {
    const endpoint = data.isBlocked ? "block" : "unblock";
    const response = await axiosClient.patch(
      `${BASE_PATH}/${id}/${endpoint}`,
      data.isBlocked ? data : {}
    );
    return response.data;
  },

  // ========================
  // ASSIGN VEHICLE
  // ========================
  assignVehicle: async (driverId: number, vehicleId: number): Promise<any> => {
    const response = await axiosClient.patch(
      `${BASE_PATH}/${driverId}/assign-vehicle`,
      null,
      { params: { vehicleId } }
    );
    return response.data;
  },
};

export default driverService;