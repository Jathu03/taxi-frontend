import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Import Service and Types
import makeService from "@/services/vehicle-make/makeService";
import type { VehicleMakeCreateRequest } from "@/services/vehicle-make/types";

export default function AddManufacturer() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<VehicleMakeCreateRequest>({
    manufacturer: "",
    manufacturerCode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.manufacturer.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter the manufacturer name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await makeService.create(formData);

      if (response.success) {
        toast({
          title: "Manufacturer Added Successfully",
          description: `${response.data.manufacturer} has been added to the system.`,
        });
        navigate("/admin/vehicle-makes/manage");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to add manufacturer.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Failed to add manufacturer:", error);
      
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Add New Manufacturer</h1>
          <p className="text-muted-foreground mt-1">Register a new vehicle manufacturer</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Manufacturer Information</CardTitle>
            <CardDescription>Enter the manufacturer details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">
                  Manufacturer <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  placeholder="e.g., Toyota, Honda, Nissan"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturerCode">Manufacturer Code</Label>
                <Input
                  id="manufacturerCode"
                  name="manufacturerCode"
                  value={formData.manufacturerCode || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., TOYOTA, HONDA"
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
            onClick={() => navigate("/admin/vehicle-makes/manage")}
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
                Adding...
              </>
            ) : (
              "Add Manufacturer"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}