import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Services
import fareService from "@/services/fare-schemes/fareService";
import type { FareSchemeUpdateRequest } from "@/services/fare-schemes/types";

export default function EditFare() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
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
    onTheMeter: false,
    minimumTime: "0",
    additionalTimeSlot: "0",
    ratePerAdditionalTimeSlot: "0",
    isPackage: false,
  });

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchFare = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await fareService.getById(Number(id));
        if (response.success) {
          const data = response.data;
          setFormData({
            fareCode: data.fareCode,
            minimumDistance: String(data.minimumDistance || 0),
            minimumRate: String(data.minimumRate || 0),
            ratePerKm: String(data.ratePerKm || 0),
            freeWaitTime: String(data.freeWaitTime || 0),
            waitingChargePerMin: String(data.waitingChargePerMin || 0),
            // Ensure time format is HH:mm for input type="time"
            peakHourStartTime: data.peakHourStartTime ? data.peakHourStartTime.substring(0, 5) : "",
            peakHourEndTime: data.peakHourEndTime ? data.peakHourEndTime.substring(0, 5) : "",
            offPeakMinRateHike: String(data.offPeakMinRateHike || 0),
            ratePerKmHike: String(data.ratePerKmHike || 0),
            onTheMeter: data.isMetered,
            minimumTime: String(data.minimumTime || 0),
            additionalTimeSlot: String(data.additionalTimeSlot || 0),
            ratePerAdditionalTimeSlot: String(data.ratePerAdditionalTimeSlot || 0),
            isPackage: data.isPackage,
          });
        } else {
          toast({
            title: "Error",
            description: "Could not load fare scheme details.",
            variant: "destructive",
          });
          navigate("/admin/fares/manage");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to load data.",
          variant: "destructive",
        });
        navigate("/admin/fares/manage");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFare();
  }, [id, navigate, toast]);

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
    if (!id) return;
    setIsSubmitting(true);

    try {
      const payload: FareSchemeUpdateRequest = {
        fareCode: formData.fareCode,
        minimumDistance: Number(formData.minimumDistance),
        minimumRate: Number(formData.minimumRate),
        ratePerKm: Number(formData.ratePerKm),
        freeWaitTime: Number(formData.freeWaitTime),
        waitingChargePerMin: Number(formData.waitingChargePerMin),
        peakHourStartTime: formData.peakHourStartTime ? formData.peakHourStartTime + ":00" : undefined,
        peakHourEndTime: formData.peakHourEndTime ? formData.peakHourEndTime + ":00" : undefined,
        offPeakMinRateHike: Number(formData.offPeakMinRateHike),
        ratePerKmHike: Number(formData.ratePerKmHike),
        isMetered: formData.onTheMeter,
        isPackage: formData.isPackage,
        minimumTime: Number(formData.minimumTime),
        additionalTimeSlot: Number(formData.additionalTimeSlot),
        ratePerAdditionalTimeSlot: Number(formData.ratePerAdditionalTimeSlot),
      };

      const response = await fareService.update(Number(id), payload);

      if (response.success) {
        toast({
          title: "Success",
          description: "Fare scheme updated successfully.",
        });
        navigate("/admin/fares/manage");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update fare scheme.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Edit Fare Scheme</h1>
          <p className="text-muted-foreground mt-1">Update fare scheme configuration (ID: {id})</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Fare Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Fare Information</CardTitle>
            <CardDescription>Update the basic fare scheme details</CardDescription>
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
            <CardDescription>Update peak hour timings and rate hikes</CardDescription>
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
            <CardDescription>Update package-based fare options</CardDescription>
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
                Updating...
              </>
            ) : (
              "Update Fare Scheme"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}