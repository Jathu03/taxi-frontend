"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function AddDriver() {
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
    company: "CASONS",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Driver Added Successfully",
      description: `${formData.firstName} has been added to the system.`,
    });
    navigate("/admin/drivers/manage");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Add New Driver</h1>
          <p className="text-muted-foreground">Register a new driver in the system</p>
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
                    placeholder="12/04/2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle #</Label>
                  <Select
                    value={formData.vehicleNumber}
                    onValueChange={(value) => setFormData({ ...formData, vehicleNumber: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CAB-1234">CAB-1234</SelectItem>
                      <SelectItem value="CAB-5678">CAB-5678</SelectItem>
                      <SelectItem value="PF-1008">PF-1008</SelectItem>
                      <SelectItem value="CAQ-8543">CAQ-8543</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="user3">User Account 3</SelectItem>
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
            <Button type="submit">Add Driver</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
