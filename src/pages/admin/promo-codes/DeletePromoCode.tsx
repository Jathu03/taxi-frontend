"use client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DeletePromoCode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [promoCode, setPromoCode] = useState({
    code: "",
    description: "",
    vehicleClasses: "",
    discountIn: "",
    discountValue: 0,
    startDate: "",
    endDate: "",
    isActive: false,
    maxAmount: 0,
    maxCountPerUser: 0,
    maxUsage: 0,
  });

  useEffect(() => {
    // Mock data based on promo code ID - replace with actual API call
    const mockPromoCodes: Record<string, typeof promoCode> = {
      "1": {
        code: "Ride1",
        description: "Offer",
        vehicleClasses: "BUDGET, STANDARD",
        discountIn: "Percentage",
        discountValue: 30,
        startDate: "6/5/2018 5:34:00 AM",
        endDate: "7/31/2018 5:34:00 AM",
        isActive: false,
        maxAmount: 150.00,
        maxCountPerUser: 20,
        maxUsage: 500,
      },
      "2": {
        code: "MON101",
        description: "Weekend promotoin",
        vehicleClasses: "BUDGET, STANDARD",
        discountIn: "Percentage",
        discountValue: 10,
        startDate: "6/4/2018 12:02:00 PM",
        endDate: "6/7/2018 12:02:00 PM",
        isActive: false,
        maxAmount: 500.00,
        maxCountPerUser: 15,
        maxUsage: 100,
      },
      "3": {
        code: "MON100",
        description: "Days",
        vehicleClasses: "BUDGET, STANDARD",
        discountIn: "Amount",
        discountValue: 100,
        startDate: "5/28/2018 1:13:00 AM",
        endDate: "6/1/2018 1:13:00 AM",
        isActive: false,
        maxAmount: 0.00,
        maxCountPerUser: 5,
        maxUsage: 10,
      },
    };

    const promoData = mockPromoCodes[id || "1"] || mockPromoCodes["1"];
    setPromoCode(promoData);
  }, [id]);

  const handleDelete = () => {
    toast({
      title: "Promo Code Deleted",
      description: `${promoCode.code} has been removed from the system.`,
      variant: "destructive",
    });
    navigate("/admin/promo-codes/manage");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Delete Promo Code</h1>
          <p className="text-muted-foreground">Confirm promo code deletion</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/promo-codes/manage")}>
          Back to List
        </Button>
      </div>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Confirm Deletion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This action cannot be undone. This will permanently delete the promo code
              and remove all associated data from the system.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Promo Code Details:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground">Code:</span>
                <p className="font-medium text-base">{promoCode.code}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Description:</span>
                <p className="font-medium">{promoCode.description}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Vehicle Classes:</span>
                <p className="font-medium">{promoCode.vehicleClasses}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Discount Type:</span>
                <p className="font-medium">{promoCode.discountIn}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Discount Value:</span>
                <p className="font-medium">{promoCode.discountValue}{promoCode.discountIn === "Percentage" ? "%" : ""}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Max Amount:</span>
                <p className="font-medium">{promoCode.maxAmount.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Max Count Per User:</span>
                <p className="font-medium">{promoCode.maxCountPerUser}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Max Usage:</span>
                <p className="font-medium">{promoCode.maxUsage}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Start Date:</span>
                <p className="font-medium">{promoCode.startDate}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">End Date:</span>
                <p className="font-medium">{promoCode.endDate}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Status:</span>
                <div>
                  {promoCode.isActive ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => navigate("/admin/promo-codes/manage")}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Promo Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
