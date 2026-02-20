import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Services and Types
import ownerService from "@/services/vehicle-owner/ownerService";
import type { VehicleOwnerResponse } from "@/services/vehicle-owner/types";

export default function DeleteOwner() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [ownerData, setOwnerData] = useState<VehicleOwnerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch Owner Details on Mount
  useEffect(() => {
    const fetchOwnerDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await ownerService.getById(Number(id));
        if (response.success) {
          setOwnerData(response.data);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch owner details.",
          });
          navigate("/admin/vehicle-owners/manage");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while fetching details.",
        });
        navigate("/admin/vehicle-owners/manage");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnerDetails();
  }, [id, navigate, toast]);

  // 2. Handle Delete Action
  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);

    try {
      const response = await ownerService.delete(Number(id));
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Vehicle owner has been deleted successfully.",
        });
        navigate("/admin/vehicle-owners/manage");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to delete owner.",
        });
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "An unexpected error occurred.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
          <p className="text-muted-foreground">Loading owner details...</p>
        </div>
      </div>
    );
  }

  // Error State (if loading finished but no data)
  if (!ownerData) {
    return null; // Or a specific error component, but usually useEffect redirects before this
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Delete Vehicle Owner</h1>
          <p className="text-muted-foreground mt-1">Review owner details before deletion</p>
        </div>
      </div>

      <Card className="border-red-200 shadow-sm">
        <CardHeader className="bg-red-50/50 pb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-700">Confirm Deletion</CardTitle>
          </div>
          <CardDescription className="text-red-600/80">
            Are you sure you want to delete this vehicle owner? This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-6 bg-white border rounded-lg shadow-sm">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Personal/Company Name</p>
              <p className="text-base font-semibold text-gray-900">{ownerData.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">NIC/Business Registration</p>
              <p className="text-base font-semibold text-gray-900">{ownerData.nicOrBusinessReg || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Primary Contact</p>
              <p className="text-base font-semibold text-gray-900">{ownerData.primaryContact}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Secondary Contact</p>
              <p className="text-base font-semibold text-gray-900">{ownerData.secondaryContact || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
              <p className="text-base font-semibold text-gray-900">{ownerData.email || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Company</p>
              <p className="text-base font-semibold text-gray-900">{ownerData.company || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground mb-1">Postal Address</p>
              <p className="text-base font-semibold text-gray-900">{ownerData.postalAddress || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Date Created</p>
              <p className="text-base font-semibold text-gray-900">
                {new Date(ownerData.createdAt).toLocaleString()}
              </p>
            </div>
             <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
              <p className="text-base font-semibold text-gray-900">
                {new Date(ownerData.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-2">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/vehicle-owners/manage")}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Owner"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}