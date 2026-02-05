import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { createUser } from "@/api/index";


export default function AddUser() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
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

  /** const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    console.log("Form submitted:", formData);

    toast({
      title: "Success",
      description: "User has been created successfully.",
    });

    navigate("/admin/users/manage");
  }; */


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    const selectedRoles = Object.entries(formData.roles)
      .filter(([_, v]) => v)
      .map(([k]) => {
        const map: any = {
          accountant: "ACCOUNTANT",
          administrator: "ADMINISTRATOR",
          callCenterAgent: "CALL_CENTER_AGENT",
          corporate: "CORPORATE",
          driver: "DRIVER",
        };
        return map[k];
      });

    const payload = {
      username: formData.userName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      roles: selectedRoles,
    };

  try {
    await createUser(payload);
    toast({ title: "Success", description: "User created successfully." });
    navigate("/admin/users/manage");
  } catch (err: any) {
    toast({ title: "Error", description: err.response?.data?.message || "Failed", variant: "destructive" });
  }
};


  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Create New User</h1>
          <p className="text-muted-foreground mt-1">Add a new user to the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Enter the user's basic information</CardDescription>
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
                  required
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
                  required
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
                  placeholder="Enter email address"
                  required
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
                  required
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
                  required
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
            <CardDescription>Select the user's role(s)</CardDescription>
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
            Create User
          </Button>
        </div>
      </form>
    </div>
  );
}
