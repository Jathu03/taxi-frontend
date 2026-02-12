import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Services
import classService from "@/services/vehicle-class/classService";
import fareService from "@/services/fare-schemes/fareService";
import type { VehicleClassCreateRequest } from "@/services/vehicle-class/types";
import type { FareSchemeResponse } from "@/services/fare-schemes/types";

export default function AddClass() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingFares, setIsLoadingFares] = useState(true);
  const [fareSchemes, setFareSchemes] = useState<FareSchemeResponse[]>([]);

  // Form data matching the backend DTO exactly
  const [formData, setFormData] = useState<VehicleClassCreateRequest>({
    className: "",
    classCode: "",
    commissionRate: 0,
    comments: "",
    description: "",
    luggageCapacity: "",
    showInApp: false,
    showInWeb: false,
    classImage: "",
    appOrder: 0,
    noOfSeats: 0,
    vehicleImagePrimary: "",
    vehicleImageSecondary: "",
    vehicleImageTertiary: "",
  });

  // Separate state for fare scheme selections (as strings for Select component)
  const [fareSelections, setFareSelections] = useState({
    fareScheme: "",
    corporateFareSchemeId: "",
    roadTripFareSchemeId: "",
    appFareSchemeId: "",
  });

  // Fetch Active Fare Schemes on Mount
  useEffect(() => {
    const fetchFares = async () => {
      try {
        const response = await fareService.getActive();
        if (response.success) {
          setFareSchemes(response.data);
        }
      } catch (error) {
        console.error("Failed to load fares", error);
      } finally {
        setIsLoadingFares(false);
      }
    };
    fetchFares();
  }, []);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFareSelectChange = (name: string, value: string) => {
    setFareSelections((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.className.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter the class name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Build the payload - include fare IDs if your backend supports them
      const payload: VehicleClassCreateRequest = {
        ...formData,
        className: formData.className.trim(),
        classCode: formData.classCode?.trim() || "",
      };

      console.log("Submitting:", payload);

      const response = await classService.create(payload);

      console.log("Response:", response);

      if (response.success) {
        toast({
          title: "Vehicle Class Added Successfully",
          description: `${response.data.className} has been added to the system.`,
        });
        navigate("/admin/vehicle-classes/manage");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to add vehicle class.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Failed to add vehicle class:", error);
      
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
          <h1 className="text-3xl font-bold text-[#6330B8]">Add New Vehicle Class</h1>
          <p className="text-muted-foreground mt-1">Register a new vehicle class</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Information */}
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Enter the basic vehicle class details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="className">
                  Class Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="className"
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  placeholder="e.g., ECONOMY, LUXURY, VAN"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="classCode">Class Code</Label>
                <Input
                  id="classCode"
                  name="classCode"
                  value={formData.classCode || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., ECON, BTG VAN"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input
                  id="commissionRate"
                  name="commissionRate"
                  type="number"
                  value={formData.commissionRate || 0}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="luggageCapacity">Luggage Capacity</Label>
                <Input
                  id="luggageCapacity"
                  name="luggageCapacity"
                  value={formData.luggageCapacity || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 bags, 4 suitcases"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="comments">Comments</Label>
                <Input
                  id="comments"
                  name="comments"
                  value={formData.comments || ""}
                  onChange={handleInputChange}
                  placeholder="Additional comments"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  className="w-full min-h-[100px] px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  placeholder="Enter class description..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showInApp"
                    checked={formData.showInApp || false}
                    onCheckedChange={(checked) => handleCheckboxChange("showInApp", checked === true)}
                  />
                  <Label htmlFor="showInApp" className="cursor-pointer">
                    Show in App
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showInWeb"
                    checked={formData.showInWeb || false}
                    onCheckedChange={(checked) => handleCheckboxChange("showInWeb", checked === true)}
                  />
                  <Label htmlFor="showInWeb" className="cursor-pointer">
                    Show in Web
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Other Information */}
        <Card>
          <CardHeader>
            <CardTitle>Other Information</CardTitle>
            <CardDescription>Configure fare schemes and additional settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appOrder">App Order</Label>
                <Input
                  id="appOrder"
                  name="appOrder"
                  type="number"
                  value={formData.appOrder || 0}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="noOfSeats">No of Seats</Label>
                <Input
                  id="noOfSeats"
                  name="noOfSeats"
                  type="number"
                  value={formData.noOfSeats || 0}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              {/* Fare Scheme Dropdowns */}
              <div className="space-y-2">
                <Label>Default Fare Scheme</Label>
                {isLoadingFares ? (
                  <div className="text-sm text-muted-foreground">Loading fares...</div>
                ) : (
                  <Select
                    value={fareSelections.fareScheme}
                    onValueChange={(value) => handleFareSelectChange("fareScheme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Fare Scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      {fareSchemes.map((fare) => (
                        <SelectItem key={fare.id} value={String(fare.id)}>
                          {fare.fareCode} ({fare.fareName || "No Name"})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label>Corporate Fare Scheme</Label>
                <Select
                  value={fareSelections.corporateFareSchemeId}
                  onValueChange={(value) => handleFareSelectChange("corporateFareSchemeId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Fare Scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    {fareSchemes.map((fare) => (
                      <SelectItem key={fare.id} value={String(fare.id)}>
                        {fare.fareCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>RoadTrip Fare Scheme</Label>
                <Select
                  value={fareSelections.roadTripFareSchemeId}
                  onValueChange={(value) => handleFareSelectChange("roadTripFareSchemeId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Fare Scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    {fareSchemes.map((fare) => (
                      <SelectItem key={fare.id} value={String(fare.id)}>
                        {fare.fareCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>App Fare Scheme</Label>
                <Select
                  value={fareSelections.appFareSchemeId}
                  onValueChange={(value) => handleFareSelectChange("appFareSchemeId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Fare Scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    {fareSchemes.map((fare) => (
                      <SelectItem key={fare.id} value={String(fare.id)}>
                        {fare.fareCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Upload vehicle class images (Implementation Pending)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Class Image</Label>
                <Input type="file" disabled />
              </div>
              <div className="space-y-2">
                <Label>Primary Image</Label>
                <Input type="file" disabled />
              </div>
              <div className="space-y-2">
                <Label>Secondary Image</Label>
                <Input type="file" disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/vehicle-classes/manage")}
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
              "Add Class"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}