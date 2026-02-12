"use client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

export default function DeleteDriver() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data - replace with actual API call
  // In real implementation, use useParams() to fetch driver by id
  const driver = {
    code: "508 Nuwan",
    firstName: "Nuwan",
    lastName: "-",
    nic: "354335445354v",
    contactNumber: "0755555797",
  };

  const handleDelete = () => {
    toast({
      title: "Driver Deleted",
      description: `${driver.firstName} has been removed from the system.`,
      variant: "destructive",
    });
    navigate("/admin/drivers/manage");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Delete Driver</h1>
          <p className="text-muted-foreground">Confirm driver deletion</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/drivers/manage")}>
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
              <strong>Warning:</strong> This action cannot be undone. This will permanently delete the driver account
              and remove all associated data from the system.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Driver Details:</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Code:</span>
                <p className="font-medium">{driver.code}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">{driver.firstName} {driver.lastName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">NIC:</span>
                <p className="font-medium">{driver.nic}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Contact:</span>
                <p className="font-medium">{driver.contactNumber}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => navigate("/admin/drivers/manage")}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Driver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
