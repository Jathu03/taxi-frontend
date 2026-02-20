import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { userService } from "@/services/user/userService";
import { roleService } from "@/services/role/roleService";
import type { RoleResponse } from "@/services/role/types";

export default function AddUser() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loadingRoles, setLoadingRoles] = useState(true);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [availableRoles, setAvailableRoles] = useState<RoleResponse[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<number>>(
    new Set()
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  // Fetch roles on mount
  const fetchRoles = useCallback(async () => {
    try {
      setLoadingRoles(true);
      setRoleError(null);
      const roles = await roleService.getAll();
      console.log("Roles fetched:", roles);
      setAvailableRoles(roles);
      if (roles.length === 0) {
        setRoleError("No roles found. Please add roles to database first.");
      }
    } catch (err: any) {
      console.error("Failed to fetch roles:", err);
      setRoleError(
        err?.response?.status === 404
          ? "Roles endpoint not found. Check backend."
          : err?.message === "Network Error"
          ? "Cannot connect to server. Is backend running?"
          : `Failed to load roles: ${err?.message}`
      );
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (roleId: number, checked: boolean) => {
    setSelectedRoleIds((prev) => {
      const updated = new Set(prev);
      if (checked) {
        updated.add(roleId);
      } else {
        updated.delete(roleId);
      }
      return updated;
    });
  };

  // Form submit - NO native HTML validation, we handle it ourselves
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("=== FORM SUBMIT ===");

    // Validation 1: Required fields
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.userName.trim() ||
      !formData.email.trim() ||
      !formData.phoneNumber.trim()
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validation 2: Password match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    // Validation 3: Password length
    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    // Validation 4: At least one role
    if (selectedRoleIds.size === 0) {
      toast({
        title: "Error",
        description: "Please select at least one role.",
        variant: "destructive",
      });
      return;
    }

    // Build payload matching backend CreateUserRequest.java
    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      username: formData.userName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      roleIds: Array.from(selectedRoleIds),
    };

    console.log("Payload:", JSON.stringify(payload, null, 2));

    try {
      setSubmitting(true);
      const createdUser = await userService.create(payload);
      console.log("User created:", createdUser);

      toast({
        title: "Success",
        description: "User has been created successfully.",
      });
      navigate("/admin/users/manage");
    } catch (err: any) {
      console.error("Create error:", err);
      console.error("Response:", err?.response?.data);

      let errorMessage = "Failed to create user.";
      if (err?.response?.data) {
        const data = err.response.data;
        if (typeof data === "string") errorMessage = data;
        else if (data.message) errorMessage = data.message;
        else if (data.error) errorMessage = data.error;
        else if (Array.isArray(data)) errorMessage = data.join(", ");
        else errorMessage = JSON.stringify(data);
      } else if (err?.message) {
        errorMessage = err.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loadingRoles) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
        <span className="ml-3 text-lg text-muted-foreground">
          Loading roles...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">
            Create New User
          </h1>
          <p className="text-muted-foreground mt-1">
            Add a new user to the system
          </p>
        </div>
      </div>

      {/* Role Error Banner */}
      {roleError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">{roleError}</p>
            </div>
            <Button
              onClick={fetchRoles}
              variant="outline"
              className="mt-4"
              size="sm"
            >
              Retry Loading Roles
            </Button>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Enter the user's basic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userName">
                  User Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  placeholder="e.g., nilu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 0771234567"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Set the user's password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roles */}
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Select the user's role(s)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableRoles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableRoles.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoleIds.has(role.id)}
                      onCheckedChange={(checked) =>
                        handleRoleChange(role.id, checked as boolean)
                      }
                      disabled={!role.isActive}
                    />
                    <Label
                      htmlFor={`role-${role.id}`}
                      className="cursor-pointer font-normal"
                    >
                      {role.roleName}
                      {role.description && (
                        <span className="text-muted-foreground ml-1 text-sm">
                          ({role.description})
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No roles available.</p>
                <p className="text-sm mt-2">
                  Please add roles to the database first.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/users/manage")}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#6330B8] hover:bg-[#6330B8]/90"
            disabled={submitting || availableRoles.length === 0}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create User"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}