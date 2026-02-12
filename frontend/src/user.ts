export interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRequest {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  role: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}