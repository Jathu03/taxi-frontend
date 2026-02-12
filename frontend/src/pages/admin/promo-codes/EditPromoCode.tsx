import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Services
import promoService from "@/services/promo-codes/promoService";
import type { PromoCodeUpdateRequest } from "@/services/promo-codes/types";

// NOTE: Vehicle Class integration is currently stubbed/disabled as requested.
// You can uncomment/implement fetching later.

export default function EditPromoCode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    vehicleClassIds: [] as number[], // IDs from backend
    discountIn: "PERCENTAGE",
    discountValue: "0",
    startDate: "",
    endDate: "",
    isActive: true,
    maxAmount: "0",
    isFirstTimeOnly: false,
    maxCountPerUser: "0",
    maxUsage: "0",
    minimumHireCount: "0",
    maxHireCount: "0",
  });

  // Placeholder for vehicle classes list (Empty for now)
  const vehicleClasses: { id: number; className: string }[] = []; 

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await promoService.getById(Number(id));
        if (response.success) {
          const data = response.data;
          
          // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
          const formatDateTime = (dateStr: string | null) => {
            if (!dateStr) return "";
            return new Date(dateStr).toISOString().slice(0, 16);
          };

          setFormData({
            code: data.code,
            description: data.description || "",
            vehicleClassIds: data.vehicleClassIds || [],
            discountIn: data.discountType,
            discountValue: String(data.discountValue),
            startDate: formatDateTime(data.startDate),
            endDate: formatDateTime(data.endDate),
            isActive: data.isActive,
            maxAmount: String(data.maxDiscountAmount || 0),
            isFirstTimeOnly: data.isFirstTimeOnly,
            maxCountPerUser: String(data.maxUsagePerCustomer || 0),
            maxUsage: String(data.maxUsage || 0),
            minimumHireCount: String(data.minimumHireCount || 0),
            maxHireCount: String(data.maxHireCount || 0),
          });
        } else {
          toast({
            title: "Error",
            description: "Could not load promo code details.",
            variant: "destructive",
          });
          navigate("/admin/promo-codes/manage");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to load data.",
          variant: "destructive",
        });
        navigate("/admin/promo-codes/manage");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, toast]);

  // Handlers (Vehicle Class logic kept but won't do much until list is populated)
  const handleVehicleClassChange = (classId: number) => {
    setFormData((prev) => ({
      ...prev,
      vehicleClassIds: prev.vehicleClassIds.includes(classId)
        ? prev.vehicleClassIds.filter((id) => id !== classId)
        : [...prev.vehicleClassIds, classId],
    }));
  };

  const handleSelectAll = () => {
    // Disabled since list is empty
    // if (formData.vehicleClassIds.length === vehicleClasses.length) {
    //   setFormData({ ...formData, vehicleClassIds: [] });
    // } else {
    //   setFormData({ ...formData, vehicleClassIds: vehicleClasses.map((vc) => vc.id) });
    // }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSubmitting(true);

    try {
      // 2. Prepare Update Payload
      const payload: PromoCodeUpdateRequest = {
        code: formData.code,
        description: formData.description,
        discountType: formData.discountIn,
        discountValue: Number(formData.discountValue),
        maxDiscountAmount: Number(formData.maxAmount),
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        isActive: formData.isActive,
        isFirstTimeOnly: formData.isFirstTimeOnly,
        maxUsagePerCustomer: Number(formData.maxCountPerUser),
        maxUsage: Number(formData.maxUsage),
        minimumHireCount: Number(formData.minimumHireCount),
        maxHireCount: Number(formData.maxHireCount),
        vehicleClassIds: formData.vehicleClassIds, // Sending existing IDs back
      };

      // 3. Call API
      const response = await promoService.update(Number(id), payload);

      if (response.success) {
        toast({
          title: "Success",
          description: `Promo code "${response.data.code}" updated successfully.`,
        });
        navigate("/admin/promo-codes/manage");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update promo code.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Update failed:", error);
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
          <h1 className="text-2xl font-semibold text-[#6330B8]">Edit Promo Code</h1>
          <p className="text-muted-foreground">Update promo code information for {formData.code}</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/promo-codes/manage")}>
          Back to List
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Promo Code Details */}
          <Card>
            <CardHeader>
              <CardTitle>Promo Code Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code <span className="text-red-500">*</span></Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Vehicle Classes (Stubbed) */}
              <div className="space-y-2">
                <Label>Applicable Vehicle Classes</Label>
                <div className="border rounded-lg p-4 space-y-3 bg-muted/10">
                  <p className="text-sm text-muted-foreground text-center">
                    Vehicle class selection is temporarily unavailable. Existing selections are preserved.
                  </p>
                  {/* 
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 opacity-50 pointer-events-none">
                     ... Checkboxes would go here ...
                  </div> 
                  */}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountIn">Discount Type</Label>
                  <Select
                    value={formData.discountIn}
                    onValueChange={(value) => setFormData({ ...formData, discountIn: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                      <SelectItem value="FIXED">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue">Discount Value <span className="text-red-500">*</span></Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                />
                <Label htmlFor="isActive" className="cursor-pointer font-medium">
                  Is Active
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Limitations */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxAmount">Maximum Discount Amount</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    step="0.01"
                    value={formData.maxAmount}
                    onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2 pt-8">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isFirstTimeOnly"
                      checked={formData.isFirstTimeOnly}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isFirstTimeOnly: checked as boolean })
                      }
                    />
                    <Label htmlFor="isFirstTimeOnly" className="cursor-pointer">
                      Valid for First Time Users Only
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxCountPerUser">Max Usage Per User</Label>
                  <Input
                    id="maxCountPerUser"
                    type="number"
                    value={formData.maxCountPerUser}
                    onChange={(e) => setFormData({ ...formData, maxCountPerUser: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUsage">Global Max Usage</Label>
                  <Input
                    id="maxUsage"
                    type="number"
                    value={formData.maxUsage}
                    onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumHireCount">Min Past Hires Required</Label>
                  <Input
                    id="minimumHireCount"
                    type="number"
                    value={formData.minimumHireCount}
                    onChange={(e) => setFormData({ ...formData, minimumHireCount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxHireCount">Max Past Hires Allowed</Label>
                  <Input
                    id="maxHireCount"
                    type="number"
                    value={formData.maxHireCount}
                    onChange={(e) => setFormData({ ...formData, maxHireCount: e.target.value })}
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
              onClick={() => navigate("/admin/promo-codes/manage")}
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
                "Update Promo Code"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}