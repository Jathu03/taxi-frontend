import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Services
import ownerService from "@/services/vehicle-owner/ownerService";
import companyService from "@/services/vehicle-owner/companyService"; // Assuming you saved companyService here

export default function AddOwner() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    personalCompanyName: "",
    nicBusinessReg: "",
    primaryContact: "",
    secondaryContact: "",
    postalAddress: "",
    email: "",
    company: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Handle Company Logic
      // If a company name is provided, try to add it to the companies table
      if (formData.company.trim()) {
        try {
          // Attempt to create the company
          await companyService.create({
            companyName: formData.company,
            isActive: true
          });
          // If successful, it means it was new and is now added.
        } catch (error: any) {
          // If the error is 409 (Conflict), it means the company already exists.
          // We can safely ignore this error and proceed to create the owner.
          if (error.response && error.response.status === 409) {
            console.log("Company already exists, proceeding to create owner...");
          } else {
            // If it's another error (e.g., 500), we log it but usually still try to create the owner
            // OR you can throw it to stop the process. Here we log and proceed.
            console.warn("Could not auto-create company record:", error);
          }
        }
      }

      // 2. Prepare Owner Payload
      const ownerPayload = {
        name: formData.personalCompanyName,
        nicOrBusinessReg: formData.nicBusinessReg,
        company: formData.company,
        email: formData.email,
        primaryContact: formData.primaryContact,
        secondaryContact: formData.secondaryContact,
        postalAddress: formData.postalAddress,
        isActive: true, // Default to active
      };

      // 3. Create Owner
      const response = await ownerService.create(ownerPayload);

      if (response.success) {
        toast({
          title: "Success",
          description: "Vehicle owner has been added successfully.",
        });
        navigate("/admin/vehicle-owners/manage"); // Updated path to match your list page
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to add owner.",
        });
      }

    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Add New Vehicle Owner</h1>
          <p className="text-muted-foreground mt-1">Register a new vehicle owner</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Owner Information */}
        <Card>
          <CardHeader>
            <CardTitle>Owner Information</CardTitle>
            <CardDescription>Enter the vehicle owner's personal or company details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="personalCompanyName">
                  Personal/Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="personalCompanyName"
                  name="personalCompanyName"
                  value={formData.personalCompanyName}
                  onChange={handleInputChange}
                  placeholder="e.g., Jegath Fernanado"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nicBusinessReg">
                  NIC/Business Registration <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nicBusinessReg"
                  name="nicBusinessReg"
                  value={formData.nicBusinessReg}
                  onChange={handleInputChange}
                  placeholder="e.g., 601390698v"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company name (Auto-created if new)"
                />
                <p className="text-[0.8rem] text-muted-foreground">
                  If this company does not exist in the system, it will be added automatically.
                </p>
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
                  placeholder="e.g., owner@example.com"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Enter contact details and address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryContact">
                  Primary Contact <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="primaryContact"
                  name="primaryContact"
                  value={formData.primaryContact}
                  onChange={handleInputChange}
                  placeholder="e.g., 0778406882"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryContact">Secondary Contact</Label>
                <Input
                  id="secondaryContact"
                  name="secondaryContact"
                  value={formData.secondaryContact}
                  onChange={handleInputChange}
                  placeholder="e.g., 0112840625"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="postalAddress">
                  Postal Address <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="postalAddress"
                  name="postalAddress"
                  value={formData.postalAddress}
                  onChange={handleInputChange}
                  className="w-full min-h-[100px] px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  placeholder="Enter postal address..."
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/vehicle-owners/manage")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-[#6330B8] hover:bg-[#6330B8]/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Add Owner"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}