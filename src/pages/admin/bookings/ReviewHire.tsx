import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";

export default function ReviewHire() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock booking data - replace with actual API call
  const bookingData = {
    bookingId: id || "270423",
    // Personal Details
    customer: "Minura Hilton Coordinetor",
    corporateId: "Hilton Hotel",
    contactNumber: "0773052522",
    name: "Minura Hilton Coordinetor",
    numberOfPassengers: "0",
    
    // Other Information
    vehicleClass: "VAN",
    fareScheme: "STANDARD",
    
    // Driver & Vehicle Information
    driverCode: "431 Parakrama",
    
    // Pickup Information
    pickupTime: "12/29/2024 22:00",
    pickupAddress: "Hilton Hotel, Colombo",
    dropAddress: "",
    specialRemarks: "D/P 14000/- (14S)",
    
    // Hire Completion
    completedTime: "12/29/2025 23:28",
    totalDistance: "118.00",
    totalWaitTime: "",
    totalWaitingFee: "",
    totalFare: "22770.00",
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/bookings/completed")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#6330B8]">Review Hire {bookingData.bookingId}</h1>
            <p className="text-muted-foreground mt-1">View completed hire details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/bookings/completed")}>
            Back to List
          </Button>
          <Button className="bg-[#6330B8] hover:bg-[#6330B8]/90">Print Invoice</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Customer</Label>
              <Input value={bookingData.customer} readOnly className="bg-gray-50" />
            </div>
            <div className="grid gap-2">
              <Label>Corporate Id</Label>
              <Input value={bookingData.corporateId} readOnly className="bg-gray-50" />
            </div>
            <div className="grid gap-2">
              <Label>Contact #</Label>
              <Input value={bookingData.contactNumber} readOnly className="bg-gray-50" />
            </div>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={bookingData.name} readOnly className="bg-gray-50" />
            </div>
            <div className="grid gap-2">
              <Label>No. of Pass</Label>
              <Input value={bookingData.numberOfPassengers} readOnly className="bg-gray-50" />
            </div>
          </CardContent>
        </Card>

        {/* Other Information */}
        <Card>
          <CardHeader>
            <CardTitle>Other Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Vehicle Class</Label>
              <Input value={bookingData.vehicleClass} readOnly className="bg-gray-50" />
            </div>
            <div className="grid gap-2">
              <Label>Fare Scheme</Label>
              <Input value={bookingData.fareScheme} readOnly className="bg-gray-50" />
            </div>
          </CardContent>
        </Card>

        {/* Driver & Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle>Driver & Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Driver Code</Label>
              <Input value={bookingData.driverCode} readOnly className="bg-gray-50" />
            </div>
          </CardContent>
        </Card>

        {/* Pickup Information */}
        <Card>
          <CardHeader>
            <CardTitle>Pickup Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Pickup Time</Label>
              <Input value={bookingData.pickupTime} readOnly className="bg-gray-50" />
            </div>
            <div className="grid gap-2">
              <Label>Pickup Address</Label>
              <Textarea value={bookingData.pickupAddress} readOnly className="bg-gray-50" rows={3} />
            </div>
            <div className="grid gap-2">
              <Label>Drop Address</Label>
              <Textarea value={bookingData.dropAddress || "N/A"} readOnly className="bg-gray-50" rows={2} />
            </div>
            <div className="grid gap-2">
              <Label>Special Remarks</Label>
              <Textarea value={bookingData.specialRemarks} readOnly className="bg-gray-50" rows={2} />
            </div>
          </CardContent>
        </Card>

        {/* Hire Completion */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Hire Completion</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label>Completed Time</Label>
              <Input value={bookingData.completedTime} readOnly className="bg-gray-50" />
            </div>
            <div className="grid gap-2">
              <Label>Total Distance</Label>
              <Input value={`${bookingData.totalDistance} km`} readOnly className="bg-gray-50" />
            </div>
            <div className="grid gap-2">
              <Label>Total Wait Time</Label>
              <Input value={bookingData.totalWaitTime || "N/A"} readOnly className="bg-gray-50" />
            </div>
            <div className="grid gap-2">
              <Label>Total Waiting Fee</Label>
              <Input value={bookingData.totalWaitingFee || "N/A"} readOnly className="bg-gray-50" />
            </div>
            <div className="grid gap-2">
              <Label>Total Fare</Label>
              <Input 
                value={`Rs. ${parseFloat(bookingData.totalFare).toLocaleString()}`} 
                readOnly 
                className="bg-green-50 font-semibold text-lg" 
              />
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <Checkbox id="sendSMS" />
              <Label htmlFor="sendSMS" className="cursor-pointer">Send Client SMS</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate("/admin/bookings/completed")}>
              Close
            </Button>
            <Button variant="outline" className="bg-blue-50 hover:bg-blue-100">
              Send Invoice Email
            </Button>
            <Button className="bg-[#6330B8] hover:bg-[#6330B8]/90">
              Download Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
