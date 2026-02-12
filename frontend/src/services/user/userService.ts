import axiosClient from "@/api/axiosClient";
import type {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
} from "./types";

const BASE_URL = "/api/users";

export const userService = {
  /**
   * GET /api/users
   * Fetch all users
   */
  getAll: async (): Promise<UserResponse[]> => {
    const response = await axiosClient.get<UserResponse[]>(BASE_URL);
    return response.data;
  },

  /**
   * GET /api/users/:id
   * Fetch single user by ID
   */
  getById: async (id: number): Promise<UserResponse> => {
    const response = await axiosClient.get<UserResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * GET /api/users/search
   * Search users
   */
  search: async (filterType: string, searchTerm: string): Promise<UserResponse[]> => {
    const response = await axiosClient.get<UserResponse[]>(`${BASE_URL}/search`, {
      params: { filterType, searchTerm },
    });
    return response.data;
  },

  /**
   * POST /api/users
   * Create new user
   */
  create: async (data: CreateUserRequest): Promise<UserResponse> => {
    const response = await axiosClient.post<UserResponse>(BASE_URL, data);
    return response.data;
  },

  /**
   * PUT /api/users/:id
   * Update existing user
   */
  update: async (id: number, data: UpdateUserRequest): Promise<UserResponse> => {
    const response = await axiosClient.put<UserResponse>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * PUT /api/users/:id/reset-password
   * Reset user password
   */
  resetPassword: async (id: number, data: ResetPasswordRequest): Promise<void> => {
    await axiosClient.put(`${BASE_URL}/${id}/reset-password`, data);
  },

  /**
   * DELETE /api/users/:id
   * Delete user
   */
  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`${BASE_URL}/${id}`);
  },
};