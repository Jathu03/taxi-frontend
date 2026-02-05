"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function AddPromoCode() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    vehicleClasses: [] as string[],
    discountIn: "Percentage",
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

  const vehicleClassOptions = [
    "Bus",
    "TUK",
    "Mini Van",
    "BUDGET",
    "Lorry",
    "Person",
    "Budget",
    "ECONOMY",
    "BTG VAN",
    "STANDARD",
    "Double Cab",
    "VAN",
    "LUXURY",
  ];

  const handleVehicleClassChange = (className: string) => {
    setFormData((prev) => ({
      ...prev,
      vehicleClasses: prev.vehicleClasses.includes(className)
        ? prev.vehicleClasses.filter((c) => c !== className)
        : [...prev.vehicleClasses, className],
    }));
  };

  const handleSelectAll = () => {
    if (formData.vehicleClasses.length === vehicleClassOptions.length) {
      setFormData({ ...formData, vehicleClasses: [] });
    } else {
      setFormData({ ...formData, vehicleClasses: [...vehicleClassOptions] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Promo Code Created Successfully",
      description: `Promo code "${formData.code}" has been created.`,
    });
    navigate("/admin/promo-codes/manage");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Create New Promo Code</h1>
          <p className="text-muted-foreground">Add a new promotional code to the system</p>
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
                  <Label htmlFor="code">Code</Label>
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

              {/* Vehicle Classes */}
              <div className="space-y-2">
                <Label>Vehicle Classes</Label>
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="selectAll"
                      checked={formData.vehicleClasses.length === vehicleClassOptions.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="selectAll" className="font-semibold cursor-pointer">
                      Select All
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {vehicleClassOptions.map((className) => (
                      <div key={className} className="flex items-center space-x-2">
                        <Checkbox
                          id={className}
                          checked={formData.vehicleClasses.includes(className)}
                          onCheckedChange={() => handleVehicleClassChange(className)}
                        />
                        <Label htmlFor={className} className="cursor-pointer">
                          {className}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountIn">Discount In</Label>
                  <Select
                    value={formData.discountIn}
                    onValueChange={(value) => setFormData({ ...formData, discountIn: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Percentage">Percentage</SelectItem>
                      <SelectItem value="Amount">Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue">Discount Value</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Is Active
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Limitations */}
          <Card>
            <CardHeader>
              <CardTitle>Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxAmount">Maximum Amount</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    value={formData.maxAmount}
                    onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-7">
                  <Checkbox
                    id="isFirstTimeOnly"
                    checked={formData.isFirstTimeOnly}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isFirstTimeOnly: checked as boolean })
                    }
                  />
                  <Label htmlFor="isFirstTimeOnly" className="cursor-pointer">
                    Is First Time Only
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxCountPerUser">Maximum Count Per User</Label>
                  <Input
                    id="maxCountPerUser"
                    type="number"
                    value={formData.maxCountPerUser}
                    onChange={(e) => setFormData({ ...formData, maxCountPerUser: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUsage">Maximum Usage</Label>
                  <Input
                    id="maxUsage"
                    type="number"
                    value={formData.maxUsage}
                    onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumHireCount">Minimum Hire Count</Label>
                  <Input
                    id="minimumHireCount"
                    type="number"
                    value={formData.minimumHireCount}
                    onChange={(e) => setFormData({ ...formData, minimumHireCount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxHireCount">Maximum Hire Count</Label>
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
            <Button type="button" variant="outline" onClick={() => navigate("/admin/promo-codes/manage")}>
              Cancel
            </Button>
            <Button type="submit">Create Promo Code</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
