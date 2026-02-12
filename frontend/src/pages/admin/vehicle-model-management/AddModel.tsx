import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Using Textarea component if available, or fallback to html textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Services and Types
import modelService from "@/services/vehicle-model/modelService";
import makeService from "@/services/vehicle-make/makeService";
import type { VehicleMakeResponse } from "@/services/vehicle-make/types";
import type { VehicleModelCreateRequest } from "@/services/vehicle-model/types";

export default function AddModel() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State
  const [makes, setMakes] = useState<VehicleMakeResponse[]>([]);
  const [isLoadingMakes, setIsLoadingMakes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data matches CreateRequest structure (makeId is string here for Select, converted later)
  const [formData, setFormData] = useState({
    makeId: "", 
    model: "",
    modelCode: "",
    frame: "",
    transmissionType: "",
    trimLevel: "",
    fuelType: "", // Renamed from fuelInjectionType to match backend
    turbo: "",
    comments: "",
  });

  // Fetch Manufacturers on Mount
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await makeService.getAllList(); // Assuming getAllList endpoint exists for dropdowns
        if (response.success) {
          setMakes(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load manufacturers.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to fetch makes", error);
        toast({
          title: "Error",
          description: "Could not fetch manufacturer list.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingMakes(false);
      }
    };

    fetchMakes();
  }, [toast]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.makeId) {
      toast({ title: "Validation Error", description: "Please select a Manufacturer", variant: "destructive" });
      return;
    }
    if (!formData.model.trim()) {
      toast({ title: "Validation Error", description: "Please enter a Model Name", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    // Prepare payload (Convert makeId string to number)
    const payload: VehicleModelCreateRequest = {
      makeId: Number(formData.makeId),
      model: formData.model,
      modelCode: formData.modelCode || undefined,
      frame: formData.frame || undefined,
      transmissionType: formData.transmissionType || undefined,
      trimLevel: formData.trimLevel || undefined,
      fuelType: formData.fuelType || undefined,
      turbo: formData.turbo || undefined,
      comments: formData.comments || undefined,
    };

    try {
      const response = await modelService.create(payload);

      if (response.success) {
        toast({
          title: "Model Added Successfully",
          description: `${response.data.makeName} ${response.data.model} has been created.`,
        });
        navigate("/admin/vehicle-models/manage");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create model.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "An unexpected error occurred.",
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
          <h1 className="text-3xl font-bold text-[#6330B8]">Add New Vehicle Model</h1>
          <p className="text-muted-foreground mt-1">Register a new vehicle model in the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Model Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Model Information</CardTitle>
            <CardDescription>Enter the vehicle model details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Manufacturer Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="makeId">
                  Manufacturer <span className="text-red-500">*</span>
                </Label>
                {isLoadingMakes ? (
                  <div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-muted/50 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading Manufacturers...
                  </div>
                ) : (
                  <Select
                    value={formData.makeId}
                    onValueChange={(value) => handleSelectChange("makeId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Manufacturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {makes.map((make) => (
                        <SelectItem key={make.id} value={String(make.id)}>
                          {make.manufacturer} {make.manufacturerCode ? `(${make.manufacturerCode})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">
                  Model Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g., Grace, Axio, Prius"
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
                  placeholder="e.g., GM4, NRE161"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frame">Frame Type</Label>
                <Select
                  value={formData.frame}
                  onValueChange={(value) => handleSelectChange("frame", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frame type" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Matching Backend Enum: FrameType */}
                    <SelectItem value="SEDAN">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="HATCHBACK">Hatchback</SelectItem>
                    <SelectItem value="WAGON">Wagon</SelectItem>
                    <SelectItem value="VAN">Van</SelectItem>
                    <SelectItem value="COUPE">Coupe</SelectItem>
                    <SelectItem value="CONVERTIBLE">Convertible</SelectItem>
                    <SelectItem value="PICKUP">Pickup</SelectItem>
                    <SelectItem value="TRUCK">Truck</SelectItem>
                    <SelectItem value="BUS">Bus</SelectItem>
                    <SelectItem value="THREE_WHEELER">Three Wheeler</SelectItem>
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
            <CardDescription>Enter technical details and specifications</CardDescription>
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
                    {/* Matching Backend Enum: TransmissionType */}
                    <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                    <SelectItem value="MANUAL">Manual</SelectItem>
                    <SelectItem value="SEMI_AUTOMATIC">Semi-Automatic</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
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
                  placeholder="e.g., L, G, EX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => handleSelectChange("fuelType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Matching Backend Enum: FuelType */}
                    <SelectItem value="PETROL">Petrol</SelectItem>
                    <SelectItem value="DIESEL">Diesel</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                    <SelectItem value="ELECTRIC">Electric</SelectItem>
                    <SelectItem value="CNG">CNG</SelectItem>
                    <SelectItem value="LPG">LPG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="turbo">Turbo</Label>
                <Select
                  value={formData.turbo}
                  onValueChange={(value) => handleSelectChange("turbo", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select turbo type" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Matching Backend Enum: TurboType */}
                    <SelectItem value="NONE">None</SelectItem>
                    <SelectItem value="SINGLE_TURBO">Single Turbo</SelectItem>
                    <SelectItem value="TWIN_TURBO">Twin Turbo</SelectItem>
                    <SelectItem value="SEQUENTIAL_TURBO">Sequential Turbo</SelectItem>
                    <SelectItem value="ELECTRIC_TURBO">Electric Turbo</SelectItem>
                  </SelectContent>
                </Select>
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
              "Add Model"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}