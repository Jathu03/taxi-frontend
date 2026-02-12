import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Services
import ownerService from "@/services/vehicle-owner/ownerService";
import companyService from "@/services/vehicle-owner/companyService";

export default function EditOwner() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    personalCompanyName: "",
    nicBusinessReg: "",
    primaryContact: "",
    secondaryContact: "",
    postalAddress: "",
    email: "",
    company: "",
    isActive: true, // Keep track of active status
  });

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchOwner = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await ownerService.getById(Number(id));
        if (response.success) {
          const data = response.data;
          setFormData({
            personalCompanyName: data.name,
            nicBusinessReg: data.nicOrBusinessReg || "",
            primaryContact: data.primaryContact,
            secondaryContact: data.secondaryContact || "",
            postalAddress: data.postalAddress || "",
            email: data.email || "",
            company: data.company || "",
            isActive: data.isActive,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load owner details.",
          });
          navigate("/admin/vehicle-owners/manage");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch owner data.",
        });
        navigate("/admin/vehicle-owners/manage");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwner();
  }, [id, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSubmitting(true);
    
    try {
      // 2. Handle Company Logic (Auto-create if new)
      if (formData.company.trim()) {
        try {
          await companyService.create({
            companyName: formData.company,
            isActive: true
          });
        } catch (error: any) {
          // Ignore 409 Conflict (Company already exists), log others
          if (error.response?.status !== 409) {
            console.warn("Could not auto-create company:", error);
          }
        }
      }

      // 3. Update Owner
      const updatePayload = {
        name: formData.personalCompanyName,
        nicOrBusinessReg: formData.nicBusinessReg,
        company: formData.company,
        email: formData.email,
        primaryContact: formData.primaryContact,
        secondaryContact: formData.secondaryContact,
        postalAddress: formData.postalAddress,
        isActive: formData.isActive,
      };

      const response = await ownerService.update(Number(id), updatePayload);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Vehicle owner has been updated successfully.",
        });
        navigate("/admin/vehicle-owners/manage");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to update owner.",
        });
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
          <p className="text-muted-foreground">Loading owner details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Edit Vehicle Owner</h1>
          <p className="text-muted-foreground mt-1">Update vehicle owner information (ID: {id})</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Owner Information */}
        <Card>
          <CardHeader>
            <CardTitle>Owner Information</CardTitle>
            <CardDescription>Update the vehicle owner's personal or company details</CardDescription>
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
                   Changing this will update the company association.
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
            <CardDescription>Update contact details and address</CardDescription>
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
                Updating...
              </>
            ) : (
              "Update Owner"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}