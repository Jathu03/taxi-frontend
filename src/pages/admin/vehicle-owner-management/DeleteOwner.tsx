import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DeleteOwner() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  // Mock data - in real app, fetch based on id
  const [ownerData] = useState({
    personalCompanyName: "Jegath Fernanado",
    nicBusinessReg: "601390698v",
    primaryContact: "0778406882",
    secondaryContact: "0112840625",
    postalAddress: "No 91 Piliyndala Road, maharagma",
    email: "jagathnf123@gmail.com",
    company: "",
    dateModified: "1/17/2018 12:25:25 PM",
  });

  const handleDelete = () => {
    // Here you would typically make an API call to delete the owner
    console.log("Deleting owner with ID:", id);
    
    toast({
      title: "Success",
      description: "Vehicle owner has been deleted successfully.",
    });

    navigate("/admin/vehicle-owners/manage");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Delete Vehicle Owner</h1>
          <p className="text-muted-foreground mt-1">Review owner details before deletion</p>
        </div>
      </div>

      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-700">Confirm Deletion</CardTitle>
          </div>
          <CardDescription>
            Are you sure you want to delete this vehicle owner? This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Personal/Company Name</p>
              <p className="text-sm font-semibold">{ownerData.personalCompanyName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">NIC/Business Registration</p>
              <p className="text-sm font-semibold">{ownerData.nicBusinessReg}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Primary Contact</p>
              <p className="text-sm font-semibold">{ownerData.primaryContact}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Secondary Contact</p>
              <p className="text-sm font-semibold">{ownerData.secondaryContact}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm font-semibold">{ownerData.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Company</p>
              <p className="text-sm font-semibold">{ownerData.company || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Postal Address</p>
              <p className="text-sm font-semibold">{ownerData.postalAddress}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date Modified</p>
              <p className="text-sm font-semibold">{ownerData.dateModified}</p>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/vehicle-owners/manage")}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Owner
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
