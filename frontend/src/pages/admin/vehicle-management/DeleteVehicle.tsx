"use client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

export default function DeleteVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [vehicle, setVehicle] = useState({
    registrationNo: "",
    code: "",
    vehicleClass: "",
    manufacture: "",
    model: "",
    owner: "",
  });

  useEffect(() => {
    // Mock data based on vehicle ID - replace with actual API call
    const mockVehicles: Record<string, typeof vehicle> = {
      "1": {
        registrationNo: "LN-8978",
        code: "Ishan 15ft lorry",
        vehicleClass: "Lorry",
        manufacture: "Other",
        model: "Other",
        owner: "a.k.m ziyad",
      },
      "2": {
        registrationNo: "PF-1652",
        code: "Ishan Outside",
        vehicleClass: "VAN",
        manufacture: "Toyota",
        model: "KDH",
        owner: "Unknown",
      },
      "3": {
        registrationNo: "CAX-0036",
        code: "3221 Fazly",
        vehicleClass: "BUDGET",
        manufacture: "Suzuki",
        model: "Spacia",
        owner: "A M G Amarakoon",
      },
    };

    const vehicleData = mockVehicles[id || "1"] || mockVehicles["1"];
    setVehicle(vehicleData);
  }, [id]);

  const handleDelete = () => {
    toast({
      title: "Vehicle Deleted",
      description: `${vehicle.code} (${vehicle.registrationNo}) has been removed from the system.`,
      variant: "destructive",
    });
    navigate("/admin/vehicles/manage");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Delete Vehicle</h1>
          <p className="text-muted-foreground">Confirm vehicle deletion</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/vehicles/manage")}>
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
              <strong>Warning:</strong> This action cannot be undone. This will permanently delete the vehicle
              and remove all associated data from the system.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Vehicle Details:</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Registration No:</span>
                <p className="font-medium">{vehicle.registrationNo}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Code:</span>
                <p className="font-medium">{vehicle.code}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Class:</span>
                <p className="font-medium">{vehicle.vehicleClass}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Manufacture:</span>
                <p className="font-medium">{vehicle.manufacture}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Model:</span>
                <p className="font-medium">{vehicle.model}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Owner:</span>
                <p className="font-medium">{vehicle.owner}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => navigate("/admin/vehicles/manage")}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Vehicle
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
