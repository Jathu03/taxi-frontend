import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import classService from "@/services/vehicle-class/classService";
import type { VehicleClassUpdateRequest } from "@/services/vehicle-class/types";
import { Loader2 } from "lucide-react";

export default function EditClass() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    className: "",
    classCode: "",
    categoryId: undefined as number | undefined,
    commissionRate: "",
    comments: "",
    description: "",
    luggageCapacity: "",
    showInApp: true,
    showInWeb: true,
    classImage: "",
    appOrder: "",
    fareSchemeId: "",
    corporateFareSchemeId: "",
    roadTripFareSchemeId: "",
    appFareSchemeId: "",
    noOfSeats: "",
    vehicleImagePrimary: "",
    vehicleImageSecondary: "",
    vehicleImageTertiary: "",
    imageUrl: "",
  });

  // ========================
  // Fetch on mount
  // ========================
  useEffect(() => {
    const fetchClassData = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "No vehicle class ID provided.",
          variant: "destructive",
        });
        navigate("/admin/vehicle-classes/manage");
        return;
      }

      try {
        setLoading(true);
        const response = await classService.getById(Number(id));

        if (response.success && response.data) {
          const data = response.data;
          setFormData({
            className: data.className || "",
            classCode: data.classCode || "",
            categoryId: undefined,
            commissionRate: data.commissionRate?.toString() || "",
            comments: "",
            description: data.description || "",
            luggageCapacity: data.luggageCapacity || "",
            showInApp: data.showInApp ?? true,
            showInWeb: data.showInWeb ?? true,
            classImage: "",
            appOrder: data.appOrder?.toString() || "",
            fareSchemeId: "",
            corporateFareSchemeId: "",
            roadTripFareSchemeId: "",
            appFareSchemeId: "",
            noOfSeats: data.noOfSeats?.toString() || "",
            vehicleImagePrimary: "",
            vehicleImageSecondary: "",
            vehicleImageTertiary: "",
            imageUrl: data.imageUrl || "",
          });
        } else {
          toast({
            title: "Error",
            description:
              response.message || "Failed to fetch vehicle class data.",
            variant: "destructive",
          });
          navigate("/admin/vehicle-classes/manage");
        }
      } catch (error: any) {
        console.error("Error fetching vehicle class:", error);
        toast({
          title: "Error",
          description:
            error?.response?.data?.message ||
            "Failed to load vehicle class. Please try again.",
          variant: "destructive",
        });
        navigate("/admin/vehicle-classes/manage");
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [id]);

  // ========================
  // Handlers
  // ========================
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // ========================
  // Submit
  // ========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.className.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter the class name.",
        variant: "destructive",
      });
      return;
    }

    if (!id) return;

    const updatePayload: VehicleClassUpdateRequest = {
      className: formData.className.trim(),
      classCode: formData.classCode.trim() || undefined,
      categoryId: formData.categoryId,
      commissionRate: formData.commissionRate
        ? Number(formData.commissionRate)
        : undefined,
      luggageCapacity: formData.luggageCapacity.trim() || undefined,
      noOfSeats: formData.noOfSeats ? Number(formData.noOfSeats) : undefined,
      description: formData.description.trim() || undefined,
      showInApp: formData.showInApp,
      showInWeb: formData.showInWeb,
      appOrder: formData.appOrder ? Number(formData.appOrder) : undefined,
      imageUrl: formData.imageUrl.trim() || undefined,
    };

    try {
      setSubmitting(true);
      const response = await classService.update(Number(id), updatePayload);

      if (response.success) {
        toast({
          title: "Vehicle Class Updated Successfully",
          description: `${formData.className} has been updated.`,
        });
        navigate("/admin/vehicle-classes/manage");
      } else {
        toast({
          title: "Update Failed",
          description: response.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error updating vehicle class:", error);
      toast({
        title: "Update Failed",
        description:
          error?.response?.data?.message ||
          "Failed to update vehicle class. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ========================
  // Loading
  // ========================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
          <p className="text-muted-foreground">
            Loading vehicle class data...
          </p>
        </div>
      </div>
    );
  }

  // ========================
  // Render
  // ========================
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">
            Edit Vehicle Class
          </h1>
          <p className="text-muted-foreground mt-1">
            Update vehicle class information (ID: {id})
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Information */}
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>
              Update the basic vehicle class details
            </CardDescription>
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
                  value={formData.classCode}
                  onChange={handleInputChange}
                  placeholder="e.g., ECON, BTG VAN"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commissionRate">Commission Rate</Label>
                <Input
                  id="commissionRate"
                  name="commissionRate"
                  type="number"
                  value={formData.commissionRate}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="luggageCapacity">Luggage Capacity</Label>
                <Input
                  id="luggageCapacity"
                  name="luggageCapacity"
                  value={formData.luggageCapacity}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 bags, 4 suitcases"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="comments">Comments</Label>
                <Input
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  placeholder="Additional comments"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full min-h-[100px] px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  placeholder="Enter class description..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showInApp"
                    checked={formData.showInApp}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("showInApp", checked as boolean)
                    }
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
                    checked={formData.showInWeb}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("showInWeb", checked as boolean)
                    }
                  />
                  <Label htmlFor="showInWeb" className="cursor-pointer">
                    Show in Web
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Class Image */}
        <Card>
          <CardHeader>
            <CardTitle>Class Image</CardTitle>
            <CardDescription>Upload vehicle class image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="classImage">Vehicle Class Image</Label>
              {formData.imageUrl && (
                <div className="mb-2">
                  <img
                    src={formData.imageUrl}
                    alt="Current class image"
                    className="h-24 w-24 object-cover rounded-md border"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Current image
                  </p>
                </div>
              )}
              <Input
                id="classImage"
                name="classImage"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Other Information */}
        <Card>
          <CardHeader>
            <CardTitle>Other Information</CardTitle>
            <CardDescription>
              Configure fare schemes and additional settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appOrder">App Order</Label>
                <Input
                  id="appOrder"
                  name="appOrder"
                  type="number"
                  value={formData.appOrder}
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
                  value={formData.noOfSeats}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fareSchemeId">Fare Scheme</Label>
                <Select
                  value={formData.fareSchemeId}
                  onValueChange={(value) =>
                    handleSelectChange("fareSchemeId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Fare Scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STANDARD">STANDARD</SelectItem>
                    <SelectItem value="BTG Demo">BTG Demo</SelectItem>
                    <SelectItem value="BTG APP">BTG APP</SelectItem>
                    <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="corporateFareSchemeId">
                  Corporate Fare Scheme
                </Label>
                <Select
                  value={formData.corporateFareSchemeId}
                  onValueChange={(value) =>
                    handleSelectChange("corporateFareSchemeId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Fare Scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STANDARD">STANDARD</SelectItem>
                    <SelectItem value="BTG Demo">BTG Demo</SelectItem>
                    <SelectItem value="BTG APP">BTG APP</SelectItem>
                    <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roadTripFareSchemeId">
                  RoadTrip Fare Scheme
                </Label>
                <Select
                  value={formData.roadTripFareSchemeId}
                  onValueChange={(value) =>
                    handleSelectChange("roadTripFareSchemeId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Fare Scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STANDARD">STANDARD</SelectItem>
                    <SelectItem value="BTG Demo">BTG Demo</SelectItem>
                    <SelectItem value="BTG APP">BTG APP</SelectItem>
                    <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appFareSchemeId">App Fare Scheme</Label>
                <Select
                  value={formData.appFareSchemeId}
                  onValueChange={(value) =>
                    handleSelectChange("appFareSchemeId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Fare Scheme for App Booking" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STANDARD">STANDARD</SelectItem>
                    <SelectItem value="BTG Demo">BTG Demo</SelectItem>
                    <SelectItem value="BTG APP">BTG APP</SelectItem>
                    <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Images */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Images</CardTitle>
            <CardDescription>
              Upload additional vehicle images
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleImagePrimary">
                  Vehicle Image Primary
                </Label>
                <Input
                  id="vehicleImagePrimary"
                  name="vehicleImagePrimary"
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleImageSecondary">
                  Vehicle Image Secondary
                </Label>
                <Input
                  id="vehicleImageSecondary"
                  name="vehicleImageSecondary"
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleImageTertiary">
                  Vehicle Image Tertiary
                </Label>
                <Input
                  id="vehicleImageTertiary"
                  name="vehicleImageTertiary"
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
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
            onClick={() => navigate("/admin/vehicle-classes/manage")}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#6330B8] hover:bg-[#6330B8]/90"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Class"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}