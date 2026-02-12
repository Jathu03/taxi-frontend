import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { corporateService } from "@/services/corporate/corporateService";
import type { CorporateResponse } from "@/services/corporate/types";

export default function DeleteCorporate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [corporate, setCorporate] = useState<CorporateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch corporate data on mount
  useEffect(() => {
    const fetchCorporate = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await corporateService.getCorporateById(Number(id));
        setCorporate(data);
      } catch (error) {
        console.error("Failed to fetch corporate:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load data";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        navigate("/admin/corporate/manage");
      } finally {
        setLoading(false);
      }
    };

    fetchCorporate();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      await corporateService.deleteCorporate(Number(id));

      toast({
        title: "Success",
        description: `Corporate client "${corporate?.name}" deleted successfully.`,
      });

      navigate("/admin/corporate/manage");
    } catch (error) {
      console.error("Failed to delete corporate:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <span className="text-lg text-muted-foreground">
          Loading corporate details...
        </span>
      </div>
    );
  }

  if (!corporate) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <span className="text-lg text-muted-foreground">
          Corporate client not found.
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#6330B8]">
          Delete Corporate Client
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and confirm deletion
        </p>
      </div>

      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600">Confirm Deletion</CardTitle>
          </div>
          <CardDescription>
            Are you sure you want to delete this corporate client? This action
            cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Company Name</p>
                <p className="font-medium">{corporate.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company Code</p>
                <p className="font-medium">{corporate.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Primary Contact
                </p>
                <p className="font-medium">
                  {corporate.primaryContact || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Registration Date
                </p>
                <p className="font-medium">
                  {corporate.registrationDate
                    ? new Date(corporate.registrationDate).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{corporate.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{corporate.email}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{corporate.address || "-"}</p>
              </div>
            </div>
          </div>

          {/* Billing & Configuration */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Billing & Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Billing Type</p>
                <p className="font-medium">
                  {corporate.billingType || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credit Limit</p>
                <p className="font-medium">
                  {corporate.creditLimit ? corporate.creditLimit : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Cash Discount Rate
                </p>
                <p className="font-medium">
                  {corporate.cashDiscountRate
                    ? `${corporate.cashDiscountRate}%`
                    : "0%"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Credit Discount Rate
                </p>
                <p className="font-medium">
                  {corporate.creditDiscountRate
                    ? `${corporate.creditDiscountRate}%`
                    : "0%"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Quick Booking
                </p>
                <p className="font-medium">
                  {corporate.enableQuickBooking ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Require Voucher
                </p>
                <p className="font-medium">
                  {corporate.requireVoucher ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Require Cost Center
                </p>
                <p className="font-medium">
                  {corporate.requireCostCenter ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/corporate/manage")}
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}