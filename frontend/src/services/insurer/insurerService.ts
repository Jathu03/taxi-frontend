import axiosClient from "@/api/axiosClient";

export interface InsurerResponse {
    id: number;
    name: string;
    isActive: boolean;
}

export interface InsurerCreateRequest {
    name: string;
    isActive: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const BASE_PATH = "api/insurers";

const insurerService = {
    getActive: async (): Promise<ApiResponse<InsurerResponse[]>> => {
        const response = await axiosClient.get<ApiResponse<InsurerResponse[]>>(
            `${BASE_PATH}/active`
        );
        return response.data;
    },

    create: async (
        data: InsurerCreateRequest
    ): Promise<ApiResponse<InsurerResponse>> => {
        const response = await axiosClient.post<ApiResponse<InsurerResponse>>(
            BASE_PATH,
            data
        );
        return response.data;
    },
};

export default insurerService;
