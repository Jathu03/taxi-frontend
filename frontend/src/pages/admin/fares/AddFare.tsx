import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Services
import fareService from "@/services/fare-schemes/fareService";
import type { FareSchemeCreateRequest } from "@/services/fare-schemes/types";

export default function AddFare() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data (using strings for inputs, converted on submit)
  const [formData, setFormData] = useState({
    fareCode: "",
    minimumDistance: "0",
    minimumRate: "0",
    ratePerKm: "0",
    freeWaitTime: "0",
    waitingChargePerMin: "0",
    peakHourStartTime: "",
    peakHourEndTime: "",
    offPeakMinRateHike: "0",
    ratePerKmHike: "0",
    onTheMeter: false, // isMetered
    minimumTime: "0",
    additionalTimeSlot: "0",
    ratePerAdditionalTimeSlot: "0",
    isPackage: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare payload
      const payload: FareSchemeCreateRequest = {
        fareCode: formData.fareCode,
        minimumDistance: Number(formData.minimumDistance),
        minimumRate: Number(formData.minimumRate),
        ratePerKm: Number(formData.ratePerKm),
        freeWaitTime: Number(formData.freeWaitTime),
        waitingChargePerMin: Number(formData.waitingChargePerMin),
        peakHourStartTime: formData.peakHourStartTime ? formData.peakHourStartTime + ":00" : undefined, // Backend expects HH:mm:ss
        peakHourEndTime: formData.peakHourEndTime ? formData.peakHourEndTime + ":00" : undefined,
        offPeakMinRateHike: Number(formData.offPeakMinRateHike),
        ratePerKmHike: Number(formData.ratePerKmHike),
        peakHourRateHike: 0, // Defaulting if not in form
        isMetered: formData.onTheMeter,
        isPackage: formData.isPackage,
        minimumTime: Number(formData.minimumTime),
        additionalTimeSlot: Number(formData.additionalTimeSlot),
        ratePerAdditionalTimeSlot: Number(formData.ratePerAdditionalTimeSlot),
        status: "Active"
      };

      const response = await fareService.create(payload);

      if (response.success) {
        toast({
          title: "Success",
          description: `Fare scheme "${response.data.fareCode}" added successfully.`,
        });
        navigate("/admin/fares/manage");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to add fare scheme.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Creation failed:", error);
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
          <h1 className="text-3xl font-bold text-[#6330B8]">Add New Fare Scheme</h1>
          <p className="text-muted-foreground mt-1">Create a new fare scheme configuration</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Fare Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Fare Information</CardTitle>
            <CardDescription>Enter the basic fare scheme details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fareCode">
                  Fare Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fareCode"
                  name="fareCode"
                  value={formData.fareCode}
                  onChange={handleInputChange}
                  placeholder="e.g., STANDARD, PREMIUM"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumDistance">Minimum Distance (Km)</Label>
                <Input
                  id="minimumDistance"
                  name="minimumDistance"
                  type="number"
                  step="0.01"
                  value={formData.minimumDistance}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumRate">Minimum Rate (Rs.)</Label>
                <Input
                  id="minimumRate"
                  name="minimumRate"
                  type="number"
                  step="0.01"
                  value={formData.minimumRate}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratePerKm">Rate Per Km</Label>
                <Input
                  id="ratePerKm"
                  name="ratePerKm"
                  type="number"
                  step="0.01"
                  value={formData.ratePerKm}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="freeWaitTime">Free Wait Time (min)</Label>
                <Input
                  id="freeWaitTime"
                  name="freeWaitTime"
                  type="number"
                  value={formData.freeWaitTime}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waitingChargePerMin">Waiting Charge Per min</Label>
                <Input
                  id="waitingChargePerMin"
                  name="waitingChargePerMin"
                  type="number"
                  step="0.01"
                  value={formData.waitingChargePerMin}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hour Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Hour Configuration</CardTitle>
            <CardDescription>Configure peak hour timings and rate hikes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="peakHourStartTime">Peak Hour Start Time</Label>
                <Input
                  id="peakHourStartTime"
                  name="peakHourStartTime"
                  type="time"
                  value={formData.peakHourStartTime}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peakHourEndTime">Peak Hour End Time</Label>
                <Input
                  id="peakHourEndTime"
                  name="peakHourEndTime"
                  type="time"
                  value={formData.peakHourEndTime}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="offPeakMinRateHike">Off Peak Minimum Rate Hike</Label>
                <Input
                  id="offPeakMinRateHike"
                  name="offPeakMinRateHike"
                  type="number"
                  step="0.01"
                  value={formData.offPeakMinRateHike}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratePerKmHike">Rate Per Km Hike</Label>
                <Input
                  id="ratePerKmHike"
                  name="ratePerKmHike"
                  type="number"
                  step="0.01"
                  value={formData.ratePerKmHike}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="onTheMeter"
                    checked={formData.onTheMeter}
                    onCheckedChange={(checked) => handleCheckboxChange("onTheMeter", checked as boolean)}
                  />
                  <Label htmlFor="onTheMeter" className="cursor-pointer">
                    On the Meter
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Package Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Package Informations</CardTitle>
            <CardDescription>Configure package-based fare options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minimumTime">Minimum Time</Label>
                <Input
                  id="minimumTime"
                  name="minimumTime"
                  type="number"
                  value={formData.minimumTime}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalTimeSlot">Additional Time Slot</Label>
                <Input
                  id="additionalTimeSlot"
                  name="additionalTimeSlot"
                  type="number"
                  value={formData.additionalTimeSlot}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratePerAdditionalTimeSlot">Rate Per Additional Time Slot</Label>
                <Input
                  id="ratePerAdditionalTimeSlot"
                  name="ratePerAdditionalTimeSlot"
                  type="number"
                  step="0.01"
                  value={formData.ratePerAdditionalTimeSlot}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPackage"
                    checked={formData.isPackage}
                    onCheckedChange={(checked) => handleCheckboxChange("isPackage", checked as boolean)}
                  />
                  <Label htmlFor="isPackage" className="cursor-pointer">
                    Is Package
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/fares/manage")}
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
              "Add Fare Scheme"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}