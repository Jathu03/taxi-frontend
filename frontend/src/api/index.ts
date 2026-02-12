import axios from 'axios';  

const API_BASE_URL = 'http://localhost:8081/api/users';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roles: string[];  
}

export interface CreateUserRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  roles: string[];
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roles: string[];
}

export const createUser = async (userData: CreateUserRequest): Promise<UserResponse> => {
  const response = await axios.post(API_BASE_URL, userData);
  return response.data;
};

export const getUsers = async (filterType?: string, searchTerm?: string): Promise<User[]> => {
  const params = new URLSearchParams();
  if (filterType) params.append('filterType', filterType);
  if (searchTerm) params.append('searchTerm', searchTerm);
  const response = await axios.get(`${API_BASE_URL}?${params}`);
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};



export const updateUser = async (id: number, userData: any): Promise<User> => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};

export const resetPassword = async (id: number, newPassword: string): Promise<void> => {
  await axios.put(`${API_BASE_URL}/${id}/reset-password`, { password: newPassword });
};