import axiosClient from "@/api/axiosClient";
import type { 
  CreateCorporateRequest, 
  CorporateResponse, 
  AssignCorporateUserRequest,
  UpdateCorporateUserRequest,
  CorporateUserResponse,
  UserSimpleResponse,
  CorporateVehicleClassResponse,
} from "./types";

const CORPORATE_BASE = "/api/corporates";

export const corporateService = {
  // ==================== CORPORATE CRUD ====================

  getAllCorporates: async (): Promise<CorporateResponse[]> => {
    const response = await axiosClient.get<CorporateResponse[]>(CORPORATE_BASE);
    return response.data;
  },

  getCorporateById: async (id: number): Promise<CorporateResponse> => {
    const response = await axiosClient.get<CorporateResponse>(`${CORPORATE_BASE}/${id}`);
    return response.data;
  },

  createCorporate: async (data: CreateCorporateRequest): Promise<CorporateResponse> => {
    const response = await axiosClient.post<CorporateResponse>(CORPORATE_BASE, data);
    return response.data;
  },

  updateCorporate: async (id: number, data: any): Promise<CorporateResponse> => {
    const response = await axiosClient.put<CorporateResponse>(`${CORPORATE_BASE}/${id}`, data);
    return response.data;
  },

  deleteCorporate: async (id: number): Promise<void> => {
    await axiosClient.delete(`${CORPORATE_BASE}/${id}`);
  },

  // ==================== USER ASSIGNMENT METHODS ====================

  getAvailableUsers: async (): Promise<UserSimpleResponse[]> => {
    const response = await axiosClient.get<UserSimpleResponse[]>(`${CORPORATE_BASE}/users/available`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getCorporateUsers: async (corporateId: number): Promise<CorporateUserResponse[]> => {
    const response = await axiosClient.get<CorporateUserResponse[]>(`${CORPORATE_BASE}/${corporateId}/users`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getSingleCorporateUser: async (
    corporateId: number, 
    userId: number
  ): Promise<CorporateUserResponse> => {
    const response = await axiosClient.get<CorporateUserResponse>(
      `${CORPORATE_BASE}/${corporateId}/users/${userId}`
    );
    return response.data;
  },

  assignUserToCorporate: async (
    corporateId: number, 
    data: AssignCorporateUserRequest
  ): Promise<CorporateUserResponse> => {
    const response = await axiosClient.post<CorporateUserResponse>(
      `${CORPORATE_BASE}/${corporateId}/users`, 
      data
    );
    return response.data;
  },

  updateCorporateUser: async (
    corporateId: number, 
    userId: number, 
    data: UpdateCorporateUserRequest
  ): Promise<CorporateUserResponse> => {
    const response = await axiosClient.put<CorporateUserResponse>(
      `${CORPORATE_BASE}/${corporateId}/users/${userId}`, 
      data
    );
    return response.data;
  },

  toggleUserStatus: async (
    corporateId: number, 
    userId: number
  ): Promise<CorporateUserResponse> => {
    const response = await axiosClient.patch<CorporateUserResponse>(
      `${CORPORATE_BASE}/${corporateId}/users/${userId}/toggle`
    );
    return response.data;
  },

  removeUserFromCorporate: async (
    corporateId: number, 
    userId: number
  ): Promise<void> => {
    await axiosClient.delete(`${CORPORATE_BASE}/${corporateId}/users/${userId}`);
  },

  // ==================== VEHICLE CLASS METHODS ====================

  /**
   * Get vehicle classes for a corporate.
   * Uses getCorporateById and returns only vehicleClasses.
   */
  getCorporateVehicleClasses: async (
    corporateId: number
  ): Promise<CorporateVehicleClassResponse[]> => {
    const corpRes = await axiosClient.get<CorporateResponse>(`${CORPORATE_BASE}/${corporateId}`);
    const corp = corpRes.data;
    return Array.isArray(corp.vehicleClasses) ? corp.vehicleClasses : [];
  },

  /**
   * Toggle enable/disable of a specific corporate-vehicle-class mapping.
   * Backend endpoint:
   *  PATCH /api/corporates/{corporateId}/vehicle-classes/{mappingId}/toggle
   */
    toggleCorporateVehicleClass: async (
    corporateId: number,
    masterClassId: number // Changed from mappingId
  ): Promise<CorporateVehicleClassResponse> => {
    // URL uses master class ID now
    const response = await axiosClient.patch<CorporateVehicleClassResponse>(
      `${CORPORATE_BASE}/${corporateId}/vehicle-classes/${masterClassId}/toggle`
    );
    return response.data;
  },
};

export default corporateService;