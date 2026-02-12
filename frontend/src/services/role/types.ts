/**
 * Role Response - data coming FROM backend
 * Matches Java RoleResponse.java
 */
export interface RoleResponse {
  id: number;
  roleName: string;
  description: string;
  isActive: boolean;
}