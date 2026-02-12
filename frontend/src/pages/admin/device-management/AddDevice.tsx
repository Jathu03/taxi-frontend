import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AddDevice() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    deviceId: "",
    deviceType: "",
    driverAssigned: "",
    vehicleAssigned: "",
    status: "Active",
    installDate: "",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.deviceId || !formData.deviceType || !formData.installDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Device Added Successfully",
      description: `Device ${formData.deviceId} has been registered in the system.`,
    });
    
    navigate("/admin/devices/manage");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Add New Device</h1>
          <p className="text-muted-foreground mt-1">Register a new device in the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Device Information */}
        <Card>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
            <CardDescription>Enter the basic device details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deviceId">
                  Device ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="deviceId"
                  name="deviceId"
                  value={formData.deviceId}
                  onChange={handleInputChange}
                  placeholder="e.g., GPS-001"
                  required
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
                <Label htmlFor="driverAssigned">Driver Assigned</Label>
                <Input
                  id="driverAssigned"
                  name="driverAssigned"
                  value={formData.driverAssigned}
                  onChange={handleInputChange}
                  placeholder="e.g., Nimal Perera"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleAssigned">Vehicle Assigned</Label>
                <Input
                  id="vehicleAssigned"
                  name="vehicleAssigned"
                  value={formData.vehicleAssigned}
                  onChange={handleInputChange}
                  placeholder="e.g., CAB-1234"
                />
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
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-[#6330B8] hover:bg-[#6330B8]/90">
            Add Device
          </Button>
        </div>
      </form>
    </div>
  );
}
