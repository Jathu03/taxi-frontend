import type { RoleResponse } from "@/services/role/types";

// ================================
// RESPONSE TYPES (FROM Backend)
// ================================

/**
 * User Response - data coming FROM backend
 * Matches Java UserResponse.java
 */
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
  roles: RoleResponse[];
  createdAt: string;
  updatedAt: string;
}

// ================================
// REQUEST TYPES (TO Backend)
// ================================

/**
 * Create User Request - data going TO backend
 * Matches Java CreateUserRequest.java
 */
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  roleIds: number[];  // IMPORTANT: Must be array of role IDs (integers)
}

/**
 * Update User Request
 * Matches Java UpdateUserRequest.java
 */
export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  roleIds: number[];
}

/**
 * Reset Password Request
 * Matches Java ResetPasswordRequest.java
 */
export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

/**
 * Login Request
 * Matches Java LoginRequest.java
 */
export interface LoginRequest {
  username: string;
  password: string;
}