import axiosClient from "@/api/axiosClient";
import type {
  DriverActivityLogCreateRequest,
  DriverActivityLogQueryParams,
} from "./types";

const BASE_PATH = "/api/driver-activity-logs";

const driverLogService = {
  // ========================
  // GET ALL LOGS BY DRIVER ID (Safest endpoint)
  // ========================
  getByDriverId: async (
    driverId: number,
    params: DriverActivityLogQueryParams = {}
  ): Promise<any> => {
    const response = await axiosClient.get(`${BASE_PATH}/driver/${driverId}`, {
      params,
    });
    return response.data;
  },

  // ========================
  // GET LOGS BY DATE RANGE
  // Sends dates as ISO strings: "2025-01-15" for LocalDate endpoints
  // ========================
  getByDateRange: async (
    startDate: string,
    endDate: string,
    params: DriverActivityLogQueryParams = {}
  ): Promise<any> => {
    const response = await axiosClient.get(`${BASE_PATH}/date-range`, {
      params: { startDate, endDate, ...params },
    });
    return response.data;
  },

  // ========================
  // GET LOGS BY SPECIFIC DATE
  // ========================
  getByDate: async (
    logDate: string,
    params: DriverActivityLogQueryParams = {}
  ): Promise<any> => {
    const response = await axiosClient.get(`${BASE_PATH}/date/${logDate}`, {
      params,
    });
    return response.data;
  },

  // ========================
  // GET LOGS BY ACTIVITY TYPE
  // ========================
  getByActivityType: async (
    activityType: string,
    params: DriverActivityLogQueryParams = {}
  ): Promise<any> => {
    const response = await axiosClient.get(`${BASE_PATH}/type/${activityType}`, {
      params,
    });
    return response.data;
  },

  // ========================
  // GET SINGLE LOG BY ID
  // ========================
  getById: async (id: number): Promise<any> => {
    const response = await axiosClient.get(`${BASE_PATH}/${id}`);
    return response.data;
  },

  // ========================
  // CREATE LOG
  // ========================
  create: async (data: DriverActivityLogCreateRequest): Promise<any> => {
    const response = await axiosClient.post(BASE_PATH, data);
    return response.data;
  },

  // ========================
  // GET STATS
  // ========================
  getActivityCountsForDriver: async (driverId: number): Promise<any> => {
    const response = await axiosClient.get(
      `${BASE_PATH}/driver/${driverId}/stats/activity-counts`
    );
    return response.data;
  },

  getOnlineDuration: async (
    driverId: number,
    startDate: string,
    endDate: string
  ): Promise<any> => {
    const response = await axiosClient.get(
      `${BASE_PATH}/driver/${driverId}/stats/online-duration`,
      { params: { startDate, endDate } }
    );
    return response.data;
  },

  getLogCount: async (driverId: number): Promise<any> => {
    const response = await axiosClient.get(
      `${BASE_PATH}/driver/${driverId}/stats/count`
    );
    return response.data;
  },
};

export default driverLogService;