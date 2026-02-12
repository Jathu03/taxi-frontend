import axiosClient from "@/api/axiosClient";
import type { CreateCorporateRequest, CorporateResponse } from "./types";
import { AxiosError } from "axios";

const CORPORATE_BASE = "/api/corporates";

export const corporateService = {
  /**
   * Create a new corporate client
   */
  createCorporate: async (
    data: CreateCorporateRequest
  ): Promise<CorporateResponse> => {
    try {
      const response = await axiosClient.post<CorporateResponse>(
        CORPORATE_BASE,
        data
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Failed to create corporate client";
      throw new Error(message);
    }
  },

  /**
   * Get all corporate clients
   */
  getAllCorporates: async (): Promise<CorporateResponse[]> => {
    try {
      const response = await axiosClient.get<CorporateResponse[]>(
        CORPORATE_BASE
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        "Failed to fetch corporate clients";
      throw new Error(message);
    }
  },

  /**
   * Get a single corporate client by ID
   */
  getCorporateById: async (id: number): Promise<CorporateResponse> => {
    try {
      const response = await axiosClient.get<CorporateResponse>(
        `${CORPORATE_BASE}/${id}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        "Failed to fetch corporate client";
      throw new Error(message);
    }
  },

  updateCorporate: async (
    id: number,
    data: CreateCorporateRequest
  ): Promise<CorporateResponse> => {
    try {
      const response = await axiosClient.put<CorporateResponse>(
        `${CORPORATE_BASE}/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        "Failed to update corporate client";
      throw new Error(message);
    }
  },

  deleteCorporate: async (id: number): Promise<void> => {
    try {
      await axiosClient.delete(`${CORPORATE_BASE}/${id}`);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        "Failed to delete corporate client";
      throw new Error(message);
    }
  },
};

export default corporateService;