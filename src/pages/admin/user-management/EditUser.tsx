import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  // Mock data - in real app, fetch based on id
  const [formData, setFormData] = useState({
    userName: "Dj",
    email: "judeferdinands585@gmail.com",
    firstName: "cj",
    lastName: "-",
    phoneNumber: "0726208396",
    roles: {
      accountant: false,
      administrator: false,
      callCenterAgent: false,
      corporate: false,
      driver: false,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [role]: checked,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted:", formData);

    toast({
      title: "Success",
      description: "User has been updated successfully.",
    });

    navigate("/admin/users/manage");
  };

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
                <Label htmlFor="userName">
                  User Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  required
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
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
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
                  required
                />
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accountant"
                  checked={formData.roles.accountant}
                  onCheckedChange={(checked) => handleRoleChange("accountant", checked as boolean)}
                />
                <Label htmlFor="accountant" className="cursor-pointer font-normal">
                  Accountant
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="administrator"
                  checked={formData.roles.administrator}
                  onCheckedChange={(checked) => handleRoleChange("administrator", checked as boolean)}
                />
                <Label htmlFor="administrator" className="cursor-pointer font-normal">
                  Administrator
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="callCenterAgent"
                  checked={formData.roles.callCenterAgent}
                  onCheckedChange={(checked) => handleRoleChange("callCenterAgent", checked as boolean)}
                />
                <Label htmlFor="callCenterAgent" className="cursor-pointer font-normal">
                  CallCenterAgent
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="corporate"
                  checked={formData.roles.corporate}
                  onCheckedChange={(checked) => handleRoleChange("corporate", checked as boolean)}
                />
                <Label htmlFor="corporate" className="cursor-pointer font-normal">
                  Corporate
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="driver"
                  checked={formData.roles.driver}
                  onCheckedChange={(checked) => handleRoleChange("driver", checked as boolean)}
                />
                <Label htmlFor="driver" className="cursor-pointer font-normal">
                  Driver
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/users/manage")}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-[#6330B8] hover:bg-[#6330B8]/90">
            Update User
          </Button>
        </div>
      </form>
    </div>
  );
}
