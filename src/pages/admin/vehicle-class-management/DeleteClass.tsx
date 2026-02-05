import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DeleteClass() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  // Mock data - in real app, fetch based on id
  const vehicleClass = {
    className: "ECONOMY",
    classCode: "ECON",
    showInApp: true,
    fareScheme: "BTG APP",
    corporateFareScheme: "BTG APP",
    roadTripFareScheme: "BTG APP",
    appFareScheme: "BTG APP",
    commission: "0",
  };

  const handleDelete = () => {
    toast({
      title: "Vehicle Class Deleted",
      description: `${vehicleClass.className} has been removed from the system.`,
    });
    navigate("/admin/vehicle-classes/manage");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#6330B8]">Delete Vehicle Class</h1>
        <p className="text-muted-foreground mt-1">Review and confirm deletion (ID: {id})</p>
      </div>

      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600">Confirm Deletion</CardTitle>
          </div>
          <CardDescription>
            Are you sure you want to delete this vehicle class? This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Basic Class Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-[#6330B8]">Basic Class Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Class Name</p>
                <p className="font-medium">{vehicleClass.className}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class Code</p>
                <p className="font-medium">{vehicleClass.classCode || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Show in App</p>
                <Badge variant={vehicleClass.showInApp ? "default" : "secondary"}>
                  {vehicleClass.showInApp ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Fare Schemes */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3 text-[#6330B8]">Fare Schemes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Fare Scheme</p>
                <p className="font-medium">{vehicleClass.fareScheme || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Corporate Fare Scheme</p>
                <p className="font-medium">{vehicleClass.corporateFareScheme || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RoadTrip Fare Scheme</p>
                <p className="font-medium">{vehicleClass.roadTripFareScheme || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">App Fare Scheme</p>
                <p className="font-medium">{vehicleClass.appFareScheme || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commission</p>
                <p className="font-medium">{vehicleClass.commission}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/vehicle-classes/manage")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Class
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
