"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// --- Services ---
// Ensure these paths match your actual folder structure (drivers vs driver)
import driverService from "@/services/drivers/driverService";
import vehicleService from "@/services/vehicles/vehicleService";
import companyService from "@/services/vehicle-owner/companyService";
import { userService } from "@/services/user/userService";

// --- Types ---
import type { DriverCreateRequest } from "@/services/drivers/types";
import type { VehicleResponse } from "@/services/vehicles/types";
import type { CompanyResponse } from "@/services/vehicle-owner/types";
import type { UserResponse } from "@/services/user/types";

export default function AddDriver() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // --- Dropdown Data States ---
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);

  // --- Form Data State ---
  const [formData, setFormData] = useState<DriverCreateRequest>({
    code: "",
    firstName: "",
    lastName: "",
    nic: "",
    birthDate: "",
    contactNumber: "",
    emergencyNumber: "",
    address: "",
    manualDispatchOnly: false,
    licenseNumber: "",
    licenseExpiryDate: "",
    vehicleId: undefined,
    userId: undefined,
    companyId: undefined,
  });

  // --- Extra Local State ---
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedDescription, setBlockedDescription] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // --- Fetch Dropdown Data on Mount ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching dropdown data...");

        // 1. Fetch Vehicles
        const vResponse = await vehicleService.getAll({ size: 1000, isActive: true });
        if (vResponse && vResponse.success) {
          const vehicleList = Array.isArray(vResponse.data)
            ? vResponse.data
            : (vResponse.data as any).content || [];
          setVehicles(vehicleList);
        }

        // 2. Fetch Users
        const uResponse: any = await userService.getAll();
        let userList: UserResponse[] = [];
        if (uResponse.success && uResponse.data) {
           userList = Array.isArray(uResponse.data) 
             ? uResponse.data 
             : uResponse.data.content || [];
        } else if (Array.isArray(uResponse)) {
           userList = uResponse;
        }
        setUsers(userList);

        // 3. Fetch Companies
        const cResponse = await companyService.getAllActive();
        if (cResponse && cResponse.success) {
           const companyList = Array.isArray(cResponse.data) 
             ? cResponse.data 
             : (cResponse.data as any).content || [];
           setCompanies(companyList);
        }

      } catch (error) {
        console.error("Error loading dropdown data", error);
        toast({
          title: "Connection Error",
          description: "Failed to load dropdown data.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  // --- Input Handlers ---

  const handleInputChange = (field: keyof DriverCreateRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await driverService.create(formData);
      
      // DEBUG: See what the backend actually returns
      console.log("=== CREATE RESPONSE ===", response);
      console.log("response.success:", response.success);
      console.log("response.data:", response.data);

      // Handle ALL possible response formats
      const driverData = response.data || response;
      const newDriverId = (driverData as any).id;
      const driverName = (driverData as any).firstName || formData.firstName;

      // Handle Blocking
      if (isBlocked && newDriverId) {
        try {
          await driverService.toggleBlock(newDriverId, { isBlocked: true, blockedDescription });
        } catch (blockErr) {
          console.warn("Driver created but failed to block:", blockErr);
        }
      }

      // Success Toast
      toast({
        title: "Success",
        description: `${driverName} has been added successfully.`,
      });

      // REDIRECT - No condition check, if we reach here it worked
      navigate("/admin/drivers/manage");

    } catch (error: any) {
      console.error("=== SUBMIT ERROR ===", error);
      console.error("error.response:", error.response);
      console.error("error.data:", error.data);
      console.error("error.status:", error.response?.status);

      // Check if it actually succeeded (201) but Axios threw anyway
      if (error.response?.status === 201) {
        toast({
          title: "Success",
          description: `${formData.firstName} has been added successfully.`,
        });
        navigate("/admin/drivers/manage");
        return;
      }

      const backendMessage =
        error.response?.data?.message ||
        error.data?.message ||
        error.message ||
        "Something went wrong.";

      toast({
        title: "Submission Failed",
        description: backendMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Add New Driver</h1>
          <p className="text-muted-foreground">Register a new driver in the system</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/drivers/manage")} disabled={isLoading}>
          Back to List
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* ===================== PERSONAL DETAILS ===================== */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    placeholder="e.g., DRV-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ""}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nic">NIC #</Label>
                  <Input
                    id="nic"
                    value={formData.nic || ""}
                    onChange={(e) => handleInputChange("nic", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate || ""}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact #</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyNumber">Emergency #</Label>
                  <Input
                    id="emergencyNumber"
                    value={formData.emergencyNumber || ""}
                    onChange={(e) => handleInputChange("emergencyNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
                
                {/* Flags */}
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="isBlocked"
                    checked={isBlocked}
                    onCheckedChange={(checked) => setIsBlocked(checked as boolean)}
                  />
                  <Label htmlFor="isBlocked" className="cursor-pointer font-medium">Is Blocked</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blockedDescription">Blocked Description</Label>
                  <Input
                    id="blockedDescription"
                    value={blockedDescription}
                    onChange={(e) => setBlockedDescription(e.target.value)}
                    disabled={!isBlocked}
                  />
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="manualDispatchOnly"
                    checked={formData.manualDispatchOnly || false}
                    onCheckedChange={(checked) => handleInputChange("manualDispatchOnly", checked)}
                  />
                  <Label htmlFor="manualDispatchOnly" className="cursor-pointer font-medium">Manual Dispatch Only</Label>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="isVerified"
                    checked={isVerified}
                    onCheckedChange={(checked) => setIsVerified(checked as boolean)}
                  />
                  <Label htmlFor="isVerified" className="cursor-pointer font-medium">Is Verified</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===================== DRIVER INFO ===================== */}
          <Card>
            <CardHeader>
              <CardTitle>Driver Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Licence #</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber || ""}
                    onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseExpiryDate">Licence Expiry Date</Label>
                  <Input
                    id="licenseExpiryDate"
                    type="date"
                    value={formData.licenseExpiryDate || ""}
                    onChange={(e) => handleInputChange("licenseExpiryDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Vehicle</Label>
                  <Select
                    value={formData.vehicleId?.toString() || ""}
                    onValueChange={(value) => handleInputChange("vehicleId", Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={vehicles.length > 0 ? "Select a Vehicle" : "Loading..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id.toString()}>
                          {v.registrationNumber} {v.vehicleCode ? `(${v.vehicleCode})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userId">User Account</Label>
                  <Select
                    value={formData.userId?.toString() || ""}
                    onValueChange={(value) => handleInputChange("userId", Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={users.length > 0 ? "Select a User" : "Loading..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id.toString()}>
                          {u.username} ({u.firstName} {u.lastName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyId">Company</Label>
                  <Select
                    value={formData.companyId?.toString() || ""}
                    onValueChange={(value) => handleInputChange("companyId", Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={companies.length > 0 ? "Select a Company" : "Loading..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/drivers/manage")} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Add Driver"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}