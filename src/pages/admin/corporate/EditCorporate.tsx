import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CorporateFormData {
  name: string;
  code: string;
  primaryContact: string;
  phone: string;
  email: string;
  address: string;
  date: string;
  cashDiscountRate: string;
  creditDiscountRate: string;
  enableQuickBooking: string;
}

export default function EditCorporate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  // Mock data - in real app, fetch based on id
  const [formData, setFormData] = useState<CorporateFormData>({
    name: "Codezync PVT Ltd",
    code: "CODE",
    primaryContact: "Aneef Fashir",
    phone: "0773260907",
    email: "aneef@codezync.com",
    address: "123 Tech Street, Colombo 03",
    date: "2024-01-15",
    cashDiscountRate: "5%",
    creditDiscountRate: "3%",
    enableQuickBooking: "Yes",
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
    if (!formData.name || !formData.code || !formData.primaryContact || !formData.phone || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    console.log("Updating corporate:", id, formData);
    
    toast({
      title: "Success",
      description: "Corporate client updated successfully.",
    });
    
    navigate("/admin/corporate/manage");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#6330B8]">Edit Corporate Client</h1>
        <p className="text-muted-foreground mt-1">Update corporate client information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update the corporate client's basic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Company Code *</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Enter company code"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryContact">Primary Contact *</Label>
                <Input
                  id="primaryContact"
                  name="primaryContact"
                  value={formData.primaryContact}
                  onChange={handleInputChange}
                  placeholder="Enter primary contact name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Registration Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Update contact details for the corporate client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter company address"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Discount & Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Discount & Configuration</CardTitle>
            <CardDescription>Update discount rates and booking settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cashDiscountRate">Cash Discount Rate (%)</Label>
                <Input
                  id="cashDiscountRate"
                  name="cashDiscountRate"
                  value={formData.cashDiscountRate}
                  onChange={handleInputChange}
                  placeholder="e.g., 5%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditDiscountRate">Credit Discount Rate (%)</Label>
                <Input
                  id="creditDiscountRate"
                  name="creditDiscountRate"
                  value={formData.creditDiscountRate}
                  onChange={handleInputChange}
                  placeholder="e.g., 3%"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="enableQuickBooking">Enable Quick Booking</Label>
              <Select
                value={formData.enableQuickBooking}
                onValueChange={(value) => handleSelectChange("enableQuickBooking", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button type="submit" className="bg-[#6330B8] hover:bg-[#7C3AED]">
            Update Corporate Client
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/corporate/manage")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
