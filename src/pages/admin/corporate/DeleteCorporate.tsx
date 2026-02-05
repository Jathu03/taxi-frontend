import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DeleteCorporate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  // Mock data - in real app, fetch based on id
  const corporate = {
    id: "1",
    name: "Codezync PVT Ltd",
    code: "CODE",
    primaryContact: "Aneef Fashir",
    phone: "0773260907",
    email: "aneef@codezync.com",
    address: "123 Tech Street, Colombo 03",
    date: "2024-01-15",
    cashDiscountRate: "5%",
    creditDiscountRate: "3%",
    enableQuickBooking: "Yes",
  };

  const handleDelete = () => {
    console.log("Deleting corporate:", id);
    
    toast({
      title: "Success",
      description: "Corporate client deleted successfully.",
    });
    
    navigate("/admin/corporate/manage");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#6330B8]">Delete Corporate Client</h1>
        <p className="text-muted-foreground mt-1">Review and confirm deletion</p>
      </div>

      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600">Confirm Deletion</CardTitle>
          </div>
          <CardDescription>
            Are you sure you want to delete this corporate client? This action cannot be undone.
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
                <p className="text-sm text-muted-foreground">Primary Contact</p>
                <p className="font-medium">{corporate.primaryContact}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration Date</p>
                <p className="font-medium">{corporate.date}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
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
                <p className="font-medium">{corporate.address}</p>
              </div>
            </div>
          </div>

          {/* Discount & Configuration */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Discount & Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Cash Discount Rate</p>
                <p className="font-medium">{corporate.cashDiscountRate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credit Discount Rate</p>
                <p className="font-medium">{corporate.creditDiscountRate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Enable Quick Booking</p>
                <p className="font-medium">{corporate.enableQuickBooking}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirm Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/corporate/manage")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
