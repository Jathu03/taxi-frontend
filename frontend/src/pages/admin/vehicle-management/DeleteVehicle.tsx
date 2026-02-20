"use client";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Services and Types
import vehicleService from "@/services/vehicles/vehicleService";
import type { VehicleResponse } from "@/services/vehicles/types";

export default function DeleteVehicle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch Vehicle Details
  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await vehicleService.getById(Number(id));
        if (response.success) {
          setVehicle(response.data);
        } else {
          toast({
            title: "Error",
            description: "Could not fetch vehicle details.",
            variant: "destructive",
          });
          navigate("/admin/vehicles/manage");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to load data.",
          variant: "destructive",
        });
        navigate("/admin/vehicles/manage");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [id, navigate, toast]);

  // 2. Handle Delete
  const handleDelete = async () => {
    if (!id || !vehicle) return;

    setIsDeleting(true);
    try {
      const response = await vehicleService.delete(Number(id));
      
      if (response.success) {
        toast({
          title: "Vehicle Deleted",
          description: `${vehicle.vehicleCode} (${vehicle.registrationNumber}) has been removed.`,
        });
        navigate("/admin/vehicles/manage");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete vehicle.",
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
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
          <p className="text-muted-foreground">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#6330B8]">Delete Vehicle</h1>
        <p className="text-muted-foreground mt-1">Review and confirm deletion (ID: {id})</p>
      </div>

      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600">Confirm Deletion</CardTitle>
          </div>
          <CardDescription>
            Are you sure you want to delete this vehicle? This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          
          {/* Registration Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-[#6330B8]">Registration Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Vehicle Code</p>
                <p className="font-medium">{vehicle.vehicleCode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration No</p>
                <p className="font-medium">{vehicle.registrationNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chassis No</p>
                <p className="font-medium">{vehicle.chassisNumber || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reg. Date</p>
                <p className="font-medium">{vehicle.registrationDate || "-"}</p>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3 text-[#6330B8]">Vehicle Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Manufacturer</p>
                <p className="font-medium">{vehicle.makeName || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-medium">{vehicle.modelName || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-medium">{vehicle.className || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fuel Type</p>
                <p className="font-medium">{vehicle.fuelType || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-medium">{vehicle.manufactureYear || "-"}</p>
              </div>
            </div>
          </div>

          {/* Capacity & Ownership */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3 text-[#6330B8]">Capacity & Ownership</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Passenger Capacity</p>
                <p className="font-medium">{vehicle.passengerCapacity || "0"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Luggage Capacity</p>
                <p className="font-medium">{vehicle.luggageCapacity || "0"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="font-medium">{vehicle.ownerName || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{vehicle.companyName || "-"}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3 text-[#6330B8]">Additional Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Comments</p>
                <p className="font-medium">{vehicle.comments || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date Modified</p>
                <p className="font-medium">{new Date(vehicle.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/vehicles/manage")}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Vehicle"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}