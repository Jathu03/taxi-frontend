import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Services
import promoService from "@/services/promo-codes/promoService";
import type { PromoCodeResponse } from "@/services/promo-codes/types";

export default function DeletePromoCode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [promoCode, setPromoCode] = useState<PromoCodeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch Promo Code Data
  useEffect(() => {
    const fetchPromoCode = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await promoService.getById(Number(id));
        if (response.success) {
          setPromoCode(response.data);
        } else {
          toast({
            title: "Error",
            description: "Could not fetch promo code details.",
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

    fetchPromoCode();
  }, [id, navigate, toast]);

  // 2. Handle Delete
  const handleDelete = async () => {
    if (!id || !promoCode) return;

    setIsDeleting(true);
    try {
      const response = await promoService.delete(Number(id));
      
      if (response.success) {
        toast({
          title: "Promo Code Deleted",
          description: `${promoCode.code} has been removed from the system.`,
          variant: "destructive", // Red toast for delete action
        });
        navigate("/admin/promo-codes/manage");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete promo code.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
      </div>
    );
  }

  if (!promoCode) return null;

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
                <p className="font-medium">{promoCode.description || "-"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Vehicle Classes:</span>
                <p className="font-medium">
                  {promoCode.vehicleClassIds && promoCode.vehicleClassIds.length > 0 
                    ? `${promoCode.vehicleClassIds.length} Classes Selected` 
                    : "All Classes"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Discount Type:</span>
                <p className="font-medium">{promoCode.discountType}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Discount Value:</span>
                <p className="font-medium">
                  {promoCode.discountValue}
                  {promoCode.discountType === "PERCENTAGE" ? "%" : ""}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Max Amount:</span>
                <p className="font-medium">{promoCode.maxDiscountAmount?.toFixed(2) || "0.00"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Max Count Per User:</span>
                <p className="font-medium">{promoCode.maxUsagePerCustomer || 0}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Max Usage:</span>
                <p className="font-medium">{promoCode.maxUsage || 0}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Start Date:</span>
                <p className="font-medium">
                  {promoCode.startDate ? new Date(promoCode.startDate).toLocaleString() : "-"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">End Date:</span>
                <p className="font-medium">
                  {promoCode.endDate ? new Date(promoCode.endDate).toLocaleString() : "-"}
                </p>
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
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin/promo-codes/manage")}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Promo Code"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}