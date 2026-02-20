import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DeleteManufacturer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  // Mock data - in real app, fetch based on id
  const manufacturer = {
    manufacturer: "Honda",
    manufacturerCode: "Honda",
    dateModified: "12/10/2018 12:45:28 PM",
  };

  const handleDelete = () => {
    toast({
      title: "Manufacturer Deleted",
      description: `${manufacturer.manufacturer} has been removed from the system.`,
    });
    navigate("/admin/vehicle-makes/manage");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#6330B8]">Delete Manufacturer</h1>
        <p className="text-muted-foreground mt-1">Review and confirm deletion (ID: {id})</p>
      </div>

      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600">Confirm Deletion</CardTitle>
          </div>
          <CardDescription>
            Are you sure you want to delete this manufacturer? This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Manufacturer Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-[#6330B8]">Manufacturer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Manufacturer</p>
                <p className="font-medium">{manufacturer.manufacturer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Manufacturer Code</p>
                <p className="font-medium">{manufacturer.manufacturerCode || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date Modified</p>
                <p className="font-medium">{manufacturer.dateModified}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/vehicle-makes/manage")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Manufacturer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
