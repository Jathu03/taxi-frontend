import axiosClient from "@/api/axiosClient";
import type {
  DeviceCreateRequest,
  DeviceUpdateRequest,
  DeviceResponse,
  DeviceQueryParams,
} from "./types";

const BASE_PATH = "/api/devices";

const deviceService = {
  // ========================
  // GET ALL (Paginated)
  // ========================
  getAll: async (params: DeviceQueryParams = {}): Promise<any> => {
    const response = await axiosClient.get(BASE_PATH, { params });
    return response.data;
  },

  // ========================
  // GET BY ID
  // ========================
  getById: async (id: number): Promise<any> => {
    const response = await axiosClient.get(`${BASE_PATH}/${id}`);
    return response.data;
  },

  // ========================
  // CREATE
  // ========================
  create: async (data: DeviceCreateRequest): Promise<any> => {
    const response = await axiosClient.post(BASE_PATH, data);
    return response.data;
  },

  // ========================
  // UPDATE
  // ========================
  update: async (id: number, data: DeviceUpdateRequest): Promise<any> => {
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
  // UPDATE STATUS
  // ========================
  updateStatus: async (id: number, status: string): Promise<any> => {
    const response = await axiosClient.patch(`${BASE_PATH}/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },
};

export default deviceService;