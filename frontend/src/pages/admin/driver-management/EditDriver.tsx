"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import driverService from "@/services/drivers/driverService";
import vehicleService from "@/services/vehicles/vehicleService";
import companyService from "@/services/vehicle-owner/companyService";
import { userService } from "@/services/user/userService";

// --- Types ---
import type { DriverUpdateRequest } from "@/services/drivers/types";
import type { VehicleResponse } from "@/services/vehicles/types";
import type { CompanyResponse } from "@/services/vehicle-owner/types";
import type { UserResponse } from "@/services/user/types";

export default function EditDriver() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- Dropdown Data States ---
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);

  // --- Form Data State ---
  const [formData, setFormData] = useState<DriverUpdateRequest & { code: string }>({
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

  // --- Status Flags ---
  const [isBlocked, setIsBlocked] = useState(false);
  const [initialBlockedState, setInitialBlockedState] = useState(false);
  const [blockedDescription, setBlockedDescription] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // --- 1. Load Data on Mount ---
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        console.log("Loading driver details for ID:", id);

        // --- A. Fetch Dropdowns (Parallel) ---
        const [vResponse, uResponse, cResponse] = await Promise.all([
          vehicleService.getAll({ size: 1000, isActive: true }),
          userService.getAll(),
          companyService.getAllActive(),
        ]);

        // Process Vehicles
        if (vResponse && vResponse.success) {
          const list = Array.isArray(vResponse.data)
            ? vResponse.data
            : (vResponse.data as any).content || [];
          setVehicles(list);
        }

        // Process Users
        const uResAny = uResponse as any;
        let uList: UserResponse[] = [];
        if (uResAny.success && uResAny.data) {
          uList = Array.isArray(uResAny.data)
            ? uResAny.data
            : uResAny.data.content || [];
        } else if (Array.isArray(uResAny)) {
          uList = uResAny;
        }
        setUsers(uList);

        // Process Companies
        if (cResponse && cResponse.success) {
          const list = Array.isArray(cResponse.data)
            ? cResponse.data
            : (cResponse.data as any).content || [];
          setCompanies(list);
        }

        // --- B. Fetch Driver by ID ---
        const driverRes: any = await driverService.getById(Number(id));
        console.log("Driver API Response:", driverRes);

        // Extract driver data - handle ALL formats
        let d = null;

        // Format 1: { success: true, data: { id, firstName, ... } }
        if (driverRes.success && driverRes.data) {
          d = driverRes.data;
        }
        // Format 2: { data: { id, firstName, ... } } (no success field)
        else if (driverRes.data && driverRes.data.id) {
          d = driverRes.data;
        }
        // Format 3: { id, firstName, ... } (direct object)
        else if (driverRes.id) {
          d = driverRes;
        }

        if (!d) {
          throw new Error("Could not extract driver data from response");
        }

        console.log("Extracted driver:", d);

        // Map to form state
        setFormData({
          code: d.code || "",
          firstName: d.firstName || "",
          lastName: d.lastName || "",
          nic: d.nic || "",
          birthDate: d.birthDate ? d.birthDate.split("T")[0] : "",
          contactNumber: d.contactNumber || "",
          emergencyNumber: d.emergencyNumber || "",
          address: d.address || "",
          manualDispatchOnly: d.manualDispatchOnly || false,
          licenseNumber: d.licenseNumber || "",
          licenseExpiryDate: d.licenseExpiryDate ? d.licenseExpiryDate.split("T")[0] : "",
          vehicleId: d.vehicleId || undefined,
          userId: d.userId || undefined,
          companyId: d.companyId || undefined,
        });

        setIsBlocked(d.isBlocked || false);
        setInitialBlockedState(d.isBlocked || false);
        setBlockedDescription(d.blockedDescription || "");
        setIsVerified(d.isVerified || false);

      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load driver details.",
          variant: "destructive",
        });
        // DO NOT navigate away — let user see the error and use Back button
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, toast]);

  // --- Handlers ---

  const handleInputChange = (field: keyof DriverUpdateRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Build update payload (exclude 'code' since it's read-only)
      const { code, ...updatePayload } = formData;

      // 2. Send Update
      await driverService.update(Number(id), {
        ...updatePayload,
        isVerified,
      });

      // 3. Handle Block/Unblock (Only if changed)
      if (isBlocked !== initialBlockedState) {
        await driverService.toggleBlock(Number(id), {
          isBlocked: isBlocked,
          blockedDescription: isBlocked ? blockedDescription : undefined,
        });
      }

      // 4. Success
      toast({
        title: "Success",
        description: "Driver updated successfully.",
      });

      // 5. Redirect
      setTimeout(() => {
        navigate("/admin/drivers/manage");
      }, 300);

    } catch (error: any) {
      console.error("Update Error:", error);
      const msg =
        error.response?.data?.message ||
        error.data?.message ||
        error.message ||
        "Update failed";
      toast({
        title: "Update Failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Edit Driver</h1>
            <p className="text-muted-foreground">Loading driver details...</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin/drivers/manage")}>
            Back to List
          </Button>
        </div>
        <Card className="p-10">
          <div className="text-center text-muted-foreground">Loading...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit Driver</h1>
          <p className="text-muted-foreground">Update driver information</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/drivers/manage")}>
          Back to List
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Personal Details */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code (Read Only)</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isBlocked"
                    checked={isBlocked}
                    onCheckedChange={(checked) => setIsBlocked(checked as boolean)}
                  />
                  <Label htmlFor="isBlocked" className="cursor-pointer">IsBlocked</Label>
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manualDispatchOnly"
                    checked={formData.manualDispatchOnly || false}
                    onCheckedChange={(checked) =>
                      handleInputChange("manualDispatchOnly", checked)
                    }
                  />
                  <Label htmlFor="manualDispatchOnly" className="cursor-pointer">Manual Dispatch Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isVerified"
                    checked={isVerified}
                    onCheckedChange={(checked) => setIsVerified(checked as boolean)}
                  />
                  <Label htmlFor="isVerified" className="cursor-pointer">Is Verified</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Information */}
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
                  <Label htmlFor="vehicleId">Vehicle #</Label>
                  <Select
                    value={formData.vehicleId?.toString() || "none"}
                    onValueChange={(value) =>
                      handleInputChange("vehicleId", value === "none" ? undefined : Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Vehicle</SelectItem>
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id.toString()}>
                          {v.registrationNumber} {v.vehicleCode ? `(${v.vehicleCode})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userId">User</Label>
                  <Select
                    value={formData.userId?.toString() || "none"}
                    onValueChange={(value) =>
                      handleInputChange("userId", value === "none" ? undefined : Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a User Account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No User Linked</SelectItem>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id.toString()}>
                          {u.username} ({u.firstName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyId">Company</Label>
                  <Select
                    value={formData.companyId?.toString() || "none"}
                    onValueChange={(value) =>
                      handleInputChange("companyId", value === "none" ? undefined : Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Company</SelectItem>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/drivers/manage")}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Updating..." : "Update Driver"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}