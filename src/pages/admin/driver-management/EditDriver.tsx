"use client";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function EditDriver() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    code: "",
    firstName: "",
    lastName: "",
    nic: "",
    birthDate: "",
    contactNumber: "",
    emergencyNumber: "",
    address: "",
    isBlocked: false,
    blockedDescription: "",
    manualDispatchOnly: false,
    isVerified: false,
    licenseNumber: "",
    licenseExpiryDate: "",
    vehicleNumber: "",
    user: "",
    company: "",
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockDriver = {
      code: "508 Nuwan",
      firstName: "Nuwan",
      lastName: "-",
      nic: "354335445354v",
      birthDate: "1985-01-12",
      contactNumber: "0755555797",
      emergencyNumber: "0112861111",
      address: "",
      isBlocked: false,
      blockedDescription: "",
      manualDispatchOnly: false,
      isVerified: false,
      licenseNumber: "fgdfgdgdfgdfsfsd",
      licenseExpiryDate: "2025-12-04",
      vehicleNumber: "PF 1008",
      user: "",
      company: "OTHER",
    };
    setFormData(mockDriver);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Driver Updated Successfully",
      description: `${formData.firstName} has been updated.`,
    });
    navigate("/admin/drivers/manage");
  };

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
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nic">NIC #</Label>
                  <Input
                    id="nic"
                    value={formData.nic}
                    onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact #</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyNumber">Emergency #</Label>
                  <Input
                    id="emergencyNumber"
                    value={formData.emergencyNumber}
                    onChange={(e) => setFormData({ ...formData, emergencyNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isBlocked"
                    checked={formData.isBlocked}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, isBlocked: checked as boolean })
                    }
                  />
                  <Label htmlFor="isBlocked" className="cursor-pointer">IsBlocked</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blockedDescription">Blocked Description</Label>
                  <Input
                    id="blockedDescription"
                    value={formData.blockedDescription}
                    onChange={(e) => setFormData({ ...formData, blockedDescription: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manualDispatchOnly"
                    checked={formData.manualDispatchOnly}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, manualDispatchOnly: checked as boolean })
                    }
                  />
                  <Label htmlFor="manualDispatchOnly" className="cursor-pointer">Manual Dispatch Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isVerified"
                    checked={formData.isVerified}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, isVerified: checked as boolean })
                    }
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
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseExpiryDate">Licence Expiry Date</Label>
                  <Input
                    id="licenseExpiryDate"
                    type="date"
                    value={formData.licenseExpiryDate}
                    onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle #</Label>
                  <Input
                    id="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user">User</Label>
                  <Select
                    value={formData.user}
                    onValueChange={(value) => setFormData({ ...formData, user: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a User Account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">User Account 1</SelectItem>
                      <SelectItem value="user2">User Account 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Select
                    value={formData.company}
                    onValueChange={(value) => setFormData({ ...formData, company: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASONS">CASONS</SelectItem>
                      <SelectItem value="OTHER">OTHER</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/drivers/manage")}>
              Cancel
            </Button>
            <Button type="submit">Update Driver</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
