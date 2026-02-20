import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function EditManufacturer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  // Mock data - in real app, fetch based on id
  const [formData, setFormData] = useState({
    manufacturer: "Honda",
    manufacturerCode: "Honda",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.manufacturer) {
      toast({
        title: "Validation Error",
        description: "Please enter the manufacturer name",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Manufacturer Updated Successfully",
      description: `${formData.manufacturer} has been updated.`,
    });
    
    navigate("/admin/vehicle-makes/manage");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Edit Manufacturer</h1>
          <p className="text-muted-foreground mt-1">Update manufacturer information (ID: {id})</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Manufacturer Information</CardTitle>
            <CardDescription>Update the manufacturer details</CardDescription>
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
                  value={formData.manufacturerCode}
                  onChange={handleInputChange}
                  placeholder="e.g., TOYOTA, Honda"
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
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-[#6330B8] hover:bg-[#6330B8]/90">
            Update Manufacturer
          </Button>
        </div>
      </form>
    </div>
  );
}
