"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// --- Services ---
import deviceService from "@/services/devices/deviceService";
import driverService from "@/services/drivers/driverService";
import vehicleService from "@/services/vehicles/vehicleService";

// --- Types ---
import type { DeviceUpdateRequest } from "@/services/devices/types";
import type { DriverResponse } from "@/services/drivers/types";
import type { VehicleResponse } from "@/services/vehicles/types";

export default function EditDevice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- Dropdown Data ---
  const [drivers, setDrivers] = useState<DriverResponse[]>([]);
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);

  // --- Form Data ---
  // We keep 'deviceId' for display, but it is not editable
  const [formData, setFormData] = useState<DeviceUpdateRequest & { deviceId: string }>({
    deviceId: "", // Read-only
    deviceType: "",
    deviceModel: "",
    serialNumber: "",
    simNumber: "",
    simProvider: "",
    vehicleId: undefined,
    driverId: undefined,
    status: "Active",
    installDate: "",
    notes: "",
  });

  // --- 1. Load Data on Mount ---
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        console.log("Loading device data...");

        // --- A. Fetch Dropdowns (Parallel) ---
        const [driverRes, vehicleRes] = await Promise.all([
          driverService.getAll({ size: 1000, isActive: true }),
          vehicleService.getAll({ size: 1000, isActive: true }),
        ]);

        // Process Drivers
        if (driverRes) {
          const dList = Array.isArray(driverRes) 
            ? driverRes 
            : (driverRes as any).content || (driverRes as any).data || [];
          setDrivers(dList);
        }

        // Process Vehicles
        if (vehicleRes) {
          const vList = Array.isArray(vehicleRes)
            ? vehicleRes
            : (vehicleRes as any).content || (vehicleRes as any).data || [];
          setVehicles(vList);
        }

        // --- B. Fetch Device by ID ---
        const deviceRes: any = await deviceService.getById(Number(id));
        
        // Robust data extraction (Direct vs Wrapper)
        let d = null;
        if (deviceRes.success && deviceRes.data) {
          d = deviceRes.data;
        } else if (deviceRes.id) {
          d = deviceRes;
        } else if (deviceRes.data && deviceRes.data.id) {
          d = deviceRes.data;
        }

        if (d) {
          // Map to Form State
          setFormData({
            deviceId: d.deviceId, // Read-only
            deviceType: d.deviceType || "",
            deviceModel: d.deviceModel || "",
            serialNumber: d.serialNumber || "",
            simNumber: d.simNumber || "",
            simProvider: d.simProvider || "",
            vehicleId: d.vehicleId || undefined,
            driverId: d.driverId || undefined,
            status: d.status || "Active",
            // Format YYYY-MM-DD
            installDate: d.installDate ? d.installDate.split("T")[0] : "", 
            notes: d.notes || "",
          });
        } else {
          throw new Error("Device not found");
        }

      } catch (error) {
        console.error("Failed to load data:", error);
        toast({
          title: "Error",
          description: "Failed to load device details.",
          variant: "destructive",
        });
        navigate("/admin/devices/manage");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, navigate, toast]);

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name.endsWith("Id") ? (value === "none" ? undefined : Number(value)) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Separate read-only fields from payload
      const { deviceId, ...updatePayload } = formData;

      // 2. Call API
      await deviceService.update(Number(id), updatePayload);

      toast({
        title: "Success",
        description: `Device ${formData.deviceId} updated successfully.`,
      });

      // 3. Force Redirect
      setTimeout(() => {
        navigate("/admin/devices/manage");
      }, 300);

    } catch (error: any) {
      console.error("Update error:", error);
      const msg = error.response?.data?.message || "Failed to update device.";
      
      toast({
        title: "Update Failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Edit Device</h1>
          <p className="text-muted-foreground mt-1">Update device information</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/devices/manage")}>
          Back to List
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Device Information */}
        <Card>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
            <CardDescription>Basic device details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deviceId">Device ID (Read Only)</Label>
                <Input
                  id="deviceId"
                  value={formData.deviceId}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceType">
                  Device Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.deviceType}
                  onValueChange={(value) => handleSelectChange("deviceType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GPS Tracker">GPS Tracker</SelectItem>
                    <SelectItem value="Meter">Meter</SelectItem>
                    <SelectItem value="Tablet">Tablet</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="Dashcam">Dashcam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="installDate">
                  Install Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="installDate"
                  name="installDate"
                  type="date"
                  value={formData.installDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deviceModel">Device Model</Label>
                <Input
                  id="deviceModel"
                  name="deviceModel"
                  value={formData.deviceModel}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connectivity Details */}
        <Card>
          <CardHeader>
            <CardTitle>Connectivity</CardTitle>
            <CardDescription>SIM and Network details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="simNumber">SIM Number</Label>
                <Input
                  id="simNumber"
                  name="simNumber"
                  value={formData.simNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="simProvider">SIM Provider</Label>
                <Input
                  id="simProvider"
                  name="simProvider"
                  value={formData.simProvider}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Information</CardTitle>
            <CardDescription>Assign device to driver and vehicle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="driverId">Driver Assigned</Label>
                <Select
                  value={formData.driverId?.toString() || "none"}
                  onValueChange={(value) => handleSelectChange("driverId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Driver Assigned</SelectItem>
                    {drivers.map((d) => (
                      <SelectItem key={d.id} value={d.id.toString()}>
                        {d.firstName} {d.lastName} ({d.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleId">Vehicle Assigned</Label>
                <Select
                  value={formData.vehicleId?.toString() || "none"}
                  onValueChange={(value) => handleSelectChange("vehicleId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Vehicle Assigned</SelectItem>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id.toString()}>
                        {v.registrationNumber} ({v.vehicleCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>Any additional information about the device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full min-h-[100px] px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                placeholder="Enter any additional notes about the device..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/devices/manage")}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-[#6330B8] hover:bg-[#6330B8]/90" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              "Update Device"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}