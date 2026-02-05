import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function EditModel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  // Mock data - in real app, fetch based on id
  const [formData, setFormData] = useState({
    manufacturer: "Honda",
    model: "Grace",
    modelCode: "Grace",
    frame: "Sedan",
    transmissionType: "Automatic",
    trimLevel: "L",
    fuelInjectionType: "L",
    turbo: "",
    comments: "-",
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
    if (!formData.manufacturer || !formData.model) {
      toast({
        title: "Validation Error",
        description: "Please fill in Manufacturer and Model fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Model Updated Successfully",
      description: `${formData.manufacturer} ${formData.model} has been updated.`,
    });
    
    navigate("/admin/vehicle-models/manage");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Edit Vehicle Model</h1>
          <p className="text-muted-foreground mt-1">Update vehicle model information (ID: {id})</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Model Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Model Information</CardTitle>
            <CardDescription>Update the vehicle model details</CardDescription>
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
                <Label htmlFor="model">
                  Model <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g., Grace, Axio"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelCode">Model Code</Label>
                <Input
                  id="modelCode"
                  name="modelCode"
                  value={formData.modelCode}
                  onChange={handleInputChange}
                  placeholder="e.g., Grace, AXIO"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frame">Frame</Label>
                <Select
                  value={formData.frame}
                  onValueChange={(value) => handleSelectChange("frame", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frame type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="Mini">Mini</SelectItem>
                    <SelectItem value="Budget">Budget</SelectItem>
                    <SelectItem value="ECON">ECON</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                    <SelectItem value="VAN">VAN</SelectItem>
                    <SelectItem value="Bus">Bus</SelectItem>
                    <SelectItem value="Lorry">Lorry</SelectItem>
                    <SelectItem value="Luxury">Luxury</SelectItem>
                    <SelectItem value="Auto">Auto</SelectItem>
                    <SelectItem value="Shuttle">Shuttle</SelectItem>
                    <SelectItem value="Buddy Van">Buddy Van</SelectItem>
                    <SelectItem value="Flat Roof">Flat Roof</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
            <CardDescription>Update technical details and specifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transmissionType">Transmission Type</Label>
                <Select
                  value={formData.transmissionType}
                  onValueChange={(value) => handleSelectChange("transmissionType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Manuel">Manuel</SelectItem>
                    <SelectItem value="Auto">Auto</SelectItem>
                    <SelectItem value="Manul">Manul</SelectItem>
                    <SelectItem value="automatic">automatic</SelectItem>
                    <SelectItem value="manual">manual</SelectItem>
                    <SelectItem value="MANUal">MANUal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trimLevel">Trim Level</Label>
                <Input
                  id="trimLevel"
                  name="trimLevel"
                  value={formData.trimLevel}
                  onChange={handleInputChange}
                  placeholder="e.g., L, IL, extreme"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelInjectionType">Fuel Injection Type</Label>
                <Select
                  value={formData.fuelInjectionType}
                  onValueChange={(value) => handleSelectChange("fuelInjectionType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="E">Electric (E)</SelectItem>
                    <SelectItem value="petrol">petrol</SelectItem>
                    <SelectItem value="patrol">patrol</SelectItem>
                    <SelectItem value="Patrol">Patrol</SelectItem>
                    <SelectItem value="gas">gas</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="turbo">Turbo</Label>
                <Input
                  id="turbo"
                  name="turbo"
                  value={formData.turbo}
                  onChange={handleInputChange}
                  placeholder="e.g., Yes, No, V8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Any additional notes or comments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                className="w-full min-h-[100px] px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                placeholder="Enter any additional comments..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/vehicle-models/manage")}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-[#6330B8] hover:bg-[#6330B8]/90">
            Update Model
          </Button>
        </div>
      </form>
    </div>
  );
}
