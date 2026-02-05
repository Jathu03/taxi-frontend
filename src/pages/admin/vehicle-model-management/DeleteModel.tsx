import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DeleteModel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  // Mock data - in real app, fetch based on id
  const model = {
    manufacturer: "Honda",
    model: "Grace",
    modelCode: "Grace",
    frame: "Sedan",
    transmissionType: "Automatic",
    trimLevel: "L",
    fuelInjectionType: "L",
    turbo: "",
    comments: "-",
    dateModified: "2/26/2018 8:23:59 PM",
  };

  const handleDelete = () => {
    toast({
      title: "Model Deleted",
      description: `${model.manufacturer} ${model.model} has been removed from the system.`,
    });
    navigate("/admin/vehicle-models/manage");
  };

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
                <p className="font-medium">{model.manufacturer}</p>
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
                <p className="font-medium">{model.fuelInjectionType || "-"}</p>
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
                <p className="font-medium">{model.dateModified}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/vehicle-models/manage")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Model
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
