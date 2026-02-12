import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

// Import Services
import { userService } from "@/services/user/userService";
import { roleService } from "@/services/role/roleService";
import type { RoleResponse } from "@/services/role/types";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL (e.g., /edit/5)
  const { toast } = useToast();

  // State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data State
  const [availableRoles, setAvailableRoles] = useState<RoleResponse[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<number>>(new Set());

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    isActive: true,
  });

  // 1. Fetch User and Roles on Component Mount
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!id) throw new Error("Invalid User ID");

      // Fetch both User and Roles in parallel
      const [userData, rolesData] = await Promise.all([
        userService.getById(Number(id)),
        roleService.getAll(),
      ]);

      console.log("User Fetched:", userData);
      console.log("Roles Fetched:", rolesData);

      // Populate Form
      setFormData({
        userName: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        isActive: userData.isActive,
      });

      // Populate Selected Roles
      // We map the user's existing roles to a Set of IDs
      const existingRoleIds = new Set(userData.roles.map((r) => r.id));
      setSelectedRoleIds(existingRoleIds);

      // Set Available Roles for checkboxes
      setAvailableRoles(rolesData);

    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(
        err?.response?.data?.message || 
        err?.message || 
        "Failed to load user data."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Role Checkbox Change
  const handleRoleChange = (roleId: number, checked: boolean) => {
    setSelectedRoleIds((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(roleId);
      } else {
        newSet.delete(roleId);
      }
      return newSet;
    });
  };

  // Handle IsActive Checkbox
  const handleActiveChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
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

    if (selectedRoleIds.size === 0) {
      toast({
        title: "Error",
        description: "User must have at least one role.",
        variant: "destructive",
      });
      return;
    }

    // Prepare Payload
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.userName, // Backend expects 'username'
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      isActive: formData.isActive,
      roleIds: Array.from(selectedRoleIds), // Convert Set to Array
    };

    console.log("Updating User:", payload);

    try {
      setSubmitting(true);
      
      await userService.update(Number(id), payload);

      toast({
        title: "Success",
        description: "User has been updated successfully.",
      });

      navigate("/admin/users/manage");
    } catch (err: any) {
      console.error("Update failed:", err);
      
      let errorMessage = "Failed to update user.";
      if (err?.response?.data) {
        const data = err.response.data;
        if (typeof data === "string") errorMessage = data;
        else if (data.message) errorMessage = data.message;
        else if (data.error) errorMessage = data.error;
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

  // Render Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
        <span className="ml-3 text-lg text-muted-foreground">Loading user data...</span>
      </div>
    );
  }

  // Render Error State
  if (error) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-900 mb-2">Error Loading User</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <Button onClick={() => navigate("/admin/users/manage")} variant="outline">
              Back to Users
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Edit User {formData.firstName}</h1>
          <p className="text-muted-foreground mt-1">Update user information (ID: {id})</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Update the user's basic information</CardDescription>
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
                />
              </div>

              {/* Active Status Toggle */}
              <div className="space-y-2 flex flex-col justify-end">
                 <div className="flex items-center space-x-2 border p-3 rounded-md bg-white">
                    <Checkbox 
                        id="isActive" 
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleActiveChange(checked as boolean)}
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                        Account Active Status
                    </Label>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roles */}
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Update the user's role(s)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableRoles.length > 0 ? availableRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={selectedRoleIds.has(role.id)}
                    onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                    disabled={!role.isActive}
                  />
                  <Label htmlFor={`role-${role.id}`} className="cursor-pointer font-normal">
                    {role.roleName}
                  </Label>
                </div>
              )) : (
                <p className="text-muted-foreground">No roles available</p>
              )}
            </div>
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
          <Button type="submit" className="bg-[#6330B8] hover:bg-[#6330B8]/90" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update User"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}