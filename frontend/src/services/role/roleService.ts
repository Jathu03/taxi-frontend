import axiosClient from "@/api/axiosClient";
import type { RoleResponse } from "./types";

const BASE_URL = "/api/roles";

export const roleService = {
  /**
   * GET /api/roles
   * Fetches all available roles from backend
   */
  getAll: async (): Promise<RoleResponse[]> => {
    const response = await axiosClient.get<RoleResponse[]>(BASE_URL);
    return response.data;
  },
};