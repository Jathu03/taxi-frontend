import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Services and Types
import modelService from "@/services/vehicle-model/modelService";
import type { VehicleModelResponse } from "@/services/vehicle-model/types";

export default function DeleteModel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [model, setModel] = useState<VehicleModelResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch Model Details
  useEffect(() => {
    const fetchModel = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await modelService.getById(Number(id));
        if (response.success) {
          setModel(response.data);
        } else {
          toast({
            title: "Error",
            description: "Could not fetch model details.",
            variant: "destructive",
          });
          navigate("/admin/vehicle-models/manage");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to load data.",
          variant: "destructive",
        });
        navigate("/admin/vehicle-models/manage");
      } finally {
        setIsLoading(false);
      }
    };

    fetchModel();
  }, [id, navigate, toast]);

  // 2. Handle Delete
  const handleDelete = async () => {
    if (!id || !model) return;

    setIsDeleting(true);
    try {
      const response = await modelService.delete(Number(id));
      
      if (response.success) {
        toast({
          title: "Model Deleted",
          description: `${model.makeName} ${model.model} has been removed from the system.`,
        });
        navigate("/admin/vehicle-models/manage");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete model.",
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

  if (!model) return null;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#6330B8]">Delete Vehicle Model</h1>
        <p className="text-muted-foreground mt-1">Review and confirm deletion (ID: {id})</p>
      </div>

      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600">Confirm Deletion</CardTitle>
          </div>
          <CardDescription>
            Are you sure you want to delete this vehicle model? This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Basic Model Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-[#6330B8]">Basic Model Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Manufacturer</p>
                <p className="font-medium">{model.makeName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-medium">{model.model}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model Code</p>
                <p className="font-medium">{model.modelCode || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Frame</p>
                <p className="font-medium">{model.frame || "-"}</p>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3 text-[#6330B8]">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Transmission Type</p>
                <p className="font-medium">{model.transmissionType || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trim Level</p>
                <p className="font-medium">{model.trimLevel || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fuel Injection Type</p>
                <p className="font-medium">{model.fuelType || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Turbo</p>
                <p className="font-medium">{model.turbo || "-"}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3 text-[#6330B8]">Additional Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Comments</p>
                <p className="font-medium">{model.comments || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date Modified</p>
                <p className="font-medium">{new Date(model.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/vehicle-models/manage")}
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
                "Delete Model"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}